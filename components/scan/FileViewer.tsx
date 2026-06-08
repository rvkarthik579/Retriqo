import { IconDownload, IconExternalLink } from '@tabler/icons-react'

interface FileViewerProps {
  fileName: string
  fileUrl: string
  fileSize?: number
  machineName: string
  reportDate: string
  remarks?: string
  nextInspectionDate?: string
  companyName?: string
  uploaderName?: string
}

function formatFileSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileViewer({ 
  fileName, fileUrl, fileSize, machineName, reportDate, remarks, nextInspectionDate, companyName, uploaderName
}: FileViewerProps) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const isPDF = ext === 'pdf'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 480 }}>
      {/* File info */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: 20
      }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          File
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, wordBreak: 'break-all' }}>
          {fileName}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {ext?.toUpperCase()}{fileSize ? ` · ${formatFileSize(fileSize)}` : ''}
        </div>
      </div>

      {/* Download */}
      <a
        href={fileUrl}
        download={fileName}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          padding: '20px 24px',
          background: 'var(--accent)',
          borderRadius: 12,
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.125rem',
          fontWeight: 600,
          transition: 'all 150ms ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#7c74ff'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
      >
        <IconDownload size={22} />
        Download File
      </a>

      {isPDF && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 24px',
            background: 'transparent',
            border: '1px solid var(--border-hover)',
            borderRadius: 10,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9375rem',
          }}
        >
          <IconExternalLink size={16} />
          View in Browser
        </a>
      )}

      {/* Report meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {[
          { label: 'Machine', value: machineName },
          { label: 'Report Date', value: new Date(reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
          companyName ? { label: 'Company', value: companyName } : null,
          uploaderName ? { label: 'Inspector', value: uploaderName } : null,
          nextInspectionDate ? { label: 'Next Inspection', value: new Date(nextInspectionDate).toLocaleDateString() } : null,
        ].filter((item): item is { label: string; value: string } => item !== null).map((item) => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: '1px solid var(--border)'
          }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {item.label}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {remarks && (
        <div style={{
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 10,
        }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Inspector Notes
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {remarks}
          </p>
        </div>
      )}
    </div>
  )
}
