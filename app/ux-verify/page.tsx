'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { QRCodeSVG } from 'qrcode.react'
import { QRLabelPDF, QRLayout } from '@/components/pdf/QRLabelPDF'

const ids = Array.from({ length: 10 }, (_, index) => `VERIFY-${String(index + 1).padStart(2, '0')}`)

export default function UXVerifyPage() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  async function render(layout: QRLayout) {
    try {
    setError('')
    const labels = await Promise.all(ids.map(async (id, index) => {
      const svg = document.getElementById(`verify-${id}`) as unknown as SVGSVGElement
      const markup = new XMLSerializer().serializeToString(svg)
      const serialized = markup.includes('xmlns=') ? markup : markup.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`
      const image = new Image()
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('QR image failed to load'))
        image.src = source
      })
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const context = canvas.getContext('2d')!
      context.fillStyle = '#fff'
      context.fillRect(0, 0, 512, 512)
      context.drawImage(image, 32, 32, 448, 448)
      return {
        machineName: 'PUMP STATION A-17',
        fileName: index === 2 ? 'Quarterly Safety Inspection - Long Filename.pdf' : `Inspection Report ${index + 1}.pdf`,
        qrUniqueId: id,
        expiryDate: '2026-12-31T00:00:00.000Z',
        generatedDate: new Date().toISOString(),
        status: 'pass' as const,
        qrDataUrl: canvas.toDataURL('image/png'),
      }
    }))
    const blob = await pdf(<QRLabelPDF labels={labels} layout={layout} />).toBlob()
    if (url) URL.revokeObjectURL(url)
    setUrl(URL.createObjectURL(blob))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
    }
  }

  return (
    <main style={{ padding: 20, background: '#eee', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {([1, 2, 4, 6, 9] as QRLayout[]).map(layout => <button key={layout} onClick={() => render(layout)}>Render {layout}</button>)}
      </div>
      {error && <pre>{error}</pre>}
      <div style={{ position: 'absolute', left: -10000 }}>
        {ids.map(id => <QRCodeSVG key={id} id={`verify-${id}`} value={`http://localhost:3000/scan/${id}`} size={256} level="H" />)}
      </div>
      {url && <iframe title="PDF verification" src={url} style={{ width: '100%', height: 'calc(100vh - 80px)', border: 0 }} />}
    </main>
  )
}
