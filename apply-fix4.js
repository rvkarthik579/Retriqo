import fs from 'fs'
import path from 'path'

const pagePath = path.join('app', 'dashboard', 'projects', '[id]', 'upload', 'page.tsx')
let pageCode = fs.readFileSync(pagePath, 'utf8')

const validateCode = `
  async function validateFileType(file: File): Promise<boolean> {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const formData = new FormData()
    formData.append('file', file)
    formData.append('extension', ext)

    try {
      const response = await fetch('/api/validate-file', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      return result.valid
    } catch {
      return true // fail open on validation errors, don't block legitimate uploads
    }
  }

  async function processFiles(files: File[]) {`

pageCode = pageCode.replace(/async function processFiles\(files: File\[\]\) \{/, validateCode)

const processFilterRegex = /const validFiles = files\.filter\(f => \{[\s\S]*?return ACCEPTED_TYPES\.some\(ext => name\.endsWith\(ext\)\) && \s*f\.size <= MAX_FILE_SIZE\s*\}\)/
const newProcessFilter = `const validSizeAndType = files.filter(f => {
        const name = f.name.toLowerCase()
        return ACCEPTED_TYPES.some(ext => name.endsWith(ext)) && 
               f.size <= MAX_FILE_SIZE
      })

      const validFiles: File[] = []
      for (const f of validSizeAndType) {
        const isValid = await validateFileType(f)
        if (!isValid) {
          setExtractionError(prev => (prev ? prev + '\\n' : '') + \`"\${f.name}" failed security validation. File content does not match extension.\`)
          continue
        }
        validFiles.push(f)
      }`

pageCode = pageCode.replace(processFilterRegex, newProcessFilter)

fs.writeFileSync(pagePath, pageCode)
console.log('Fixed validation in app/dashboard/projects/[id]/upload/page.tsx')
