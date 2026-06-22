"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Wrench } from "lucide-react";
import { useProjectWorkflow } from "@/store/useProjectWorkflow";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 28 } },
};

export default function Step1Details() {
  const { projectName, machineName, location, updateDetails, nextStep } = useProjectWorkflow();

  const isValid = projectName.trim().length > 0 && machineName.trim().length > 0;

  return (
    <motion.div
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/[0.04] ring-1 ring-black/[0.06]"
    >
      <div className="p-8 pb-0">
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8">
          <motion.div variants={item}>
            <label className="mb-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-black/35">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => updateDetails({ projectName: e.target.value })}
              placeholder="e.g. Boiler Room Audit"
              autoFocus
              className="w-full border-b-2 border-black/[0.06] bg-transparent pb-3 font-sans text-2xl font-bold text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A] placeholder:text-black/15"
            />
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-black/35">
                <Wrench className="h-3 w-3" /> Machine / Asset
              </label>
              <input
                type="text"
                value={machineName}
                onChange={(e) => updateDetails({ machineName: e.target.value })}
                placeholder="e.g. Generator Alpha"
                className="w-full border-b border-black/[0.06] bg-transparent pb-2 font-sans text-base font-medium text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A] placeholder:text-black/15"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-black/35">
                <MapPin className="h-3 w-3" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => updateDetails({ location: e.target.value })}
                placeholder="e.g. Sector 7G"
                className="w-full border-b border-black/[0.06] bg-transparent pb-2 font-sans text-base font-medium text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A] placeholder:text-black/15"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={item} className="mt-8 flex justify-end border-t border-black/[0.04] bg-black/[0.015] px-8 py-5">
        <motion.button
          onClick={nextStep}
          disabled={!isValid}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.97 } : {}}
          className="flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-2.5 font-sans text-sm font-semibold text-white transition-opacity disabled:opacity-20"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
