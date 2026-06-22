"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ProjectLedger from "./ProjectLedger";
import AssemblyArea from "./AssemblyArea";
import BrassCrucible from "./BrassCrucible";
import ToolPalette from "./ToolPalette";
import BlueprintArchiveTransition from "./BlueprintArchiveTransition";
import type { DesignLabProject } from "@/components/design-lab/types";
import { useToast } from "@/components/design-lab/ToastProvider";

export interface WorkspaceFile {
  id: string;
  name: string;
  type: string;
  isConverted: boolean;
}

export interface WorkspaceLedger {
  name: string;
  machineName: string;
  location: string;
  machineType: string;
  description: string;
  isValidated: boolean;
}

export interface WorkspaceConfig {
  logo: string | null;
  color: string;
  structure: string;
  errorCorrection: string;
}

interface CreateProjectWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (project: DesignLabProject) => void;
}

export default function CreateProjectWorkspace({
  isOpen,
  onClose,
  onComplete,
}: CreateProjectWorkspaceProps) {
  const { addToast } = useToast();
  
  // Workspace State
  const [ledger, setLedger] = useState<WorkspaceLedger>({
    name: "",
    machineName: "",
    location: "",
    machineType: "",
    description: "",
    isValidated: false,
  });

  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  
  const [config, setConfig] = useState<WorkspaceConfig>({
    logo: null,
    color: "#000000",
    structure: "Standard",
    errorCorrection: "Medium",
  });

  const [isArchiving, setIsArchiving] = useState(false);

  const updateLedger = (partial: Partial<WorkspaceLedger>) => {
    setLedger((prev) => ({ ...prev, ...partial }));
  };

  const handleApproveBlueprint = () => {
    if (!ledger.isValidated) {
      addToast("Project Ledger must be validated first.");
      return;
    }
    const hasConverted = files.some(f => f.isConverted);
    if (!hasConverted) {
      addToast("Convert at least one file into a QR artifact.");
      return;
    }
    
    // Trigger Archive Transition
    setIsArchiving(true);
  };

  const finalizeArchive = () => {
    const finalProject: DesignLabProject = {
      id: `proj-${Date.now()}`,
      name: ledger.name || "Untitled Project",
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      filesCount: files.length,
      qrCount: files.filter(f => f.isConverted).length,
      lastActivity: "Just now",
    };
    onComplete(finalProject);
    // Reset state after a brief delay so it's clean next time
    setTimeout(() => {
      setIsArchiving(false);
      setLedger({ name: "", machineName: "", location: "", machineType: "", description: "", isValidated: false });
      setFiles([]);
      setConfig({ logo: null, color: "#000000", structure: "Standard", errorCorrection: "Medium" });
    }, 1000);
  };

  // Physical drafting paper background
  const paperStyle = {
    backgroundColor: "#F7F6F0", // Drafting Cream
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E\")",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm"
        >
          {/* Main Fixed Workspace - Viewport sized */}
          <motion.div 
            initial={{ scale: 0.98, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={paperStyle}
            className="relative flex h-[95vh] w-[95vw] max-w-[1600px] overflow-hidden rounded-[2rem] border border-black/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
          >
            {/* Header / Close Button */}
            <div className="absolute right-8 top-8 z-50">
              <button
                onClick={onClose}
                className="rounded-full bg-black/5 p-3 transition-colors hover:bg-black/10"
              >
                <X className="h-6 w-6 text-black/60" />
              </button>
            </div>

            {/* Left Column: Ledger & Assembly */}
            <div className="flex w-1/2 flex-col border-r border-black/10">
              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <ProjectLedger ledger={ledger} updateLedger={updateLedger} />
                <div className="my-12 h-px w-full bg-black/10" />
                <AssemblyArea files={files} setFiles={setFiles} />
              </div>
            </div>

            {/* Right Column: Crucible & Tool Palette */}
            <div className="flex w-1/2 flex-col bg-white/40">
              <div className="flex flex-1 items-center justify-center p-12">
                <BrassCrucible files={files} setFiles={setFiles} />
              </div>
              <div className="border-t border-black/10 bg-white/60 p-8">
                <ToolPalette config={config} setConfig={setConfig} onApprove={handleApproveBlueprint} />
              </div>
            </div>

            {/* Finale Overlay Sequence */}
            <AnimatePresence>
              {isArchiving && (
                <BlueprintArchiveTransition onAnimationComplete={finalizeArchive} />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
