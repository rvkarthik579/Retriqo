'use client'

import { useState } from 'react'
import { 
  IconFile, IconFolder, IconFolderOpen, IconChevronRight,
  IconFileTypePdf, IconFileTypeDoc, IconZip, IconCheck
} from '@tabler/icons-react'

export interface TreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  file?: File
  children?: TreeNode[]
  selected?: boolean
}

interface FileTreeProps {
  nodes: TreeNode[]
  selectedPaths: Set<string>
  onToggle: (path: string, file?: File) => void
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  const style = { flexShrink: 0 }
  switch (ext) {
    case 'pdf': return { icon: <IconFileTypePdf size={16} color="#ff5a5a" style={style} />, badge: 'PDF', color: '#ff5a5a', bg: 'rgba(255,90,90,0.1)' }
    case 'docx': case 'doc': return { icon: <IconFileTypeDoc size={16} color="#4e9eff" style={style} />, badge: 'DOC', color: '#4e9eff', bg: 'rgba(78,158,255,0.1)' }
    case 'zip': return { icon: <IconZip size={16} color="#f0c060" style={style} />, badge: 'ZIP', color: '#f0c060', bg: 'rgba(240,192,96,0.1)' }
    case 'rar': return { icon: <IconZip size={16} color="#ff5a5a" style={style} />, badge: 'RAR', color: '#ff5a5a', bg: 'rgba(255,90,90,0.1)' }
    case 'war': return { icon: <IconZip size={16} color="#a89cff" style={style} />, badge: 'WAR', color: '#a89cff', bg: 'rgba(168,156,255,0.1)' }
    case 'ear': return { icon: <IconZip size={16} color="#3dffa0" style={style} />, badge: 'EAR', color: '#3dffa0', bg: 'rgba(61,255,160,0.1)' }
    default: return { icon: <IconFile size={16} color="var(--text-muted)" style={style} />, badge: ext?.toUpperCase() || 'FILE', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' }
  }
}

function TreeNodeItem({ 
  node, depth, selectedPaths, onToggle
}: { 
  node: TreeNode
  depth: number
  selectedPaths: Set<string>
  onToggle: (path: string, file?: File) => void
}) {
  const [open, setOpen] = useState(depth < 2)
  const isSelected = selectedPaths.has(node.path)

  if (node.type === 'folder') {
    return (
      <div>
        <div
          className="file-tree-item"
          style={{ paddingLeft: 8 + depth * 20 }}
          onClick={() => setOpen(o => !o)}
        >
          <span className={`file-tree-chevron ${open ? 'open' : ''}`} style={{ color: 'var(--text-muted)' }}>
            <IconChevronRight size={14} />
          </span>
          {open 
            ? <IconFolderOpen size={16} color="var(--warning)" style={{ flexShrink: 0 }} />
            : <IconFolder size={16} color="var(--warning)" style={{ flexShrink: 0 }} />
          }
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1 }}>
            {node.name}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
            {node.children?.filter(c => c.type === 'file').length} files
          </span>
        </div>
        {open && node.children && (
          <div className="animate-slide-down">
            {node.children.map((child, i) => (
              <TreeNodeItem
                key={i}
                node={child}
                depth={depth + 1}
                selectedPaths={selectedPaths}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const { icon, badge, color, bg } = getFileIcon(node.name)

  return (
    <div
      className={`file-tree-item ${isSelected ? 'selected' : ''}`}
      style={{ paddingLeft: 8 + depth * 20 }}
      onClick={() => onToggle(node.path, node.file)}
    >
      <div style={{ width: 14, flexShrink: 0 }} />
      {icon}
      <span style={{ 
        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', 
        fontSize: '0.875rem', flex: 1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>
        {node.name}
      </span>
      <span style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
        padding: '2px 6px', borderRadius: 4,
        background: bg, color: color,
        border: `1px solid ${color}33`,
        flexShrink: 0
      }}>
        {badge}
      </span>
      {isSelected && (
        <div style={{
          width: 18, height: 18,
          background: 'var(--accent)', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <IconCheck size={11} color="white" />
        </div>
      )}
    </div>
  )
}

export default function FileTree({ nodes, selectedPaths, onToggle }: FileTreeProps) {
  if (nodes.length === 0) return null

  return (
    <div style={{
      background: 'var(--bg-hover)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      maxHeight: 400,
      overflowY: 'auto'
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          File Tree
        </span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--accent-light)' }}>
          {selectedPaths.size} selected
        </span>
      </div>
      <div style={{ padding: '8px 4px' }}>
        {nodes.map((node, i) => (
          <TreeNodeItem
            key={i}
            node={node}
            depth={0}
            selectedPaths={selectedPaths}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
