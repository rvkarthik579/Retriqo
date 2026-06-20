'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import {
  IconArrowLeft, IconUpload, IconAlertTriangle, IconFile,
  IconMapPin, IconCategory, IconCalendar, IconClock, IconDownload,
  IconCopy, IconCheck, IconLock, IconLockOpen, IconQrcode
} from '@tabler/icons-react'

const statusConfig = {
  pass: { label: 'Pass', color: 'var(--success)', bg: 'rgba(61,255,160,0.1)', border: 'rgba(61,255,160,0.2)' },
  fail: { label: 'Fail', color: 'var(--danger)', bg: 'rgba(255,90,90,0.1)', border: 'rgba(255,90,90,0.2)' },
  needs_attention: { label: 'Needs Attention', color: 'var(--warning)', bg: 'rgba(240,192,96,0.1)', border: 'rgba(240,192,96,0.2)' },
}

function normalizeStatus(s: string): keyof typeof statusConfig {
  const lower = s.toLowerCase().replace(' ', '_')
  if (lower === 'pass') return 'pass'
  if (lower === 'fail') return 'fail'
  return 'needs_attention'
}

interface ReportFile {
  id: string
  file_name: string
  file_path: string
  file_size?: number
  file_type?: string
  created_at: string
  qr_codes?: Array<{ id: string; qr_unique_id: string; expiry_date: string | null; is_active: boolean; password_hash?: string }>
}

