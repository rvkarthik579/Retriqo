'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconLayoutDashboard, IconX, IconSettings, IconUsers } from '@tabler/icons-react'

const projects = [
  { id: 'proj-1', name: 'Pump Station A-17', status: 'Active', files: 12 },
  { id: 'proj-2', name: 'HVAC Sector 4', status: 'Needs Attention', files: 4 },
  { id: 'proj-3', name: 'Generator B', status: 'Active', files: 8 },
]

export default function ProjectCards() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <section className="w-full max-w-7xl mx-auto px-6 mt-16 pb-24 z-10 relative">
      <div className="flex items-center gap-2 mb-6">
        <IconLayoutDashboard size={18} className="text-[#6c63ff]" />
        <h2 className="font-geist text-lg font-semibold text-gray-200 tracking-wide">The Clearing</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <motion.div
            layoutId={`project-container-${project.id}`}
            key={project.id}
            onClick={() => setSelectedId(project.id)}
            className="p-6 rounded-2xl bg-[#0a0b14]/60 border border-white/10 backdrop-blur-md cursor-pointer hover:bg-[#0a0b14]/80 transition-colors"
          >
            <motion.h3 
              layoutId={`project-title-${project.id}`}
              className="text-xl font-geist font-semibold text-gray-100 mb-2"
            >
              {project.name}
            </motion.h3>
            <div className="flex items-center justify-between mt-8">
              <span className={`text-xs px-2 py-1 rounded font-mono ${
                project.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}>
                {project.status}
              </span>
              <span className="text-gray-500 text-sm">{project.files} files</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <motion.div
                layoutId={`project-container-${selectedId}`}
                className="w-full max-w-4xl h-[80vh] bg-[#0a0b14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
              >
                {/* Modal Header (macOS style window controls) */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.02]">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
                    >
                      <IconX size={8} className="text-red-900 opacity-0 group-hover:opacity-100" />
                    </button>
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex gap-4 text-gray-500">
                    <IconUsers size={16} className="cursor-pointer hover:text-gray-300 transition-colors" />
                    <IconSettings size={16} className="cursor-pointer hover:text-gray-300 transition-colors" />
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 flex-1 overflow-y-auto">
                  <motion.h3 
                    layoutId={`project-title-${selectedId}`}
                    className="text-4xl font-geist font-bold text-gray-100 mb-8"
                  >
                    {projects.find(p => p.id === selectedId)?.name}
                  </motion.h3>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                      <div className="h-32 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                        Chart Mockup
                      </div>
                      <div className="h-64 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                        Recent Activity List
                      </div>
                    </div>
                    <div className="col-span-1 space-y-4">
                      <div className="h-48 rounded-xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex flex-col items-center justify-center text-[#c1bbff]">
                        <span className="text-5xl font-bold mb-2">
                          {projects.find(p => p.id === selectedId)?.files}
                        </span>
                        <span className="text-sm">Total Files</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
