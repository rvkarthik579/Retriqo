"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SCANS = [
  { id: "log-1", time: "10:42:15 AM", location: "Station A-17", status: "VERIFIED", action: "Pressure Log Updated" },
  { id: "log-2", time: "09:14:02 AM", location: "Generator B", status: "VERIFIED", action: "Maintenance Manual Accessed" },
  { id: "log-3", time: "Yesterday", location: "HVAC Sector 4", status: "FLAGGED", action: "Missing Compliance Certificate" },
  { id: "log-4", time: "Yesterday", location: "Station A-12", status: "VERIFIED", action: "Routine Check" },
];

export default function RecentScans() {
  return (
    <div className="w-full font-mono text-[11px] text-black/60">
      <div className="grid grid-cols-12 gap-4 border-b border-black/10 pb-2 mb-2 uppercase tracking-widest text-black/40">
        <div className="col-span-2">Time</div>
        <div className="col-span-3">Location</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-5">Action Log</div>
      </div>
      
      <div className="flex flex-col">
        {SCANS.map((scan) => (
          <motion.div
            key={scan.id}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            className="grid grid-cols-12 gap-4 items-center py-3 border-b border-black/5 last:border-0 cursor-default transition-colors"
          >
            <div className="col-span-2 text-black/40">{scan.time}</div>
            <div className="col-span-3 font-medium text-black/70 flex items-center gap-2">
              <span className="h-1 w-1 bg-black/20 rounded-full" />
              {scan.location}
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${scan.status === "VERIFIED" ? "bg-emerald-500/50" : "bg-amber-500/50"}`} />
              <span className="tracking-widest">{scan.status}</span>
            </div>
            <div className="col-span-5 flex justify-between items-center pr-4">
              <span>{scan.action}</span>
              <ArrowRight className="h-3 w-3 text-black/20" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
