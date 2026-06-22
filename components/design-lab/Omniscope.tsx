"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface OmniscopeProps {
  onFocusChange?: (focused: boolean) => void;
}

export default function Omniscope({ onFocusChange }: OmniscopeProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  return (
    <motion.div layout className="relative z-40 mx-auto w-full max-w-4xl px-8">
      <input
        disabled
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search functionality coming soon..."
        className="w-full bg-transparent text-center font-[family-name:var(--font-instrument)] text-3xl text-[#1A1A1A] outline-none transition-all duration-500 ease-out placeholder:text-[#1A1A1A]/20 disabled:cursor-not-allowed md:text-4xl lg:text-5xl"
      />

      {/* Elegant Underline indicating active focus */}
      <motion.div
        layout
        className="mx-auto mt-8 h-[1px] bg-black/10 transition-all duration-700 ease-out"
        animate={{
          width: isFocused ? "100%" : "40%",
          backgroundColor: isFocused ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)",
          boxShadow: isFocused ? "0 0 40px 2px rgba(0,0,0,0.1)" : "none",
        }}
      />
    </motion.div>
  );
}
