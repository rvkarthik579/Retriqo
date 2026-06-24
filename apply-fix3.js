import fs from 'fs'
import path from 'path'

const pagePath = path.join('app', 'dashboard', 'projects', '[id]', 'upload', 'page.tsx')
let pageCode = fs.readFileSync(pagePath, 'utf8')

// Replace zip processing logic
const zipRegex = /const zip = await JSZip\.loadAsync\(file\)[\s\S]*?const entries = Object\.values\(zip\.files\)\.filter\(entry => !entry\.dir\)/

const newZipCode = `const zip = await JSZip.loadAsync(file)
            
            const entriesList = Object.keys(zip.files).filter(p => !zip.files[p].dir && !p.startsWith('__MACOSX'))
            if (entriesList.length > 1000) {
              throw new Error(\`Archive contains too many files (\${entriesList.length}). Maximum allowed is 1000.\`)
            }
            let totalUncompressedSize = 0
            for (const p of entriesList) {
              const entry = zip.files[p]
              const uncompressedSize = (entry as any)._data?.uncompressedSize || 0
              totalUncompressedSize += uncompressedSize
              if (totalUncompressedSize > 500 * 1024 * 1024) {
                throw new Error(\`Archive expands to over 500MB when extracted. This exceeds the safe limit.\`)
              }
            }

            const rootNodes: TreeNode[] = []
            const folderMap = new Map<string, TreeNode>()
            
            // Extract all files into Blobs immediately to attach as File objects
            const entries = entriesList.map(p => zip.files[p])`

pageCode = pageCode.replace(zipRegex, newZipCode)

// Replace catch block
const catchRegex = /\} catch \(err\) \{\s*console\.error\('ZIP extraction error:', err\)\s*allNodes\.push\(\{ name: file\.name, path: file\.name, type: 'file', file \}\)\s*\}/

const newCatch = `} catch (err) {
            console.error('ZIP extraction error:', err)
            setExtractionError(
              err instanceof Error ? err.message : 'Could not safely process this archive.'
            )
            allNodes.push({ name: file.name, path: file.name, type: 'file', file })
          }`

pageCode = pageCode.replace(catchRegex, newCatch)

fs.writeFileSync(pagePath, pageCode)
console.log('Fixed app/dashboard/projects/[id]/upload/page.tsx')
