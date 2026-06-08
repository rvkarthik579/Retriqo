interface MetricCardProps {
  label: string
  value: string | number
  subtext?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'default' | 'success' | 'warning' | 'danger' | 'accent'
  loading?: boolean
}

const colorMap = {
  default: 'var(--text-primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  accent: 'var(--accent-light)',
}

export default function MetricCard({ 
  label, value, subtext, trend, trendValue, color = 'default', loading 
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="metric-card">
        <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 36, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '50%' }} />
      </div>
    )
  }

  return (
    <div className="metric-card animate-fade-up">
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color: colorMap[color] }}>
        {value}
      </div>
      {(subtext || trendValue) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {trendValue && (
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--text-muted)',
            }}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
            </span>
          )}
          {subtext && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{subtext}</span>
          )}
        </div>
      )}
    </div>
  )
}
