'use client'

import React, { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number // percentage 0-100
  y: number // percentage 0-100
  size: number // px 1-4
  opacity: number // 0.4 - 0.9
  duration: number // 20-40s
  driftX: number // random drift x offset (5 to 15px)
  driftY: number // random drift y offset (5 to 15px)
  pulse: boolean // whether it blinks
  pulseDuration: number // 3-6s
  glow: boolean
}

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const generatedStars: Star[] = Array.from({ length: 120 }).map((_, i) => {
      const rand = Math.random()
      let size = 1.5
      if (rand > 0.95) {
        size = Math.random() * 1 + 3 // 3px to 4px (5%)
      } else if (rand > 0.70) {
        size = Math.random() * 1 + 2 // 2px to 3px (25%)
      } else {
        size = Math.random() * 1 + 1 // 1px to 2px (70%)
      }

      const opacity = Math.random() * 0.5 + 0.4 // 0.4 to 0.9
      const duration = Math.random() * 20 + 20 // 20s to 40s
      
      // Drift: 5px to 15px (positive or negative)
      const driftX = (Math.random() * 10 + 5) * (Math.random() > 0.5 ? 1 : -1)
      const driftY = (Math.random() * 10 + 5) * (Math.random() > 0.5 ? 1 : -1)
      
      const pulse = Math.random() > 0.5 // 50% chance of pulsing
      const pulseDuration = Math.random() * 3 + 3 // 3s to 6s
      const glow = size >= 3.0

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity,
        duration,
        driftX,
        driftY,
        pulse,
        pulseDuration,
        glow,
      }
    })
    setStars(generatedStars)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1, // z-index: 1
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <style>{`
        @keyframes floatStar {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: var(--drift-translate);
          }
        }
        @keyframes pulseStar {
          0%, 100% {
            opacity: var(--min-opacity);
          }
          50% {
            opacity: var(--max-opacity);
          }
        }
      `}</style>
      {stars.map((star) => {
        const starStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          backgroundColor: 'white',
          borderRadius: '50%',
          opacity: star.opacity,
          boxShadow: star.glow ? '0 0 3px white' : 'none',
          '--drift-translate': `translate(${star.driftX}px, ${star.driftY}px)`,
          '--min-opacity': 0.3,
          '--max-opacity': star.opacity,
          animation: `${star.pulse ? `pulseStar ${star.pulseDuration}s ease-in-out infinite, ` : ''}floatStar ${star.duration}s ease-in-out infinite alternate`,
        } as any

        return <div key={star.id} style={starStyle} />
      })}
    </div>
  )
}
