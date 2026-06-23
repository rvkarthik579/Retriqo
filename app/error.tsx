'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Next.js App Error Boundary Caught:", error)
  }, [error])

  return (
    <div className="landing-premium" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="premium-container" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>Something went wrong!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error.message || 'An unexpected error occurred.'}</p>
        <button
          className="premium-btn premium-btn-primary"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
