"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useProjectWorkflow } from "@/store/useProjectWorkflow";
import Step1Details from "./steps/Step1Details";
import Step2Upload from "./steps/Step2Upload";
import Step3Analysis from "./steps/Step3Analysis";
import Step4TreeReview from "./steps/Step4TreeReview";
import Step5QRSelection from "./steps/Step5QRSelection";
import Step6QRConfig from "./steps/Step6QRConfig";
import Step7Generate from "./steps/Step7Generate";
import type { DesignLabProject } from "@/components/design-lab/types";

const STEPS = [
  "Details",
  "Upload",
  "Analysis",
  "Review",
  "Selection",
  "Config",
  "Generate",
];

export default function CreateProjectWorkflow({
  isOpen,
  onClose,
  onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (project: DesignLabProject) => void;
}) {
  const { currentStep, resetWorkflow } = useProjectWorkflow();

  // On unmount/close, reset
  useEffect(() => {
    return () => resetWorkflow();
  }, [resetWorkflow]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-[#F9F9F8] pb-32"
      >
        <div className="mx-auto max-w-[800px] px-8 py-12">
          
          <button
            onClick={() => {
              onClose();
            }}
            className="mb-8 inline-flex items-center gap-2 font-sans text-sm font-medium text-black/40 transition-colors hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="font-sans text-[28px] font-bold text-[#1A1A1A]">
              Create Project
            </h1>
            <p className="mt-1 font-sans text-sm text-black/60">
              Upload files and configure batch QR codes for your assets.
            </p>
          </div>

          <div className="mb-10 flex w-full items-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
            {STEPS.map((label, i) => {
              const stepNum = i + 1;
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;
              
              return (
                <div key={label} className="flex items-center">
                  <div 
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors duration-300 ${
                      isActive ? "bg-[#1A1A1A] text-white" : isPast ? "bg-black/5 text-[#1A1A1A]" : "bg-transparent text-black/30"
                    }`}
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300 ${
                      isActive ? "bg-white/20 text-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" : isPast ? "bg-black/10 text-[#1A1A1A]" : "bg-black/5 text-black/30"
                    }`}>
                      {isPast ? <Check className="h-3 w-3" /> : stepNum}
                    </div>
                    <span className="font-sans text-xs font-semibold">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mx-2 h-[2px] w-8 rounded-full transition-colors duration-300 ${isPast ? "bg-[#1A1A1A]" : "bg-black/5"}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="w-full"
              >
                {currentStep === 1 && <Step1Details />}
                {currentStep === 2 && <Step2Upload />}
                {currentStep === 3 && <Step3Analysis />}
                {currentStep === 4 && <Step4TreeReview />}
                {currentStep === 5 && <Step5QRSelection />}
                {currentStep === 6 && <Step6QRConfig />}
                {currentStep === 7 && <Step7Generate onComplete={onComplete} />}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
