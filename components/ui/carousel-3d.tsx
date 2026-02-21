'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselItem {
  id: number | string
  content: React.ReactNode
}

interface Carousel3DProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
}

export function Carousel3D({ items, autoPlay = true, interval = 5000 }: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || !items?.length) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, items?.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const getSlidePosition = (index: number) => {
    const diff = index - currentIndex
    const total = items.length

    if (diff === 0) return 'center'
    if (diff === 1 || diff === -total + 1) return 'right'
    if (diff === -1 || diff === total - 1) return 'left'
    return 'hidden'
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="relative w-full px-4 py-16">
      {/* 3D Container */}
      <div className="relative mx-auto h-[450px] w-full max-w-5xl" style={{ perspective: '2000px' }}>
        {items.map((item, index) => {
          const position = getSlidePosition(index)

          return (
            <div
              key={item.id}
              className={cn(
                'absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform transition-all duration-700 ease-out',
                {
                  'z-30 scale-100 opacity-100': position === 'center',
                  'z-20 scale-75 opacity-40 blur-sm': position === 'left' || position === 'right',
                  'z-10 scale-50 opacity-0': position === 'hidden',
                }
              )}
              style={{
                transform:
                  position === 'center'
                    ? 'translateX(-50%) translateY(-50%) scale(1) rotateY(0deg)'
                    : position === 'left'
                      ? 'translateX(-120%) translateY(-50%) scale(0.75) rotateY(25deg)'
                      : position === 'right'
                        ? 'translateX(20%) translateY(-50%) scale(0.75) rotateY(-25deg)'
                        : 'translateX(-50%) translateY(-50%) scale(0.5)',
              }}
            >
              {item.content}
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={goToPrevious} className="h-12 w-12 rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'
              )}
            />
          ))}
        </div>

        <Button variant="outline" size="icon" onClick={goToNext} className="h-12 w-12 rounded-full">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
