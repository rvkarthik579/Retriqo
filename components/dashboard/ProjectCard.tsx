import Link from 'next/link'
import { IconMapPin, IconCategory, IconFile, IconChevronRight, IconClock } from '@tabler/icons-react'

interface ProjectCardProps {
  id: string
  machineName: string
  location?: string
  projectType: string
  status?: 'pass' | 'fail' | 'needs_attention' | 'none'
  reportCount: number
  lastUpdated?: string
  loading?: boolean
}

const statusConfig = {
  pass: { label: 'Pass', color: 'var(--success)', bg: 'rgba(61,255,160,0.1)', border: 'rgba(61,255,160,0.2)' },
  fail: { label: 'Fail', color: 'var(--danger)', bg: 'rgba(255,90,90,0.1)', border: 'rgba(255,90,90,0.2)' },
  needs_attention: { label: 'Needs Attention', color: 'var(--warning)', bg: 'rgba(240,192,96,0.1)', border: 'rgba(240,192,96,0.2)' },
  none: { label: 'No Report', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)', border: 'var(--border)' },
}

function formatDate(date?: string) {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ProjectCard({ 
  id, machineName, location, projectType, status = 'none', reportCount, lastUpdated, loading
}: ProjectCardProps) {
  if (loading) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton" style={{ height: 26, width: 80 }} />
          <div className="skeleton" style={{ height: 26, width: 60 }} />
        </div>
        <div className="skeleton" style={{ height: 36, marginTop: 20 }} />
      </div>
    )
  }

  const s = statusConfig[status]

  return (
    <div className="card card-interactive" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <h3 className="font-geist" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {machineName}
          </h3>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 500,
            padding: '4px 10px', borderRadius: 4,
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0
          }}>
            {s.label}
          </span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
              <IconMapPin size={13} />
              <span>{location}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            <IconCategory size={13} />
            <span>{projectType}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconFile size={14} color="var(--text-muted)" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {reportCount} {reportCount === 1 ? 'report' : 'reports'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconClock size={14} color="var(--text-muted)" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {formatDate(lastUpdated)}
          </span>
        </div>
      </div>

      {/* Action */}
      <Link
        href={`/dashboard/projects/${id}`}
        className="btn btn-secondary btn-sm"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
      >
        <span>Open Project</span>
        <IconChevronRight size={16} />
      </Link>
    </div>
  )
}
