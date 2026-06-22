"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface RippleEvent {
  color: string;
  key: number;
  x?: number;
  y?: number;
}

interface CanvasEffectContextType {
  trigger: (color: string) => void;
  triggerRipple: (color: string, x?: number, y?: number) => void;
  activeRipple: RippleEvent | null;
}

const CanvasEffectContext = createContext<CanvasEffectContextType | undefined>(undefined);

export const useCanvasEffect = () => {
  const ctx = useContext(CanvasEffectContext);
  if (!ctx) throw new Error("useCanvasEffect must be used within CanvasEffectProvider");
  return ctx;
};

export function CanvasEffectProvider({ children }: { children: ReactNode }) {
  const [activeRipple, setActiveRipple] = useState<RippleEvent | null>(null);

  const triggerRipple = useCallback((color: string, x?: number, y?: number) => {
    const key = Date.now();
    setActiveRipple({ color, key, x, y });
    setTimeout(() => setActiveRipple(null), 1200);
  }, []);

  const trigger = useCallback(
    (color: string) => triggerRipple(color),
    [triggerRipple]
  );

  return (
    <CanvasEffectContext.Provider value={{ trigger, triggerRipple, activeRipple }}>
      {children}
    </CanvasEffectContext.Provider>
  );
}
