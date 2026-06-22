"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

interface Project {
  id: string;
  name: string;
  createdDate: string; // formatted string
  filesCount: number;
  qrCount: number;
  lastActivity: string; // formatted string
}

interface ProjectCardProps {
  project: Project;
  onView: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function ProjectCard({ project, onView, onRename, onDelete }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      layoutId={`project-${project.id}`}
      className="relative rounded-xl bg-white/30 backdrop-blur-sm border border-black/10 p-4 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-[family-name:var(--font-instrument)] text-xl text-[#1A1A1A]">{project.name}</h3>
          <p className="text-sm text-[#1A1A1A]/60">Created: {project.createdDate}</p>
          <p className="text-sm text-[#1A1A1A]/60">Updated: {project.lastActivity}</p>
          <div className="mt-2 text-xs text-[#1A1A1A]/70">
            <span>{project.filesCount} Files</span> • <span>{project.qrCount} QR Codes</span>
          </div>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded hover:bg-black/5 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-[#1A1A1A]/60" />
        </button>
      </div>

      {/* Simple dropdown menu */}
      {menuOpen && (
        <div className="absolute right-2 top-8 bg-white/90 backdrop-blur-sm border border-black/10 rounded shadow-md p-2 space-y-1">
          <button onClick={onView} className="w-full text-left text-sm hover:bg-black/5 px-2 py-1 rounded">View</button>
          <button onClick={onRename} className="w-full text-left text-sm hover:bg-black/5 px-2 py-1 rounded">Rename</button>
          <button onClick={onDelete} className="w-full text-left text-sm hover:bg-red-500 hover:text-white px-2 py-1 rounded">Delete</button>
        </div>
      )}
    </motion.div>
  );
}
