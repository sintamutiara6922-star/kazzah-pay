'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { CheckCircle2, AlertCircle, Clock, Activity } from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: string
  responseTime: string
}

const services: ServiceStatus[] = [
  { name: 'API Gateway', status: 'operational', uptime: '99.99%', responseTime: '45ms' },
  { name: 'Payment Processing', status: 'operational', uptime: '99.98%', responseTime: '120ms' },
  { name: 'Database', status: 'operational', uptime: '99.99%', responseTime: '15ms' },
  { name: 'Dashboard', status: 'operational', uptime: '99.97%', responseTime: '200ms' },
  { name: 'Webhooks', status: 'operational', uptime: '99.96%', responseTime: '80ms' },
  { name: 'Authentication', status: 'operational', uptime: '99.99%', responseTime: '50ms' },
]

const incidents = [
  {
    id: 1,
    title: 'Scheduled Maintenance',
    description: 'Routine database optimization and updates',
    status: 'resolved',
    date: '2025-02-10',
    duration: '2 hours',
  },
  {
    id: 2,
    title: 'Increased Response Time',
    description: 'API response time was temporarily elevated due to high traffic',
    status: 'resolved',
    date: '2025-02-05',
    duration: '45 minutes',
  },
]

const metrics = [
  { label: 'Uptime (30 days)', value: '99.98%', icon: Activity },
  { label: 'Avg Response Time', value: '85ms', icon: Clock },
  { label: 'Incidents (30 days)', value: '2', icon: AlertCircle },
  { label: 'Transactions Today', value: '125k+', icon: CheckCircle2 },
]

function StatusBadge({ status }: { status: string }) {
  const variants = {
    operational: { color: 'bg-green-500', text: 'Operational' },
    degraded: { color: 'bg-yellow-500', text: 'Degraded' },
    down: { color: 'bg-red-500', text: 'Down' },
  }
  
  const variant = variants[status as keyof typeof variants] || variants.operational
  
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${variant.color}`} />
      <span className="text-sm font-medium">{variant.text}</span>
    </div>
  )
}

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background px-4 py-16 sm:px-6 lg:px-8">
          <Reveal direction="up" duration={0.8}>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                <Badge variant="outline" className="border-green-500 text-green-600">
                  All Systems Operational
                </Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                System Status
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Real-time status and performance metrics
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Last updated: {currentTime.toLocaleTimeString('id-ID')}
              </p>
            </div>
          </Reveal>
        </section>

        {/* Metrics Overview */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <Reveal key={metric.label} direction="up" delay={index * 100}>
                  <Card className="hover-lift">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.label}
                      </CardTitle>
                      <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Service Status */}
        <section className="border-t px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up">
              <h2 className="mb-8 text-2xl font-bold tracking-tight">Service Status</h2>
            </Reveal>
            <div className="space-y-4">
              {services.map((service, index) => (
                <Reveal key={service.name} direction="up" delay={index * 50}>
                  <Card className="hover-lift">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <StatusBadge status={service.status} />
                        </div>
                      </div>
                      <div className="flex gap-8 text-sm text-muted-foreground">
                        <div>
                          <div className="font-medium text-foreground">{service.uptime}</div>
                          <div>Uptime</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{service.responseTime}</div>
                          <div>Response Time</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="border-t bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up">
              <h2 className="mb-8 text-2xl font-bold tracking-tight">Recent Incidents</h2>
            </Reveal>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <Reveal key={incident.id} direction="up" delay={index * 100}>
                  <Card className="hover-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <CardDescription>{incident.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          Resolved
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Date:</span> {incident.date}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {incident.duration}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="border-t px-4 py-12 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <Card className="mx-auto max-w-2xl text-center">
              <CardHeader>
                <CardTitle>Get Status Updates</CardTitle>
                <CardDescription>
                  Subscribe to receive notifications about system status and incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    Subscribe
                  </button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  )
      }
    
