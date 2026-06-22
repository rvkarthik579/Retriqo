"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import type { WorkspaceLedger } from "./CreateProjectWorkspace";

interface ProjectLedgerProps {
  ledger: WorkspaceLedger;
  updateLedger: (partial: Partial<WorkspaceLedger>) => void;
}

export default function ProjectLedger({ ledger, updateLedger }: ProjectLedgerProps) {
  // A project is valid if it has at least a Name and Machine Name.
  const isInputValid = ledger.name.trim().length > 0 && ledger.machineName.trim().length > 0;

  const handleValidate = () => {
    if (isInputValid) {
      updateLedger({ isValidated: true });
    }
  };

  return (
    <div className="relative flex flex-col gap-8">
      <div className="mb-4">
        <h3 className="font-[family-name:var(--font-instrument)] text-4xl text-[#1A1A1A]">
          Project Ledger
        </h3>
        <p className="mt-2 text-sm font-medium text-[#1A1A1A]/50">
          Establish the architectural records for this machine.
        </p>
      </div>

      <div className="flex flex-col gap-6 relative">
        {/* Brass Stamp Overlay when validated */}
        <AnimatePresence>
          {ledger.isValidated && (
            <motion.div
              initial={{ opacity: 0, scale: 2, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="rounded-xl border-4 border-[#C5A059] px-8 py-4 text-center">
                <span className="font-mono text-4xl font-bold tracking-[0.3em] text-[#C5A059] mix-blend-multiply">
                  ESTABLISHED
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`transition-opacity duration-500 ${ledger.isValidated ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
          <div>
            <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/40">
              Project Name
            </label>
            <input
              type="text"
              value={ledger.name}
              onChange={(e) => updateLedger({ name: e.target.value })}
              placeholder="e.g. Turbine Refit Alpha"
              className="w-full border-b border-black/10 bg-transparent py-3 font-[family-name:var(--font-instrument)] text-5xl text-black outline-none transition-colors focus:border-black/40 placeholder:text-black/10"
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/40">
                Machine Name
              </label>
              <input
                type="text"
                value={ledger.machineName}
                onChange={(e) => updateLedger({ machineName: e.target.value })}
                placeholder="e.g. TX-990"
                className="w-full border-b border-black/10 bg-transparent py-2 text-xl font-medium text-black outline-none transition-colors focus:border-black/40 placeholder:text-black/20"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/40">
                Location
              </label>
              <input
                type="text"
                value={ledger.location}
                onChange={(e) => updateLedger({ location: e.target.value })}
                placeholder="e.g. Sub-Level 4"
                className="w-full border-b border-black/10 bg-transparent py-2 text-xl font-medium text-black outline-none transition-colors focus:border-black/40 placeholder:text-black/20"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div className="col-span-2">
              <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/40">
                Machine Type
              </label>
              <input
                type="text"
                value={ledger.machineType}
                onChange={(e) => updateLedger({ machineType: e.target.value })}
                placeholder="e.g. Industrial Centrifuge"
                className="w-full border-b border-black/10 bg-transparent py-2 text-xl font-medium text-black outline-none transition-colors focus:border-black/40 placeholder:text-black/20"
              />
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-black/40">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={ledger.description}
              onChange={(e) => updateLedger({ description: e.target.value })}
              placeholder="Record notes..."
              className="w-full border-b border-black/10 bg-transparent py-2 text-lg font-medium text-black outline-none transition-colors focus:border-black/40 placeholder:text-black/20 resize-none"
            />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isInputValid ? (
                <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#2E8B57]">
                  <Check className="h-3 w-3" /> Validated Core Data
                </span>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-widest text-black/30">
                  Awaiting Core Data
                </span>
              )}
            </div>
            <button
              onClick={handleValidate}
              disabled={!isInputValid}
              className="rounded-full bg-[#1A1A1A] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-black disabled:opacity-30 disabled:hover:bg-[#1A1A1A]"
            >
              Establish Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
