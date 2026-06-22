"use client";

import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, FileArchive, FileType2 } from "lucide-react";
import type { WorkspaceFile } from "./CreateProjectWorkspace";

interface FileArtifactProps {
  file: WorkspaceFile;
}

export default function FileArtifact({ file }: FileArtifactProps) {
  const getIcon = () => {
    if (file.name.endsWith(".zip")) return <FileArchive className="h-8 w-8 text-[#1A1A1A]/60" />;
    if (file.name.endsWith(".png") || file.name.endsWith(".jpg")) return <ImageIcon className="h-8 w-8 text-[#1A1A1A]/60" />;
    if (file.name.endsWith(".pdf")) return <FileText className="h-8 w-8 text-[#1A1A1A]/60" />;
    return <FileType2 className="h-8 w-8 text-[#1A1A1A]/60" />;
  };

  const getExt = () => {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop()?.toUpperCase() : "FILE";
  };

  // Provide dragging capability directly to the artifact.
  // When it's dragged and let go, if it intersects the Crucible, it triggers the callback.
  // We'll manage the global drag logic via a Framer Motion DragDrop context or simply onDragEnd in AssemblyArea.
  
  return (
    <motion.div
      layoutId={`file-artifact-${file.id}`}
      whileHover={{ scale: 1.05, rotate: (Math.random() - 0.5) * 4 }}
      className="relative flex h-32 w-28 flex-col items-center justify-center rounded-sm bg-[#FCFCFA] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.1),_inset_0_0_0_1px_rgba(0,0,0,0.05)]"
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E\")",
      }}
    >
      <div className="mb-2">{getIcon()}</div>
      
      <div className="w-full truncate text-center font-mono text-[9px] font-bold uppercase text-black/80">
        {file.name}
      </div>
      <div className="mt-1 flex items-center justify-center rounded-sm bg-black/5 px-2 py-0.5">
        <span className="font-mono text-[8px] font-bold text-black/40">{getExt()}</span>
      </div>

      <div className="absolute inset-0 -z-10 translate-y-0.5 scale-[0.98] rounded-sm border border-black/5 bg-[#FCFCFA] opacity-50" />
    </motion.div>
  );
}