interface Report {
  id: string
  status: string
  remarks?: string
  next_inspection_date?: string
  created_at: string
  version_number?: number
  files?: ReportFile[]
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id: projectId } = params as { id: string }
  const [project, setProject] = useState<Record<string, string> | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [revokeModal, setRevokeModal] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [scanCounts, setScanCounts] = useState<Map<string, number>>(new Map())
  const [copiedQR, setCopiedQR] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient()
      const { data: proj } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (proj) setProject(proj)

      const { data: reps } = await supabase
        .from('reports')
        .select(`
          id, status, remarks, next_inspection_date, created_at, version_number,
          files(id, file_name, file_path, file_size, file_type, created_at,
            qr_codes(id, qr_unique_id, expiry_date, is_active, password_hash)
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (reps) {
        setReports(reps)
        const qrIds = reps.flatMap(report =>
          (report.files || []).flatMap(file => (file.qr_codes || []).map(qr => qr.id))
        )
        if (qrIds.length > 0) {
          const { data: logs } = await supabase
            .from('scan_logs')
            .select('qr_id, was_blocked')
            .in('qr_id', qrIds)

          const counts = new Map<string, number>()
          logs?.forEach(log => {
            if (!log.was_blocked) counts.set(log.qr_id, (counts.get(log.qr_id) || 0) + 1)
          })
          setScanCounts(counts)
        }
      }
      setLoading(false)
    }
    load()
  }, [projectId])

  async function handleRevokeAll() {
    setRevoking(true)
    const supabase = getSupabaseBrowserClient()
    await supabase
      .from('qr_codes')
      .update({ is_active: false })
      .in('report_id', reports.map(r => r.id))
    
    // Optimistically update UI
    setReports(prev => prev.map(report => ({
      ...report,
      files: report.files?.map((file: ReportFile) => ({
        ...file,
        qr_codes: file.qr_codes?.map(qr => ({ ...qr, is_active: false }))
      }))
    })))
    setRevokeModal(false)
    setRevoking(false)
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function scanUrl(qrId: string) {
    return `${window.location.origin}/scan/${qrId}`
  }

  async function copyScanLink(qrId: string) {
    await navigator.clipboard.writeText(scanUrl(qrId))
    setCopiedQR(qrId)
    window.setTimeout(() => setCopiedQR(current => current === qrId ? null : current), 1800)
  }

  function downloadQR(qrId: string, fileName: string) {
    const svg = document.getElementById(`project-qr-${qrId}`)
    if (!(svg instanceof SVGSVGElement)) return

    const markup = new XMLSerializer().serializeToString(svg)
    const serialized = markup.includes('xmlns=') ? markup : markup.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
    const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const context = canvas.getContext('2d')
      if (!context) return
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 64, 64, 896, 896)
      const anchor = document.createElement('a')
      anchor.download = `${fileName.replace(/[^a-z0-9._-]+/gi, '-')}-QR.png`
      anchor.href = canvas.toDataURL('image/png')
      anchor.click()
    }
    image.src = source
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="skeleton" style={{ height: 20, width: 200, marginBottom: 32 }} />
        <div className="skeleton" style={{ height: 36, width: '60%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 40 }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card skeleton" style={{ height: 160, marginBottom: 16 }} />
        ))}
      </div>
    )
  }

  if (!project) return (
    <div style={{ textAlign: 'center', padding: 64 }}>
      <h2 className="font-geist" style={{ marginBottom: 8 }}>Project not found</h2>
      <Link href="/dashboard" className="btn btn-secondary" style={{ display: 'inline-flex', marginTop: 16 }}>
        Back to Dashboard
      </Link>
    </div>
  )

  const masterQRUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/projects/${projectId}`
  const fileRecords = reports.flatMap(report =>
    (report.files || []).map(file => ({ file, report }))
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Back */}
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 24 }}>
        <IconArrowLeft size={16} />
        Dashboard
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 className="font-geist" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>
            {project.machine_name}
          </h1>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {project.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <IconMapPin size={14} />
                {project.location}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <IconCategory size={14} />
              {project.project_type}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <IconClock size={14} />
              Created {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setRevokeModal(true)}
            className="btn btn-danger btn-sm"
          >
            <IconAlertTriangle size={15} />
            Revoke All QRs
          </button>
          <Link href={`/dashboard/projects/${projectId}/upload`} className="btn btn-primary btn-sm">
            <IconUpload size={15} />
            Upload New Report
          </Link>
        </div>
      </div>

      {/* File-level QR codes */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>
              Ready for the floor
            </div>
            <h2 className="font-geist" style={{ fontSize: '1.25rem', fontWeight: 650, marginBottom: 4 }}>File QR Codes</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Download, print, or share the QR for each controlled document.</p>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {fileRecords.length} file{fileRecords.length !== 1 ? 's' : ''}
          </span>
        </div>

        {fileRecords.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <IconQrcode size={38} color="var(--text-muted)" style={{ margin: '0 auto 14px' }} />
            <h3 className="font-geist" style={{ marginBottom: 8 }}>No file QRs yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Upload files to generate the first set of work-ready QR codes.</p>
            <Link href={`/dashboard/projects/${projectId}/upload`} className="btn btn-primary" style={{ display: 'inline-flex' }}>
              <IconUpload size={16} /> Upload Files
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 390px), 1fr))', gap: 14 }}>
            {fileRecords.map(({ file, report }) => {
              const qr = file.qr_codes?.[0]
              if (!qr) return null
              const expired = !!qr.expiry_date && new Date(qr.expiry_date) < new Date()
              const stateLabel = !qr.is_active ? 'Revoked' : expired ? 'Expired' : 'Active'
              const stateColor = qr.is_active && !expired ? 'var(--success)' : 'var(--danger)'

              return (
                <article key={file.id} className="card" style={{ padding: 18, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div style={{ background: '#fff', padding: 10, borderRadius: 8, flexShrink: 0, lineHeight: 0 }}>
                      <QRCodeSVG
                        id={`project-qr-${qr.qr_unique_id}`}
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${qr.qr_unique_id}`}
                        size={116}
                        bgColor="#ffffff"
                        fgColor="#07080f"
                        level="H"
                      />
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: stateColor, boxShadow: `0 0 0 3px color-mix(in srgb, ${stateColor} 14%, transparent)` }} />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: stateColor, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stateLabel}</span>
                      </div>
                      <h3 title={file.file_name} style={{ fontSize: '0.98rem', fontWeight: 650, lineHeight: 1.35, marginBottom: 5, overflowWrap: 'anywhere' }}>{file.file_name}</h3>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 12 }}>{qr.qr_unique_id}</div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '7px 10px', fontSize: '0.76rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Expires</span>
                        <span style={{ color: 'var(--text-secondary)', textAlign: 'right' }}>{qr.expiry_date ? new Date(qr.expiry_date).toLocaleDateString() : 'Never'}</span>
                        <span style={{ color: 'var(--text-muted)' }}>PIN</span>
                        <span style={{ color: 'var(--text-secondary)', textAlign: 'right', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
                          {qr.password_hash ? <IconLock size={12} /> : <IconLockOpen size={12} />}{qr.password_hash ? 'Yes' : 'No'}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>Scans</span>
                        <span style={{ color: 'var(--text-secondary)', textAlign: 'right' }}>{scanCounts.get(qr.id) || 0}</span>
                        <span style={{ color: 'var(--text-muted)' }}>Created</span>
                        <span style={{ color: 'var(--text-secondary)', textAlign: 'right' }}>{new Date(file.created_at || report.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <button onClick={() => downloadQR(qr.qr_unique_id, file.file_name)} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                      <IconDownload size={14} /> Download QR
                    </button>
                    <button onClick={() => copyScanLink(qr.qr_unique_id)} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                      {copiedQR === qr.qr_unique_id ? <IconCheck size={14} color="var(--success)" /> : <IconCopy size={14} />}
                      {copiedQR === qr.qr_unique_id ? 'Copied' : 'Copy Link'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Secondary project QR */}
      <details className="card" style={{ padding: '16px 18px', marginBottom: 32 }}>
        <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
          Project page QR (secondary)
        </summary>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', paddingTop: 16 }}>
          <div style={{ background: 'white', padding: 9, borderRadius: 8, lineHeight: 0 }}>
            <QRCodeSVG value={masterQRUrl} size={84} bgColor="white" fgColor="#07080f" level="M" />
          </div>
          <p style={{ flex: 1, minWidth: 220, color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
            Opens this dashboard page. Use the file QRs above for machine labels and document access.
          </p>
        </div>
      </details>

      {/* Reports Timeline */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="font-geist" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            Inspection History
          </h2>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '4px 10px', borderRadius: 20 }}>
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <IconFile size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 className="font-geist" style={{ marginBottom: 8 }}>No reports yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Upload your first inspection report to get started</p>
            <Link href={`/dashboard/projects/${projectId}/upload`} className="btn btn-primary" style={{ display: 'inline-flex' }}>
              <IconUpload size={16} />
              Upload First Report
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="stagger-list">
            {reports.map((report, index) => {
              const s = statusConfig[normalizeStatus(report.status)]
              return (
                <div key={report.id} className="card" style={{ padding: 24 }}>
                  {/* Report header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Version {reports.length - index}
                        </span>
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 500,
                          padding: '3px 8px', borderRadius: 4,
                          background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                          textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                          {s.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        <IconCalendar size={13} />
                        {new Date(report.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    {report.next_inspection_date && (
                      <div style={{ 
                        padding: '8px 12px', 
                        background: 'rgba(240,192,96,0.05)', 
                        border: '1px solid rgba(240,192,96,0.15)', 
                        borderRadius: 8,
                        fontSize: '0.8125rem', color: 'var(--warning)'
                      }}>
                        Next inspection: {new Date(report.next_inspection_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Remarks */}
                  {report.remarks && (
                    <div style={{ 
                      padding: '10px 14px',
                      background: 'var(--bg-hover)',
                      borderRadius: 8, borderLeft: `3px solid ${s.color}`,
                      marginBottom: 16, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6
                    }}>
                      {report.remarks}
                    </div>
                  )}

                  {/* Files */}
                  {report.files && report.files.length > 0 && (
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                        Files & QR Codes
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {report.files.map((file: ReportFile) => {
                          const qr = file.qr_codes?.[0]
                          return (
                            <div key={file.id} style={{
                              display: 'flex', alignItems: 'center',
                              padding: '10px 14px',
                              background: 'var(--bg-hover)',
                              borderRadius: 8, flexWrap: 'wrap', gap: 10
                            }}>
                              <IconFile size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {file.file_name}
                                </div>
                                {file.file_size && (
                                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {formatFileSize(file.file_size)}
                                  </div>
                                )}
                              </div>
                              {qr && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--accent-light)' }}>
                                    {qr.qr_unique_id}
                                  </span>
                                  <span style={{
                                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                                    padding: '2px 8px', borderRadius: 4,
                                    background: qr.is_active ? 'rgba(61,255,160,0.1)' : 'rgba(255,255,255,0.05)',
                                    color: qr.is_active ? 'var(--success)' : 'var(--text-muted)',
                                    border: `1px solid ${qr.is_active ? 'rgba(61,255,160,0.2)' : 'var(--border)'}`,
                                  }}>
                                    {qr.is_active ? 'Active' : 'Revoked'}
                                  </span>
                                  {qr.is_active && (
                                    <Link
                                      href={`/scan/${qr.qr_unique_id}`}
                                      target="_blank"
                                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                                    >
                                      Preview →
                                    </Link>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Revoke Modal */}
      {revokeModal && (
        <div className="modal-overlay" onClick={() => setRevokeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,90,90,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconAlertTriangle size={20} color="var(--danger)" />
              </div>
              <h2 className="font-geist" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Revoke All QR Codes?</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
              All active QR codes for this project will be immediately invalidated. Anyone trying to scan them will be blocked. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setRevokeModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button onClick={handleRevokeAll} disabled={revoking} className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
                {revoking ? 'Revoking...' : 'Revoke All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
