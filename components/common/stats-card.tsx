import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from './animated-counter'

interface StatsCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: LucideIcon
  iconColor?: string
  trend?: {
    value: number
    label: string
  }
}

export function StatsCard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  iconColor = 'text-primary',
  trend,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">
              <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
            </p>
            {trend && (
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <span
                  className={
                    trend.value > 0 ? 'text-success' : trend.value < 0 ? 'text-destructive' : ''
                  }
                >
                  {trend.value > 0 ? '+' : ''}
                  {trend.value}%
                </span>
                <span>{trend.label}</span>
              </p>
            )}
          </div>
          <div className={`rounded-lg bg-muted p-3 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
                }
