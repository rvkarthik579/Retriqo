"use client";

import { motion } from "framer-motion";
import { Home, LayoutGrid, User, Settings as SettingsIcon } from "lucide-react";

export default function FloatingDock({
  openProjects,
  openAccount,
  openSettings,
  goHome,
}: {
  openProjects: () => void;
  openAccount: () => void;
  openSettings: () => void;
  goHome: () => void;
}) {
  const items = [
    {
      icon: Home,
      label: "Home",
      onClick: () => {
        window.dispatchEvent(new CustomEvent('dashboard-nav', { detail: 'home' }));
        window.scrollTo({ top: 0, behavior: "smooth" });
        goHome();
      },
    },
    { 
      icon: LayoutGrid, 
      label: "Projects", 
      onClick: () => {
        window.dispatchEvent(new CustomEvent('dashboard-nav', { detail: 'projects' }));
        openProjects();
      } 
    },
    { icon: User, label: "Account", onClick: openAccount },
    { icon: SettingsIcon, label: "Settings", onClick: openSettings },
  ];

  return (
    <motion.nav
      style={{ transform: "translateX(-50%)" }}
      className="fixed left-1/2 z-40 flex items-center gap-1 rounded-full border border-white/30 bg-white/40 px-2 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl"
      initial={{ opacity: 0, top: "12px" }}
      animate={{ opacity: 1, top: "32px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={item.onClick}
            className="group relative flex items-center gap-2 rounded-full px-4 py-2 text-black/50 transition-all hover:bg-black/5 hover:text-black"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden font-mono text-[10px] font-medium uppercase tracking-widest sm:inline">
              {item.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
