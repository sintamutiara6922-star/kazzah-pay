'use client'

import { LucideIcon } from 'lucide-react'
import { Card3D } from '@/components/ui/card-3d'
import { AnimatedCounter } from './animated-counter'

interface StatsCardModernProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: LucideIcon
  gradient?: string
  trend?: {
    value: number
    label: string
  }
}

export function StatsCardModern({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  gradient = 'from-primary to-accent',
  trend,
}: StatsCardModernProps) {
  return (
    <Card3D>
      <div className="relative overflow-hidden p-6">
        {/* Background gradient orb */}
        <div
          className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl`}
        />

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">
              <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
            </p>
            {trend && (
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                    trend.value > 0
                      ? 'bg-success/10 text-success'
                      : trend.value < 0
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </Card3D>
  )
}
