'use client'

import { useState } from 'react'
import { IconCalendar } from '@tabler/icons-react'
import { getExpiryFromPreset, formatExpiry } from '@/lib/qr'

interface ExpiryPickerProps {
  value: string | null  // ISO string or null
  onChange: (value: string | null) => void
}

const presets = [
  { label: '30 Days', value: '30d' as const },
  { label: '90 Days', value: '90d' as const },
  { label: '1 Year', value: '1y' as const },
  { label: 'Never', value: 'never' as const },
]

export default function ExpiryPicker({ value, onChange }: ExpiryPickerProps) {
  const [activePreset, setActivePreset] = useState<string | null>('90d')
  const [customDate, setCustomDate] = useState('')

  function handlePreset(preset: '30d' | '90d' | '1y' | 'never') {
    setActivePreset(preset)
    setCustomDate('')
    onChange(getExpiryFromPreset(preset))
  }

  function handleCustomDate(date: string) {
    setCustomDate(date)
    setActivePreset('custom')
    if (date) {
      onChange(new Date(date).toISOString())
    } else {
      onChange(null)
    }
  }

  const preview = value 
    ? `This QR will invalidate on ${formatExpiry(value)}`
    : 'This QR will never expire'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Presets */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {presets.map(p => (
          <button
            key={p.value}
            type="button"
            className={`pill ${activePreset === p.value ? 'active' : ''}`}
            onClick={() => handlePreset(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom date */}
      <div>
        <label className="label" style={{ marginBottom: 8 }}>
          Custom date
        </label>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%' }}>
          <input
            type="date"
            className="input"
            value={customDate}
            onChange={e => handleCustomDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{ paddingLeft: 44 }}
          />
          <IconCalendar 
            size={18} 
            color="var(--text-muted)"
            style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* Preview */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(108,99,255,0.05)',
        border: '1px solid rgba(108,99,255,0.15)',
        borderRadius: 8,
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
      }}>
        {preview}
      </div>
    </div>
  )
}
