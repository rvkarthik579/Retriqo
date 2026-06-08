'use client'

import { } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { buildScanUrl, formatExpiry } from '@/lib/qr'
import { IconDownload, IconExternalLink } from '@tabler/icons-react'

interface QRCardProps {
  qrUniqueId: string
  machineName: string
  fileName: string
  status: 'pass' | 'fail' | 'needs_attention'
  expiryDate: string | null
  generatedDate: string
  onDownload?: () => void
  animationDelay?: number
}

const statusConfig = {
  pass: { label: 'Pass', color: 'var(--success)', bg: 'rgba(61,255,160,0.1)', border: 'rgba(61,255,160,0.2)' },
  fail: { label: 'Fail', color: 'var(--danger)', bg: 'rgba(255,90,90,0.1)', border: 'rgba(255,90,90,0.2)' },
  needs_attention: { label: 'Needs Attention', color: 'var(--warning)', bg: 'rgba(240,192,96,0.1)', border: 'rgba(240,192,96,0.2)' },
}

export default function QRCard({ 
  qrUniqueId, machineName, fileName, status, expiryDate, generatedDate, onDownload, animationDelay = 0
}: QRCardProps) {
  const s = statusConfig[status]
  const scanUrl = buildScanUrl(qrUniqueId)

  return (
    <div 
      className="qr-card animate-pixel-build"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ 
            fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: 2
          }}>
            {machineName}
          </div>
          <div style={{ 
            fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {fileName}
          </div>
        </div>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', fontWeight: 500,
          padding: '4px 8px', borderRadius: 4, flexShrink: 0,
          background: s.bg, color: s.color, border: `1px solid ${s.border}`,
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {s.label}
        </span>
      </div>

      {/* QR Code */}
      <div style={{ 
        display: 'flex', justifyContent: 'center',
        padding: '20px',
        background: 'white',
        borderRadius: 10,
      }}>
        <QRCodeSVG
          value={scanUrl}
          size={160}
          bgColor="white"
          fgColor="#07080f"
          level="M"
        />
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>QR ID</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 500 }}>{qrUniqueId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expires</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: expiryDate ? 'var(--text-secondary)' : 'var(--success)' }}>{formatExpiry(expiryDate)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Generated</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {new Date(generatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href={scanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <IconExternalLink size={14} />
          Preview
        </a>
        {onDownload && (
          <button
            onClick={onDownload}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <IconDownload size={14} />
            Download
          </button>
        )}
      </div>
    </div>
  )
}
