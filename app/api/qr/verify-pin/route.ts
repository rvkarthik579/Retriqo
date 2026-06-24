import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const { qrUniqueId, pin, checkOnly } = await request.json()

  if (!qrUniqueId) {
    return NextResponse.json({ valid: false, error: 'Missing data' }, { status: 400 })
  }

  const { data: qr, error } = await supabase
    .from('qr_codes')
    .select('id, password_hash, failed_pin_attempts, locked_until')
    .eq('qr_unique_id', qrUniqueId)
    .single()

  if (error || !qr) {
    return NextResponse.json({ valid: false, error: 'Not found' }, { status: 404 })
  }

  if (checkOnly) {
    return NextResponse.json({ 
      hasPin: !!qr.password_hash,
      locked: !!(qr.locked_until && new Date(qr.locked_until) > new Date())
    })
  }

  if (!pin) {
    return NextResponse.json({ valid: false, error: 'Missing pin' }, { status: 400 })
  }

  if (qr.locked_until && new Date(qr.locked_until) > new Date()) {
    const minutesLeft = Math.ceil(
      (new Date(qr.locked_until).getTime() - Date.now()) / 60000
    )
    return NextResponse.json({
      valid: false,
      locked: true,
      error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`
    })
  }

  if (!qr.password_hash) {
    return NextResponse.json({ valid: false, error: 'No PIN set' }, { status: 400 })
  }

  const isValid = await bcrypt.compare(pin, qr.password_hash)

  if (isValid) {
    await supabase
      .from('qr_codes')
      .update({ failed_pin_attempts: 0, locked_until: null })
      .eq('id', qr.id)

    return NextResponse.json({ valid: true })
  }

  const newAttempts = (qr.failed_pin_attempts || 0) + 1
  const shouldLock = newAttempts >= 3

  await supabase
    .from('qr_codes')
    .update({
      failed_pin_attempts: newAttempts,
      locked_until: shouldLock
        ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
        : null
    })
    .eq('id', qr.id)

  if (shouldLock) {
    await supabase.from('scan_logs').insert({
      qr_id: qr.id,
      scanned_at: new Date().toISOString(),
      was_blocked: true,
      block_reason: 'pin_lockout_15min'
    })
  }

  return NextResponse.json({
    valid: false,
    attemptsRemaining: Math.max(0, 3 - newAttempts),
    locked: shouldLock,
    error: shouldLock
      ? 'Too many failed attempts. Locked for 15 minutes.'
      : 'Wrong PIN.'
  })
}
