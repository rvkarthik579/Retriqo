"use client";

import type { DesignLabProject } from "@/components/design-lab/types";
import { useCanvasEffect } from "@/components/design-lab/CanvasEffectContext";
import { Folder, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardsProps {
  projects: DesignLabProject[];
  selectedProjectId: string | null;
  onSelectProject: (project: DesignLabProject) => void;
}

export default function ProjectCards({
  projects,
  selectedProjectId,
  onSelectProject,
}: ProjectCardsProps) {
  const { triggerRipple } = useCanvasEffect();

  if (projects.length === 0) return null;

  const paperStyle = {
    boxShadow:
      "0 4px 20px -4px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.1)",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E\")",
  };

  return (
    <div id="projects-section" className="relative z-20 w-full">

      <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-2">
        {projects.map((project, i) => {
          const rotation = i % 2 === 0 ? 1.5 : -1.5;
          const yOffset = i % 3 === 0 ? 4 : -2;
          const isSelected = selectedProjectId === project.id;

          return (
            <motion.div
              key={project.id}
              layoutId={`project-card-${project.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isSelected ? 0 : 1,
                y: yOffset,
                rotate: rotation,
                pointerEvents: isSelected ? "none" : "auto",
              }}
              whileHover={
                isSelected
                  ? undefined
                  : {
                      scale: 1.02,
                      y: yOffset - 10,
                      rotate: 0,
                      transition: { type: "spring", stiffness: 400, damping: 25 },
                    }
              }
              transition={{
                delay: i * 0.08,
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              onClick={() => {
                onSelectProject(project);
                triggerRipple("#4A90E2");
              }}
              className="group relative flex cursor-pointer flex-col bg-[#FFFFFF] p-8 transition-shadow hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]"
              style={paperStyle}
            >
              <div className="absolute right-0 top-0 h-8 w-8 bg-gradient-to-bl from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="mb-16 flex items-start justify-between">
                <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                  <Folder className="h-8 w-8 text-[#1A1A1A]/80" />
                </div>
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    className="rounded-full bg-white p-3 text-black/70 shadow-md transition-transform hover:scale-110 active:scale-95"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit2 className="h-4 w-4 text-black/50" />
                  </button>
                  <button
                    className="rounded-full bg-white p-3 text-red-500/70 shadow-md transition-transform hover:scale-110 hover:text-red-600 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerRipple("#FF6B6B");
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>

              <motion.div layoutId={`project-content-${project.id}`}>
                <motion.h3
                  layoutId={`project-title-${project.id}`}
                  className="mb-3 font-[family-name:var(--font-instrument)] text-4xl text-[#1A1A1A]"
                >
                  {project.name}
                </motion.h3>

                <div className="mt-8 flex gap-8 border-t border-black/5 pt-8">
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-black/40">
                      Created
                    </p>
                    <p className="text-sm font-medium">{project.createdDate}</p>
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-black/40">
                      Files
                    </p>
                    <p className="text-sm font-medium">{project.filesCount}</p>
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-black/40">
                      QR Codes
                    </p>
                    <p className="text-sm font-medium">{project.qrCount}</p>
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-black/40">
                      Last Activity
                    </p>
                    <p className="text-sm font-medium">{project.lastActivity}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
