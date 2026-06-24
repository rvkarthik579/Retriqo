import fs from 'fs'
import path from 'path'

const filePath = path.join('lib', 'storage.ts')
let code = fs.readFileSync(filePath, 'utf8')

// Replace uploadFile return
const uploadRegex = /const \{ data: urlData \} = supabase\.storage\s*\.from\('project-qr-files'\)\s*\.getPublicUrl\(data\.path\)\s*return \{\s*path: data\.path,\s*url: urlData\.publicUrl,\s*\}/
const newUpload = `const { data: urlData } = await supabase.storage
    .from('project-qr-files')
    .createSignedUrl(data.path, 300)

  return {
    path: data.path,
    url: urlData?.signedUrl || '',
  }`
code = code.replace(uploadRegex, newUpload)

// Replace getFileUrl
const getFileUrlRegex = /export function getFileUrl\(path: string\): string \{\s*const supabase = getSupabaseBrowserClient\(\)\s*const \{ data \} = supabase\.storage\s*\.from\('project-qr-files'\)\s*\.getPublicUrl\(path\)\s*return data\.publicUrl\s*\}/
const newGetFileUrl = `export async function getFileUrl(path: string): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const { data } = await supabase.storage
    .from('project-qr-files')
    .createSignedUrl(path, 300)
  return data?.signedUrl || ''
}`
code = code.replace(getFileUrlRegex, newGetFileUrl)

fs.writeFileSync(filePath, code)
console.log('Fixed lib/storage.ts')
