'use client'

import { motion } from 'framer-motion'
import { IconClock, IconFileZip, IconQrcode, IconPdf } from '@tabler/icons-react'

const workbenchItems = [
  { id: 1, title: 'EVIO-RUN-01.zip', time: '10 mins ago', icon: IconFileZip, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 2, title: 'Quarterly Audit.pdf', time: '2 hours ago', icon: IconPdf, color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: 3, title: 'Generator B QR', time: 'Yesterday', icon: IconQrcode, color: 'text-blue-400', bg: 'bg-blue-400/10' },
]

export default function Workbench() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 mt-16 z-10 relative">
      <div className="flex items-center gap-2 mb-6">
        <IconClock size={18} className="text-[#6c63ff]" />
        <h2 className="font-geist text-lg font-semibold text-gray-200 tracking-wide">Workbench</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workbenchItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.05] to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="text-gray-200 font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs font-mono">{item.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
