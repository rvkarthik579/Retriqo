/**
 * QR Code utility functions
 */

/**
 * Generates a QR unique ID in format QR-XXXX
 * where XXXX is a random 4-character alphanumeric string
 */
export function generateQRId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'QR-'
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Builds the public scan URL for a QR code
 */
export function buildScanUrl(qrUniqueId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : 'https://project-qr.vercel.app')
  return `${baseUrl}/scan/${qrUniqueId}`
}

/**
 * Formats an expiry date for display
 */
export function formatExpiry(date: string | null): string {
  if (!date) return 'Never expires'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

/**
 * Checks if a QR code is expired
 */
export function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false
  return new Date(expiryDate) < new Date()
}

/**
 * Calculates expiry date from preset
 */
export function getExpiryFromPreset(preset: '30d' | '90d' | '1y' | 'never'): string | null {
  if (preset === 'never') return null
  const now = new Date()
  switch (preset) {
    case '30d':
      now.setDate(now.getDate() + 30)
      break
    case '90d':
      now.setDate(now.getDate() + 90)
      break
    case '1y':
      now.setFullYear(now.getFullYear() + 1)
      break
  }
  return now.toISOString()
}
