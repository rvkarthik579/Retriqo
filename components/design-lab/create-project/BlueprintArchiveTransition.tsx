"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface BlueprintArchiveTransitionProps {
  onAnimationComplete: () => void;
}

export default function BlueprintArchiveTransition({ onAnimationComplete }: BlueprintArchiveTransitionProps) {
  useEffect(() => {
    // The entire animation sequence takes about 3 seconds
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div 
      className="absolute inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-none"
      initial={{ perspective: 1000 }}
    >
      {/* 1. Green Scan Sweep */}
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 1, ease: "linear" }}
        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#2E8B57]/40 to-[#2E8B57] mix-blend-multiply border-b border-[#2E8B57]"
      />

      {/* 2. Brass "FINALIZED" Seal */}
      <motion.div
        initial={{ opacity: 0, scale: 3, rotate: 15 }}
        animate={{ opacity: 1, scale: 1, rotate: -5 }}
        transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
        className="absolute z-10"
      >
        <div className="rounded-xl border-8 border-[#C5A059] px-12 py-6 text-center bg-white/10 backdrop-blur-sm">
          <span className="font-mono text-7xl font-bold tracking-[0.4em] text-[#C5A059] drop-shadow-md">
            FINALIZED
          </span>
        </div>
      </motion.div>

      {/* 3 & 4 & 5. Flip to Blueprint and Roll away */}
      <motion.div
        initial={{ rotateY: 0, scale: 1, y: 0, borderRadius: "0%" }}
        animate={{ 
          rotateY: 180, // Flip over
          scale: [1, 1, 0.2, 0.1], // Shrink down
          y: [0, 0, 100, 800], // Drop down off screen
          borderRadius: ["0%", "0%", "20%", "50%"], // Roll into tube
        }}
        transition={{ 
          delay: 1.8, 
          duration: 1.2, 
          times: [0, 0.4, 0.8, 1],
          ease: "easeInOut"
        }}
        className="absolute inset-0 z-0 bg-[#2A52BE] backface-hidden"
        style={{
          // Steel Blue Blueprint backing with a subtle grid pattern
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0, // It starts hidden, but wait, framer-motion rotateY doesn't automatically show/hide backface perfectly unless constructed carefully.
          // We will just animate opacity up right at the flip point
        }}
      />
      
      {/* We'll use a specific overlay that fades in exactly at the flip to simulate the backface */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.1 }}
        className="absolute inset-0 z-20 bg-[#2A52BE]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

    </motion.div>
  );
}
