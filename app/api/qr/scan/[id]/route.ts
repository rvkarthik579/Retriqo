import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import bcrypt from 'bcryptjs'
import { headers } from 'next/headers'

const MAX_ATTEMPTS = 3
const LOCKOUT_MINUTES = 15

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: qrUniqueId } = params
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
  const userAgent = headersList.get('user-agent') || ''
  const deviceType = /mobile|android|iphone|ipad/i.test(userAgent) ? 'mobile' : 'desktop'

  let pin: string | null = null
  try {
    const body = await request.json()
    pin = body.pin || null
  } catch {}

  try {
    // Use admin client to bypass RLS — this route serves unauthenticated public users
    const supabase = createSupabaseAdminClient()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'unknown'
    
    console.log('\n--- SCAN API DIAGNOSTIC ---')
    console.log('Received qrUniqueId:', qrUniqueId)
    console.log('Supabase URL:', supabaseUrl)
    console.log('Project Reference:', projectRef)
    console.log('Environment:', process.env.NODE_ENV)
    console.log('---------------------------')

    // Fetch QR code record first. Do not let embedded relationship errors mask QR existence.
    const { data: qr, error: qrError } = await supabase
      .from('qr_codes')
      .select(`
        id, qr_unique_id, password_hash, expiry_date, next_inspection_date,
        show_company, show_uploader_name, show_next_inspection, is_active,
        failed_pin_attempts, locked_until,
        files(id, file_name, file_path, file_size, file_type)
      `)
      .eq('qr_unique_id', qrUniqueId)
      .single()

    console.log('--- POST-QUERY RESULT ---')
    console.log('qrError:', JSON.stringify(qrError, null, 2))
    console.log('Returned row (nested):', qr ? 'Found' : 'Null')
    console.log('Full PostgREST error:', qrError ? JSON.stringify(qrError) : 'None')

    // Second test query
    const { data: simpleData, error: simpleError } = await supabase
      .from("qr_codes")
      .select("id, qr_unique_id")
      .eq("qr_unique_id", qrUniqueId)
    
    console.log('--- SIMPLE QUERY RESULT ---')
    console.log('Simple query data:', JSON.stringify(simpleData))
    console.log('Simple query error:', JSON.stringify(simpleError))
    console.log('---------------------------\n')

    if (qrError || !qr) {
      await logScan(supabase, null, ip, deviceType, true, 'QR_NOT_FOUND')
      return NextResponse.json({ status: 'error', message: 'QR code not found.' }, { status: 404 })
    }

    // Check if revoked
    if (!qr.is_active) {
      await logScan(supabase, qr.id, ip, deviceType, true, 'REVOKED')
      return NextResponse.json({ status: 'revoked', message: 'Access denied' }, { status: 403 })
    }

    // Check expiry
    if (qr.expiry_date && new Date(qr.expiry_date) < new Date()) {
      await logScan(supabase, qr.id, ip, deviceType, true, 'EXPIRED')
      return NextResponse.json({ status: 'expired', expiryDate: qr.expiry_date, message: 'QR expired' }, { status: 410 })
    }

    // Check database-backed PIN lockout
    if (qr.locked_until && new Date(qr.locked_until) > new Date()) {
    await logScan(supabase, qr.id, ip, deviceType, true, 'LOCKED_OUT')
      const secondsRemaining = Math.ceil((new Date(qr.locked_until).getTime() - new Date().getTime()) / 1000)
      return NextResponse.json({ 
        status: 'locked', 
        message: 'PIN locked',
        secondsRemaining 
      }, { status: 423 })
    }

    // PIN Verification
    if (qr.password_hash) {
      if (!pin) {
        return NextResponse.json({ status: 'pin_required' })
      }
      
      const isValid = await bcrypt.compare(pin, qr.password_hash)
      if (!isValid) {
        // Increment failed attempts
        const newAttempts = (qr.failed_pin_attempts || 0) + 1
        
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockedUntil = new Date()
          lockedUntil.setMinutes(lockedUntil.getMinutes() + LOCKOUT_MINUTES)
          
          await supabase.from('qr_codes')
            .update({ failed_pin_attempts: 0, locked_until: lockedUntil.toISOString() })
            .eq('id', qr.id)
            
          await logScan(supabase, qr.id, ip, deviceType, true, 'LOCKED_OUT')
          return NextResponse.json({ 
            status: 'locked', 
            message: 'PIN locked',
            secondsRemaining: LOCKOUT_MINUTES * 60 
          }, { status: 423 })
        } else {
          await supabase.from('qr_codes')
            .update({ failed_pin_attempts: newAttempts })
            .eq('id', qr.id)
            
          await logScan(supabase, qr.id, ip, deviceType, true, 'INVALID_PIN')
          return NextResponse.json({ 
            status: 'wrong_pin', 
            attemptsLeft: MAX_ATTEMPTS - newAttempts 
          })
        }
      } else if (qr.failed_pin_attempts > 0) {
        // Reset attempts on success
        await supabase.from('qr_codes')
          .update({ failed_pin_attempts: 0, locked_until: null })
          .eq('id', qr.id)
      }
    }

    interface FileRow { id: string; file_name: string; file_path: string; file_size: number; file_type: string }

    const file = Array.isArray(qr.files) ? qr.files[0] as unknown as FileRow : qr.files as unknown as FileRow
    console.log('Resolved file row:', JSON.stringify({
      id: file?.id,
      file_name: file?.file_name,
      file_path: file?.file_path,
      file_size: file?.file_size,
      file_type: file?.file_type,
      objectType: file?.constructor?.name,
    }))

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('id, status, remarks, created_at, project_id')
      .eq('file_id', file?.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    console.log('Report lookup:', JSON.stringify({
      file_id: file?.id,
      report,
      reportError,
    }))

    const { data: project, error: projectError } = report?.project_id
      ? await supabase
          .from('projects')
          .select('machine_name, user_id')
          .eq('id', report.project_id)
          .maybeSingle()
      : { data: null, error: null }

    console.log('Project lookup:', JSON.stringify({
      project_id: report?.project_id,
      project,
      projectError,
    }))

    const { data: user, error: userError } = project?.user_id
      ? await supabase
          .from('users')
          .select('name, company_name')
          .eq('id', project.user_id)
          .maybeSingle()
      : { data: null, error: null }

    console.log('User lookup:', JSON.stringify({
      user_id: project?.user_id,
      userFound: !!user,
      userError,
    }))

    // Get file URL via signed URL
    const { data: urlData, error: signedUrlError } = await supabase.storage
      .from('project-qr-files')
      .createSignedUrl(file?.file_path ?? '', 300)

    console.log('Signed URL lookup:', JSON.stringify({
      bucket: 'project-qr-files',
      path: file?.file_path,
      hasSignedUrl: !!urlData?.signedUrl,
      signedUrlError,
    }))

    const { data: downloadUrlData, error: downloadUrlError } = await supabase.storage
      .from('project-qr-files')
      .createSignedUrl(file?.file_path ?? '', 300, { download: file?.file_name || true })

    console.log('Download signed URL lookup:', JSON.stringify({
      bucket: 'project-qr-files',
      path: file?.file_path,
      download: file?.file_name || true,
      hasSignedUrl: !!downloadUrlData?.signedUrl,
      downloadUrlError,
    }))

    // Success — extract data
    await logScan(supabase, qr.id, ip, deviceType, false, null)

    return NextResponse.json({
      status: 'valid',
      data: {
        fileName: file?.file_name,
        fileUrl: urlData?.signedUrl,
        downloadUrl: downloadUrlData?.signedUrl || urlData?.signedUrl,
        fileSize: file?.file_size,
        status: (report?.status as string) || 'pass',
        machineName: project?.machine_name || 'Unknown Machine',
        reportDate: report?.created_at,
        expiryDate: qr.expiry_date,
        remarks: report?.remarks,
        nextInspectionDate: qr.show_next_inspection ? qr.next_inspection_date : null,
        companyName: qr.show_company ? user?.company_name : null,
        uploaderName: qr.show_uploader_name ? user?.name : null,
        requiresPin: !!qr.password_hash,
      }
    })

  } catch (err) {
    console.error('Scan error:', err)
    return NextResponse.json({ status: 'error', message: 'Internal server error.' }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function logScan(
  supabase: any,
  qrId: string | null,
  ip: string,
  deviceType: string,
  wasBlocked: boolean,
  blockReason: string | null
) {
  if (!qrId) return
  try {
    await supabase.from('scan_logs').insert({
      qr_id: qrId,
      scanned_at: new Date().toISOString(),
      ip_address: ip,
      device_type: deviceType,
      was_blocked: wasBlocked,
      block_reason: blockReason,
    })
  } catch {}
}
