"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Edit, LogOut, Key, X } from "lucide-react";

export default function AccountPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[480px] flex-col border-l border-black/10 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/5 bg-[#F9F9F8]/50 p-8">
              <div>
                <h2 className="font-[family-name:var(--font-instrument)] text-4xl text-[#1A1A1A]">
                  Account
                </h2>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-black/40">
                  Your Profile
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-black/5 p-3 transition-colors hover:bg-black/10"
              >
                <X className="h-5 w-5 text-black/60" />
              </button>
            </div>

            <div className="flex-1 space-y-12 overflow-y-auto p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1A1A1A] text-white shadow-lg">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-instrument)] text-3xl text-[#1A1A1A]">
                    John Doe
                  </h3>
                  <p className="text-sm text-black/60">john.doe@example.com</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Storage Used", value: "4.2 GB" },
                  { label: "Member Since", value: "Oct 2023" },
                  { label: "Projects Created", value: "4" },
                  { label: "Total Scans", value: "1,284" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-black/5 p-4 text-center">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-black/40">
                      {stat.label}
                    </p>
                    <p className="font-[family-name:var(--font-instrument)] text-2xl text-[#1A1A1A]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/5 pt-8">
                <h4 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-black/40">
                  Recent Activity
                </h4>
                <div className="space-y-4 text-sm text-[#1A1A1A]/80">
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    <p>Scanned &quot;Machine 7 Inspection&quot; QR Code from Android</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <p>Uploaded 12 new files to &quot;Boiler Room Audit&quot;</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <p>Regenerated QR Code for &quot;Safety_Checklist.xlsx&quot;</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-black/5 pt-4">
                <button className="flex items-center gap-3 rounded-xl bg-black/5 p-4 transition-colors hover:bg-black/10">
                  <Edit className="h-4 w-4 text-black/60" />
                  <span className="text-sm font-medium">Edit Profile</span>
                </button>
                <button className="flex items-center gap-3 rounded-xl bg-black/5 p-4 transition-colors hover:bg-black/10">
                  <Key className="h-4 w-4 text-black/60" />
                  <span className="text-sm font-medium">Change Password</span>
                </button>
              </div>

              <div className="pt-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/10 py-4 text-red-600 transition-colors hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  <span className="font-mono text-[11px] font-medium uppercase tracking-widest">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
