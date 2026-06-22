"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Shield, HardDrive, AlertTriangle, QrCode } from "lucide-react";
import { useState } from "react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [pdfLayout, setPdfLayout] = useState("4");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#F9F9F8]/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-white border-l border-black/10 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-8 border-b border-black/5 bg-[#F9F9F8]/50">
              <div>
                <h2 className="font-[family-name:var(--font-instrument)] text-4xl text-[#1A1A1A]">Settings</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 mt-2">Preferences</p>
              </div>
              <button 
                onClick={onClose}
                className="rounded-full bg-black/5 p-3 transition-colors hover:bg-black/10"
              >
                <X className="h-5 w-5 text-black/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-16">
              

              {/* Notifications */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-2">
                  <Bell className="h-4 w-4 text-black/40" />
                  <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold text-black/60">Notifications</h3>
                </div>
                <div className="space-y-4">
                  {["QR scanned", "QR expired", "New upload"].map(notif => (
                    <div key={notif} className="flex items-center justify-between">
                      <span className="text-sm text-black/80">{notif}</span>
                      <div className="w-10 h-5 bg-black/10 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        <div className="absolute inset-0 bg-[#1A1A1A] rounded-full opacity-100 transition-opacity" />
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Security */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-2">
                  <Shield className="h-4 w-4 text-black/40" />
                  <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold text-black/60">Security</h3>
                </div>
                <div className="space-y-4 opacity-50 relative pointer-events-none">
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <span className="px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest rounded-full shadow-lg">Coming Soon</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/5 rounded-lg blur-[1px]">
                    <div className="flex flex-col">
                      <span className="text-sm text-black/80 font-medium">Two-factor Authentication</span>
                      <span className="text-xs text-black/50">Adds an extra layer of security</span>
                    </div>
                    <button className="px-4 py-2 border border-black/20 rounded font-mono text-[10px] uppercase tracking-widest">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/5 rounded-lg blur-[1px]">
                    <div className="flex flex-col">
                      <span className="text-sm text-black/80 font-medium">Active Sessions</span>
                      <span className="text-xs text-black/50">Manage signed-in devices</span>
                    </div>
                    <button className="px-4 py-2 border border-black/20 rounded font-mono text-[10px] uppercase tracking-widest">
                      View
                    </button>
                  </div>
                </div>
              </section>

              {/* Storage */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-2">
                  <HardDrive className="h-4 w-4 text-black/40" />
                  <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold text-black/60">Storage</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-4xl font-[family-name:var(--font-instrument)] text-[#1A1A1A]">4.2 GB</span>
                      <span className="font-mono text-[10px] tracking-widest text-black/40">USED CAPACITY</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-4xl font-[family-name:var(--font-instrument)] text-[#1A1A1A]">842</span>
                      <span className="font-mono text-[10px] tracking-widest text-black/40">TOTAL FILES</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1A1A1A] w-[42%]" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-black/30">
                    <span>0 GB</span>
                    <span>10.0 GB Limit</span>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section>
                <div className="flex items-center gap-3 mb-6 border-b border-red-900/10 pb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold text-red-600">Danger Zone</h3>
                </div>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 rounded-lg border border-red-900/10 text-red-600 hover:bg-red-50 transition-colors">
                    <span className="block text-sm font-medium">Delete Project</span>
                    <span className="block text-xs opacity-70 mt-1">Permanently remove the currently active project</span>
                  </button>
                  <button className="w-full text-left p-4 rounded-lg border border-red-900/10 text-red-600 hover:bg-red-50 transition-colors">
                    <span className="block text-sm font-medium">Delete All Projects</span>
                    <span className="block text-xs opacity-70 mt-1">Clear all project data from the system</span>
                  </button>
                  <button className="w-full text-left p-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                    <span className="block text-sm font-medium">Delete Account</span>
                    <span className="block text-xs opacity-80 mt-1">Permanently erase all data and identity</span>
                  </button>
                </div>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
