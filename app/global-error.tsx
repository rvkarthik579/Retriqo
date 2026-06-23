'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#111', color: '#ff5a5a', minHeight: '100vh' }}>
          <h2>Global Application Crash</h2>
          <p>{error.message}</p>
          <button onClick={() => reset()} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>Try again</button>
        </div>
      </body>
    </html>
  )
}
