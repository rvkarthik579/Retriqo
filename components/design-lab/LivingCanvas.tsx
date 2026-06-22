"use client";

import { useEffect, useRef } from "react";
import { useCanvasEffect } from "./CanvasEffectContext";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  color?: { r: number; g: number; b: number };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export default function LivingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { activeRipple } = useCanvasEffect();
  const pendingRippleRef = useRef<{ x: number; y: number; color: { r: number; g: number; b: number } } | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    if (activeRipple) {
      const [r, g, b] = hexToRgb(activeRipple.color);
      const x = activeRipple.x ?? window.innerWidth / 2;
      const y = activeRipple.y ?? window.innerHeight / 2;
      pendingRippleRef.current = { x, y, color: { r, g, b } };
    }
  }, [activeRipple]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const SPACING = 32;

    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleClick = (e: MouseEvent) => {
      ripplesRef.current.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 1 });
    };

    window.addEventListener("resize", resize);
    window.addEventListener("click", handleClick);

    // Initial soft water-ripple on load
    setTimeout(() => {
      ripplesRef.current.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radius: 0,
        alpha: 0.8,
        color: { r: 74, g: 144, b: 226 },
      });
    }, 100);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (pendingRippleRef.current) {
        ripplesRef.current.push({
          x: pendingRippleRef.current.x,
          y: pendingRippleRef.current.y,
          radius: 0,
          alpha: 1,
          color: pendingRippleRef.current.color,
        });
        pendingRippleRef.current = null;
      }

      ripplesRef.current.forEach((r) => {
        r.radius += 10; // Slower wave for 1.5s duration
        r.alpha -= 0.01; // Slower fade
      });
      ripplesRef.current = ripplesRef.current.filter((r) => r.alpha > 0);

      for (let x = 0; x < width; x += SPACING) {
        for (let y = 0; y < height; y += SPACING) {
          const offsetX = 0;
          let offsetY = 0;
          let scale = 1;
          let alpha = 0.1;

          let finalR = 26;
          let finalG = 26;
          let finalB = 26;

          ripplesRef.current.forEach((r) => {
            const rdx = x - r.x;
            const rdy = y - r.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            const diff = Math.abs(rdist - r.radius);

            if (diff < 80) { // Wider band for color
              const rForce = (80 - diff) / 80;
              const rPush = Math.sin(rForce * Math.PI) * 15 * r.alpha;
              offsetY -= rPush;
              scale += rForce * r.alpha;
              alpha += rForce * r.alpha * 0.3;

              if (r.color) {
                // Color tinting based on wave strength
                const tint = rForce * r.alpha;
                finalR = Math.round(finalR + (r.color.r - finalR) * tint);
                finalG = Math.round(finalG + (r.color.g - finalG) * tint);
                finalB = Math.round(finalB + (r.color.b - finalB) * tint);
              }
            }
          });

          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, 1.2 * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${finalR}, ${finalG}, ${finalB}, ${alpha})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60 mix-blend-multiply"
    />
  );
}
