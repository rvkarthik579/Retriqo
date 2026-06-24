import fs from 'fs'
import path from 'path'

const filePath = path.join('components', 'design-lab', 'workflow', 'steps', 'Step2Upload.tsx')
let code = fs.readFileSync(filePath, 'utf8')

const zipRegex = /const zip = await JSZip\.loadAsync\(file\);\s*const entries = Object\.values\(zip\.files\)\.filter\(entry => !entry\.dir\);/

const newZipCode = `const zip = await JSZip.loadAsync(file);
          const entriesList = Object.keys(zip.files).filter(p => !zip.files[p].dir && !p.startsWith('__MACOSX'));
          if (entriesList.length > 1000) {
            throw new Error(\`Archive contains too many files (\${entriesList.length}). Maximum allowed is 1000.\`);
          }
          let totalUncompressedSize = 0;
          for (const p of entriesList) {
            const entry = zip.files[p];
            const uncompressedSize = (entry as any)._data?.uncompressedSize || 0;
            totalUncompressedSize += uncompressedSize;
            if (totalUncompressedSize > 500 * 1024 * 1024) {
              throw new Error(\`Archive expands to over 500MB when extracted. This exceeds the safe limit.\`);
            }
          }
          const entries = entriesList.map(p => zip.files[p]);`

code = code.replace(zipRegex, newZipCode)

fs.writeFileSync(filePath, code)
console.log('Fixed components/design-lab/workflow/steps/Step2Upload.tsx')
