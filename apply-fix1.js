import fs from 'fs'
import path from 'path'

// 1. Update app/scan/[qr_id]/page.tsx
const pagePath = path.join('app', 'scan', '[qr_id]', 'page.tsx')
let pageCode = fs.readFileSync(pagePath, 'utf8')

// Add 'locked' to status
pageCode = pageCode.replace(
  /useState<'loading' \| 'valid' \| 'expired' \| 'revoked' \| 'invalid' \| 'pin'>/,
  "useState<'loading' | 'valid' | 'expired' | 'revoked' | 'invalid' | 'pin' | 'locked'>"
)

// Replace verifyPin function
const verifyPinRegex = /async function verifyPin\(\) \{[\s\S]*?catch \{[\s\S]*?\}[\s\S]*?\}/
const newVerifyPin = `async function verifyPin() {
    if (pin.length !== 4) return

    try {
      const response = await fetch('/api/qr/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrUniqueId: qrId, pin })
      })
      const result = await response.json()

      if (result.valid) {
        await loadFileUrl(qrData!.files.file_path)
        setStatus('valid')
      } else {
        setPinError(result.error || 'Wrong PIN. Try again.')
        setPin('')
        if (result.locked) {
          setStatus('locked')
        }
      }
    } catch {
      setPinError('Verification failed. Try again.')
    }
  }`
pageCode = pageCode.replace(verifyPinRegex, newVerifyPin)

// Replace loadFileUrl
const loadFileUrlRegex = /async function loadFileUrl\(filePath: string\) \{[\s\S]*?\}/
const newLoadFileUrl = `async function loadFileUrl(filePath: string) {
    const { data, error } = await supabase.storage
      .from('project-qr-files')
      .createSignedUrl(filePath, 300) // 5 minutes, not 1 hour
    if (data?.signedUrl) setFileUrl(data.signedUrl)
    if (error) console.error('Signed URL error:', error)
  }`
pageCode = pageCode.replace(loadFileUrlRegex, newLoadFileUrl)

// Replace the initial select and add the checkOnly call
const loadQRRegex = /const \{ data, error \} = await supabase[\s\S]*?\.single\(\)/
const newLoadQR = `const { data, error } = await supabase
        .from('qr_codes')
        .select('id, qr_unique_id, is_active, expiry_date, files(*), reports(*)')
        .eq('qr_unique_id', qrId)
        .single()
        
      const checkRes = await fetch('/api/qr/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrUniqueId: qrId, checkOnly: true })
      })
      const { hasPin } = await checkRes.json()`

pageCode = pageCode.replace(loadQRRegex, newLoadQR)

// Update the if (data.password_hash) condition
pageCode = pageCode.replace(/if \(data\.password_hash\) \{/, `if (hasPin) {`)

// Add locked status view
const lockedView = `  // STATUS: LOCKED
  if (status === 'locked') return (
    <div style={{
      minHeight: '100vh', background: '#07080f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏱️</div>
        <h1 style={{
          fontFamily: 'Geist, sans-serif',
          fontSize: 22, fontWeight: 700, color: '#ff5a5a', marginBottom: 8
        }}>Access Locked</h1>
        <p style={{ color: '#9896b8', fontSize: 14 }}>
          Too many failed attempts. Please try again later.
        </p>
      </div>
    </div>
  )

  // STATUS: PIN`
pageCode = pageCode.replace(/\/\/ STATUS: PIN/, lockedView)

fs.writeFileSync(pagePath, pageCode)
console.log('Fixed app/scan/[qr_id]/page.tsx')
