'use client'

import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function LivingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth mouse movement for the spotlight effect
  const springConfig = { damping: 25, stiffness: 200 }
  const spotlightX = useSpring(mouseX, springConfig)
  const spotlightY = useSpring(mouseY, springConfig)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: '#030409' }}
    >
      {/* Base Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(#4d5bce 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Spotlight Effect that follows the mouse */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          x: spotlightX,
          y: spotlightY,
          translateX: '-50%',
          translateY: '-50%',
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 60%)',
          borderRadius: '50%',
        }}
      />
      
      {/* Subtle ambient gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px]" />
    </div>
  )
}
