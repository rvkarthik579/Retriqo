'use client'

import { useEffect, useState } from 'react'
import PinEntry from '@/components/scan/PinEntry'
import FileViewer from '@/components/scan/FileViewer'
import { IconQrcode, IconAlertTriangle, IconClock } from '@tabler/icons-react'

type ScanState = 'loading' | 'pin_required' | 'valid' | 'expired' | 'revoked' | 'locked' | 'error'

interface ScanData {
  fileName: string
  fileUrl: string
  fileSize?: number
  status: 'pass' | 'fail' | 'needs_attention'
  machineName: string
  reportDate: string
  expiryDate: string | null
  remarks?: string
  nextInspectionDate?: string
  companyName?: string
  uploaderName?: string
  requiresPin: boolean
}

const statusConfig = {
  pass: { label: 'PASS', color: 'var(--success)', bg: 'rgba(61,255,160,0.08)', border: 'rgba(61,255,160,0.2)' },
  fail: { label: 'FAIL', color: 'var(--danger)', bg: 'rgba(255,90,90,0.08)', border: 'rgba(255,90,90,0.2)' },
  needs_attention: { label: 'NEEDS ATTENTION', color: 'var(--warning)', bg: 'rgba(240,192,96,0.08)', border: 'rgba(240,192,96,0.2)' },
}

