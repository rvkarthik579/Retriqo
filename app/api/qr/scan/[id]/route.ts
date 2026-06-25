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

    // Fetch QR code record
    const { data: qr, error: qrError } = await supabase
      .from('qr_codes')
      .select(`
        id, qr_unique_id, password_hash, expiry_date, next_inspection_date,
        show_company, show_uploader_name, show_next_inspection, is_active,
        failed_pin_attempts, locked_until,
        files(id, file_name, file_path, file_size, file_type,
          reports(id, status, remarks, created_at, project_id,
            projects(machine_name, user_id,
              users(name, company_name)
            )
          )
        )
      `)
      .eq('qr_unique_id', qrUniqueId)
      .single()

    if (qrError || !qr) {
      await logScan(supabase, null, ip, deviceType, true, 'QR_NOT_FOUND')
      return NextResponse.json({ status: 'error', message: 'QR code not found.' }, { status: 404 })
    }

    // Check if revoked
    if (!qr.is_active) {
      await logScan(supabase, qr.id, ip, deviceType, true, 'REVOKED')
      return NextResponse.json({ status: 'revoked' })
    }

    // Check expiry
    if (qr.expiry_date && new Date(qr.expiry_date) < new Date()) {
      await logScan(supabase, qr.id, ip, deviceType, true, 'EXPIRED')
      return NextResponse.json({ status: 'expired', expiryDate: qr.expiry_date })
    }

    // Check database-backed PIN lockout
    if (qr.locked_until && new Date(qr.locked_until) > new Date()) {
      const secondsRemaining = Math.ceil((new Date(qr.locked_until).getTime() - Date.now()) / 1000)
      await logScan(supabase, qr.id, ip, deviceType, true, 'LOCKED')
      return NextResponse.json({ status: 'locked', secondsRemaining })
    }

    // Clear expired lockout
    if (qr.locked_until && new Date(qr.locked_until) <= new Date()) {
      await supabase
        .from('qr_codes')
        .update({ failed_pin_attempts: 0, locked_until: null })
        .eq('id', qr.id)
    }

    // Check PIN if required
    if (qr.password_hash) {
      if (!pin) {
        return NextResponse.json({ status: 'pin_required' })
      }

      const pinValid = await bcrypt.compare(pin, qr.password_hash)
      if (!pinValid) {
        const newCount = (qr.failed_pin_attempts || 0) + 1

        if (newCount >= MAX_ATTEMPTS) {
          const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString()
          await supabase
            .from('qr_codes')
            .update({ failed_pin_attempts: newCount, locked_until: lockUntil })
            .eq('id', qr.id)
          await logScan(supabase, qr.id, ip, deviceType, true, 'WRONG_PIN_LOCKED')
          return NextResponse.json({ status: 'locked', locked: true })
        }

        await supabase
          .from('qr_codes')
          .update({ failed_pin_attempts: newCount })
          .eq('id', qr.id)
        await logScan(supabase, qr.id, ip, deviceType, true, 'WRONG_PIN')
        return NextResponse.json({
          status: 'wrong_pin',
          attemptsLeft: MAX_ATTEMPTS - newCount
        })
      }

      // Clear failed attempts on success
      await supabase
        .from('qr_codes')
        .update({ failed_pin_attempts: 0, locked_until: null })
        .eq('id', qr.id)
    }

    // Success — extract data
    await logScan(supabase, qr.id, ip, deviceType, false, null)

    interface FileRow { id: string; file_name: string; file_path: string; file_size: number; file_type: string; reports: ReportRow[] }
    interface ReportRow { id: string; status: string; remarks?: string; created_at: string; projects: ProjectRow[] }
    interface ProjectRow { machine_name: string; user_id: string; users: UserRow[] }
    interface UserRow { name?: string; company_name?: string }

    const file = qr.files as unknown as FileRow
    const report = Array.isArray(file?.reports) ? file.reports[0] as ReportRow : file?.reports as ReportRow
    const project = Array.isArray(report?.projects) ? report.projects[0] as ProjectRow : report?.projects as ProjectRow
    const user = Array.isArray(project?.users) ? project.users[0] as UserRow : project?.users as UserRow

    // Get file URL via signed URL
    const { data: urlData } = await supabase.storage
      .from('project-qr-files')
      .createSignedUrl(file?.file_path ?? '', 300)

    return NextResponse.json({
      status: 'valid',
      data: {
        fileName: file?.file_name,
        fileUrl: urlData?.signedUrl,
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
