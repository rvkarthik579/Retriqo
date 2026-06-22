"use client";

import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, FileArchive, FileType2, AlertTriangle, ArrowDown, XCircle, CheckCircle2 } from "lucide-react";
import type { WorkspaceFile } from "./CreateProjectWorkspace";

interface InspectionCardProps {
  file: WorkspaceFile;
  status: "PASS" | "ATTENTION" | "ACTION_REQUIRED";
}

export default function InspectionCard({ file, status }: InspectionCardProps) {
  const getIcon = () => {
    if (file.name.endsWith(".zip") || file.name.endsWith(".rar") || file.name.endsWith(".7z")) {
      return <FileArchive className="h-6 w-6 text-black/60" />;
    }
    if (file.name.endsWith(".png") || file.name.endsWith(".jpg")) {
      return <ImageIcon className="h-6 w-6 text-black/60" />;
    }
    if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
      return <FileText className="h-6 w-6 text-black/60" />;
    }
    return <FileType2 className="h-6 w-6 text-black/60" />;
  };

  const getExt = () => {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop()?.toUpperCase() : "FILE";
  };

  const isArchiveToConvert = file.name.endsWith(".rar") || file.name.endsWith(".7z");

  // Aesthetically, it looks like a physical clipboard sheet or report
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative flex w-full flex-col overflow-hidden rounded-md border-2 bg-white p-6 shadow-sm transition-colors ${
        status === "PASS" ? "border-[#2E8B57]/20" : 
        status === "ATTENTION" ? "border-[#FFBF00]/30" : 
        "border-[#811331]/20 opacity-70"
      }`}
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E\")",
      }}
    >
      {/* Header Line */}
      <div className="flex items-start justify-between border-b border-black/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-black/5">
            {getIcon()}
          </div>
          <div className="flex flex-col">
            <span className={`font-mono text-xs font-bold uppercase tracking-widest ${status === "ACTION_REQUIRED" ? "line-through opacity-50" : "text-black"}`}>
              {file.name}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-black/40">
              Format: {getExt()} • Size: {(Math.random() * 10 + 1).toFixed(1)} MB
            </span>
          </div>
        </div>

        {/* Industrial Stamps */}
        {status === "PASS" && (
          <div className="flex items-center gap-2 rounded-md border-2 border-[#2E8B57] bg-[#2E8B57]/10 px-3 py-1 text-[#2E8B57]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Cleared</span>
          </div>
        )}
        {status === "ATTENTION" && (
          <div className="flex items-center gap-2 rounded-md border-2 border-[#FFBF00] bg-[#FFBF00]/10 px-3 py-1 text-[#C08D00]">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Attention</span>
          </div>
        )}
        {status === "ACTION_REQUIRED" && (
          <div className="flex items-center gap-2 rounded-md border-2 border-[#811331] bg-[#811331]/10 px-3 py-1 text-[#811331]">
            <XCircle className="h-4 w-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Rejected</span>
          </div>
        )}
      </div>

      {/* Body / Report Details */}
      <div className="mt-4">
        {status === "PASS" && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#2E8B57]/70">
            Analysis complete. Structure intact. Ready for crucible conversion.
          </p>
        )}
        
        {status === "ACTION_REQUIRED" && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#811331]/70">
            Invalid format detected. Executables and system files are strictly prohibited.
          </p>
        )}

        {status === "ATTENTION" && isArchiveToConvert && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#C08D00]/80">
              Standardized tree generation requires ZIP format. Follow conversion procedure:
            </p>
            
            <div className="flex items-center gap-3 text-[#C08D00]">
              <div className="flex flex-col items-center">
                <div className="rounded-md border border-[#FFBF00]/40 bg-white px-3 py-1.5 font-mono text-[9px] font-bold shadow-sm">.{getExt()}</div>
              </div>
              <ArrowDown className="h-3 w-3 -rotate-90 opacity-40" />
              <div className="flex flex-col items-center">
                <div className="rounded-md border border-[#FFBF00]/40 bg-white px-3 py-1.5 font-mono text-[9px] font-bold shadow-sm">Extract Folder</div>
              </div>
              <ArrowDown className="h-3 w-3 -rotate-90 opacity-40" />
              <div className="flex flex-col items-center">
                <div className="rounded-md border border-[#FFBF00]/40 bg-white px-3 py-1.5 font-mono text-[9px] font-bold shadow-sm">Compress .ZIP</div>
              </div>
              <ArrowDown className="h-3 w-3 -rotate-90 opacity-40" />
              <div className="flex flex-col items-center">
                <div className="rounded-md bg-[#FFBF00] text-white px-3 py-1.5 font-mono text-[9px] font-bold shadow-sm">Re-Upload</div>
              </div>
            </div>
          </div>
        )}

        {status === "ATTENTION" && !isArchiveToConvert && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#C08D00]/80">
            Warning: File size exceeds standard limits. Optimization recommended prior to conversion.
          </p>
        )}
      </div>

    </motion.div>
  );
}
