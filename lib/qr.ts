/**
 * QR Code utility functions
 */

/**
 * Generates a cryptographically secure QR unique ID in format QR-XXXXXXXXXXXX
 * where XXXXXXXXXXXX is a random 12-character alphanumeric string.
 * Uses crypto.getRandomValues() (Web Crypto API) for security.
 * Works in both browser and server environments.
 */
export function generateQRId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars (0,O,1,I)
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  let id = ''
  for (let i = 0; i < 12; i++) {
    id += chars[bytes[i] % chars.length]
  }
  return `QR-${id}`
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
