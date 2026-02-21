'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Card3DProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function Card3D({ children, className, glowColor = 'rgba(99, 102, 241, 0.5)' }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn('group relative transition-all duration-200', className)}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${
          isHovered ? 'scale(1.02)' : 'scale(1)'
        }`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${50 + rotation.y * 2}% ${
            50 + rotation.x * 2
          }%, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Card content */}
      <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl">
        {children}
      </div>
    </div>
  )
}