export default function ScanPage({ params }: { params: { qr_id: string } }) {
  const { qr_id } = params as { qr_id: string }
  const [state, setState] = useState<ScanState>('loading')
  const [scanData, setScanData] = useState<ScanData | null>(null)
  const [pinError, setPinError] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [expiredDate, setExpiredDate] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
    fetchScanData()
  }, [qr_id])

  async function fetchScanData(pin?: string) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: qrCode, error } = await supabase
        .from('qr_codes')
        .select('*, files(*, reports(*, projects(*)))')
        .eq('qr_unique_id', qr_id)
        .single()

      if (error || !qrCode) {
        setErrorMessage('Invalid QR code')
        setState('error')
        return
      }
      
      if (!qrCode.is_active) {
        setState('revoked')
        return
      }
      
      if (qrCode.expiry_date && new Date(qrCode.expiry_date) < new Date()) {
        setExpiredDate(qrCode.expiry_date)
        setState('expired')
        return
      }

      // Map the qrCode data to ScanData
      const file = qrCode.files
      const report = file?.reports
      const project = report?.projects
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-qr-files')
        .getPublicUrl(file?.file_path || '')

      const scanDataObj: ScanData = {
        fileName: file?.file_name || 'Unknown',
        fileUrl: publicUrl,
        fileSize: file?.file_size,
        status: report?.status || 'pass',
        machineName: project?.machine_name || 'Unknown',
        reportDate: report?.created_at || new Date().toISOString(),
        expiryDate: qrCode.expiry_date,
        remarks: report?.remarks,
        requiresPin: false
      }
      
      setScanData(scanDataObj)
      setState('valid')
      
      // Cache for offline
      if ('caches' in window) {
        try {
          const cache = await caches.open('project-qr-scan-v1')
          cache.add(window.location.href)
        } catch {}
      }
    } catch {
      setErrorMessage('Network error. Check your connection.')
      setState('error')
    }
  }

  async function handlePinSubmit(pin: string) {
    setPinError(false)
    await fetchScanData(pin)
  }

  // Loading state
  if (state === 'loading') {
    return (
      <ScanShell>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 60, height: 60,
            background: 'rgba(108,99,255,0.1)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <IconQrcode size={28} color="var(--accent-light)" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="skeleton" style={{ height: 20, width: 200, margin: '0 auto 12px' }} />
            <div className="skeleton" style={{ height: 16, width: 150, margin: '0 auto' }} />
          </div>
          <div className="skeleton" style={{ height: 52, width: '100%', maxWidth: 320, borderRadius: 10 }} />
        </div>
      </ScanShell>
    )
  }

  // PIN required
  if (state === 'pin_required') {
    return (
      <ScanShell>
        <PinEntry
          onSubmit={handlePinSubmit}
          error={pinError}
          locked={false}
          attemptsLeft={attemptsLeft}
        />
      </ScanShell>
    )
  }

  // Locked
  if (state === 'locked') {
    return (
      <ScanShell>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconAlertTriangle size={28} color="var(--danger)" />
          </div>
          <h1 className="font-geist" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>
            Access Locked
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 300, lineHeight: 1.7 }}>
            Too many incorrect PIN attempts. Contact the report owner for access.
          </p>
        </div>
      </ScanShell>
    )
  }

  // Expired
  if (state === 'expired') {
    return (
      <ScanShell>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconClock size={28} color="var(--danger)" />
          </div>
          <h1 className="font-geist" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>
            QR Code Expired
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.7 }}>
            This QR code expired on{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {expiredDate ? new Date(expiredDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'an earlier date'}
            </strong>. Contact the report owner for an updated code.
          </p>
        </div>
      </ScanShell>
    )
  }

  // Revoked
  if (state === 'revoked') {
    return (
      <ScanShell>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconAlertTriangle size={28} color="var(--danger)" />
          </div>
          <h1 className="font-geist" style={{ fontSize: '1.5rem', fontWeight: 700 }}>QR Code Revoked</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 300, lineHeight: 1.7 }}>
            This QR code has been deactivated by the report owner. Contact them for an updated code.
          </p>
        </div>
      </ScanShell>
    )
  }

  // Error
  if (state === 'error') {
    return (
      <ScanShell>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconAlertTriangle size={28} color="var(--danger)" />
          </div>
          <h1 className="font-geist" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 300, lineHeight: 1.7 }}>{errorMessage}</p>
        </div>
      </ScanShell>
    )
  }

  // Valid — show file
  if (state === 'valid' && scanData) {
    const s = statusConfig[scanData.status] || statusConfig.needs_attention
    return (
      <ScanShell>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%' }}>
          {/* Status — huge and bold */}
          <div style={{
            width: '100%', maxWidth: 480,
            padding: '24px 32px',
            background: s.bg,
            border: `2px solid ${s.border}`,
            borderRadius: 16,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Geist, sans-serif',
              fontSize: 'clamp(2rem, 10vw, 3.5rem)',
              fontWeight: 800,
              color: s.color,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {s.label}
            </div>
          </div>

          {/* Machine name */}
          <div style={{ textAlign: 'center' }}>
            <h1 className="font-geist" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 700, marginBottom: 4 }}>
              {scanData.machineName}
            </h1>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--accent-light)' }}>
              {qr_id}
            </p>
          </div>

          {/* File viewer */}
          <FileViewer
            fileName={scanData.fileName}
            fileUrl={scanData.fileUrl}
            fileSize={scanData.fileSize}
            machineName={scanData.machineName}
            reportDate={scanData.reportDate}
            remarks={scanData.remarks}
            nextInspectionDate={scanData.nextInspectionDate}
            companyName={scanData.companyName}
            uploaderName={scanData.uploaderName}
          />

          {/* Footer */}
          <div style={{ 
            marginTop: 8, paddingTop: 20, borderTop: '1px solid var(--border)',
            width: '100%', maxWidth: 480, textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <IconQrcode size={14} color="var(--text-muted)" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Powered by Project QR
              </span>
            </div>
            {scanData.expiryDate && (
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Expires {new Date(scanData.expiryDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </ScanShell>
    )
  }

  return null
}

function ScanShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Logo bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '16px 20px',
        background: 'rgba(7,8,15,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
        zIndex: 10
      }}>
        <div style={{ width: 24, height: 24, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconQrcode size={14} color="white" />
        </div>
        <span className="font-geist" style={{ fontSize: '0.875rem', fontWeight: 700 }}>Project QR</span>
      </div>

      <div className="animate-fade-up" style={{ 
        width: '100%', maxWidth: 520, 
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 64
      }}>
        {children}
      </div>
    </div>
  )
}
