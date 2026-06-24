import fs from 'fs'
import path from 'path'

// 1. Fix Scan Page Regression
const scanPath = path.join('app', 'scan', '[qr_id]', 'page.tsx')
let scanCode = fs.readFileSync(scanPath, 'utf8')

// Fix loadFileUrl and syntax error
const loadFileRegex = /async function loadFileUrl\(filePath: string\) \{[\s\S]*?\n\s*\}\n/
const newLoadFile = `async function loadFileUrl(filePath: string, fileName?: string) {
    const { data, error } = await supabase.storage
      .from('project-qr-files')
      .createSignedUrl(filePath, 300, { download: fileName || true }) 
    if (data?.signedUrl) setFileUrl(data.signedUrl)
    if (error) console.error('Signed URL error:', error)
  }
`
scanCode = scanCode.replace(loadFileRegex, newLoadFile)
scanCode = scanCode.replace(/await loadFileUrl\(data\.files\.file_path\)/g, 'await loadFileUrl(data.files.file_path, data.files.file_name)')
scanCode = scanCode.replace(/await loadFileUrl\(qrData!\.files\.file_path\)/g, 'await loadFileUrl(qrData!.files.file_path, qrData!.files.file_name)')
fs.writeFileSync(scanPath, scanCode)
console.log('Fixed app/scan/[qr_id]/page.tsx')


// 2. Fix SettingsPanel Storage Widget
const settingsPath = path.join('components', 'design-lab', 'SettingsPanel.tsx')
let settingsCode = fs.readFileSync(settingsPath, 'utf8')

// Change the loadData query
const loadDataRegex = /const \{ data: files \} = await supabase\.from\('files'\)\.select\('file_size'\)\.eq\('user_id', user\.id\);\s*if \(files\) \{\s*setTotalFiles\(files\.length\);\s*const size = files\.reduce\(\(acc, f\) => acc \+ \(f\.file_size \|\| 0\), 0\);\s*setUsedCapacity\(size\);\s*\}/
const newLoadData = `const { data: projectsData } = await supabase.from('projects').select('id, reports(files(file_size))').eq('user_id', user.id);
      if (projectsData) {
        let tFiles = 0;
        let uCap = 0;
        projectsData.forEach(p => {
          p.reports?.forEach((r: any) => {
            r.files?.forEach((f: any) => {
              tFiles++;
              uCap += f.file_size || 0;
            });
          });
        });
        setTotalFiles(tFiles);
        setUsedCapacity(uCap);
      }`
settingsCode = settingsCode.replace(loadDataRegex, newLoadData)

// Change the rendering if 0 files
const renderRegex = /<div className="space-y-6">[\s\S]*?<\/div>\s*<\/section>/
const newRender = `<div className="space-y-6">
                  {totalFiles === 0 ? (
                    <div className="flex items-center justify-center p-6 border border-black/5 rounded-lg bg-black/[0.02]">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">No files uploaded yet</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-4xl font-[family-name:var(--font-instrument)] text-[#1A1A1A]">{gbUsed} GB</span>
                          <span className="font-mono text-[10px] tracking-widest text-black/40">USED CAPACITY</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-4xl font-[family-name:var(--font-instrument)] text-[#1A1A1A]">{totalFiles}</span>
                          <span className="font-mono text-[10px] tracking-widest text-black/40">TOTAL FILES</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1A1A1A]" style={{ width: \`\${percentUsed}%\` }} />
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-black/30">
                        <span>0 GB</span>
                        <span>10.0 GB Limit</span>
                      </div>
                    </>
                  )}
                </div>
              </section>`
settingsCode = settingsCode.replace(renderRegex, newRender)
fs.writeFileSync(settingsPath, settingsCode)
console.log('Fixed components/design-lab/SettingsPanel.tsx')


// 3. Fix Project Details Page Actions and Back Button
const projectPath = path.join('app', 'dashboard', 'projects', '[id]', 'page.tsx')
let projectCode = fs.readFileSync(projectPath, 'utf8')

// Fix back button
projectCode = projectCode.replace(/<Link href="\/dashboard"\s*style=\{\{ display: 'inline-flex'/g, '<Link href="/dashboard?view=projects" style={{ display: \'inline-flex\'')

// Add handleFileAction inside ProjectPage component
const insertIndex = projectCode.indexOf('if (loading) {')
const handlers = `
  async function handleFileAction(filePath: string, action: 'download' | 'copy' | 'open', fileName: string) {
    const supabase = getSupabaseBrowserClient()
    const options = action === 'download' ? { download: fileName } : undefined
    const { data } = await supabase.storage.from('project-qr-files').createSignedUrl(filePath, 300, options)
    const url = data?.signedUrl
    
    if (!url) {
      alert('Failed to generate secure link.')
      return
    }
    
    if (action === 'copy') {
      await navigator.clipboard.writeText(url)
      setCopiedQR('file-' + filePath)
      window.setTimeout(() => setCopiedQR(current => current === 'file-' + filePath ? null : current), 1800)
    } else if (action === 'open') {
      window.open(url, '_blank')
    } else if (action === 'download') {
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  `
projectCode = projectCode.slice(0, insertIndex) + handlers + projectCode.slice(insertIndex)

// Add the 3 action buttons for each file
const qrRenderRegex = /\{qr && \(\s*<div style=\{\{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' \}\}>\s*<span style=\{\{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0\.75rem', color: 'var\(--accent-light\)' \}\}>\s*\{qr\.qr_unique_id\}\s*<\/span>[\s\S]*?\{qr\.is_active && \(\s*<Link[\s\S]*?Preview →\s*<\/Link>\s*\)\}\s*<\/div>\s*\)\}/g

const newQrRender = `{qr && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', width: '100%' }}>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--accent-light)' }}>
                                    {qr.qr_unique_id}
                                  </span>
                                  <span style={{
                                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                                    padding: '2px 8px', borderRadius: 4,
                                    background: qr.is_active ? 'rgba(61,255,160,0.1)' : 'rgba(255,255,255,0.05)',
                                    color: qr.is_active ? 'var(--success)' : 'var(--text-muted)',
                                    border: \`1px solid \${qr.is_active ? 'rgba(61,255,160,0.2)' : 'var(--border)'}\`,
                                  }}>
                                    {qr.is_active ? 'Active' : 'Revoked'}
                                  </span>
                                  
                                  {qr.is_active && (
                                    <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                                      <button onClick={() => handleFileAction(file.file_path, 'download', file.file_name)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                        Download File
                                      </button>
                                      <button onClick={() => handleFileAction(file.file_path, 'copy', file.file_name)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                        {copiedQR === 'file-' + file.file_path ? 'Copied!' : 'Copy Link'}
                                      </button>
                                      <button onClick={() => handleFileAction(file.file_path, 'open', file.file_name)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                        Open In New Tab
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}`

projectCode = projectCode.replace(qrRenderRegex, newQrRender)

fs.writeFileSync(projectPath, projectCode)
console.log('Fixed app/dashboard/projects/[id]/page.tsx')
