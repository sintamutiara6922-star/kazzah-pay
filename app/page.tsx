'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StatsCardModern } from '@/components/common/stats-card-modern'
import { Badge } from '@/components/ui/badge'
import { Card3D } from '@/components/ui/card-3d'
import { Carousel3D } from '@/components/ui/carousel-3d'
import { Reveal } from '@/components/ui/reveal'
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  CreditCard,
  Clock,
  CheckCircle2,
  Smartphone,
  BarChart3,
  Lock,
  Wallet,
  Sparkles,
  Star,
  Play,
  Check,
} from 'lucide-react'

interface Stats {
  totalAmount: number
  totalTransactions: number
  activeToday: number
  successRate: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    totalTransactions: 0,
    activeToday: 0,
    successRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      if (data.success) {
        setStats({
          totalAmount: data.stats.totalAmount || 0,
          totalTransactions: data.stats.totalTransactions || 0,
          activeToday: data.stats.activeToday || 0,
          successRate: data.stats.successRate || 0,
        })
      }
    } catch (error) {
      console.error('[Yilzi] Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Avada Style with Large Image */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
            {/* Left: Content */}
            <Reveal direction="right" duration={0.8}>
              <div className="relative z-10">
                <Badge
                  variant="outline"
                  className="mb-6 border-primary/50 bg-primary/10 text-primary backdrop-blur-sm"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  #1 Payment Gateway Indonesia
                </Badge>
                <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Solusi Payment Gateway
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Terpercaya & Modern
                </span>
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                Terima pembayaran dan donasi dengan mudah. Mendukung QRIS, e-wallet, virtual
                account, dan semua bank major Indonesia. Real-time verification dan dashboard
                analytics yang powerful.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="h-12 gap-2 shadow-lg shadow-primary/25" asChild>
                  <Link href="/payment">
                    Mulai Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 gap-2" asChild>
                  <Link href="/docs">
                    <Play className="h-4 w-4" />
                    Lihat Demo
                  </Link>
                </Button>
              </div>

              {/* Quick Benefits */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Real-time Processing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>API Documentation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>24/7 Support</span>
                </div>
              </div>
              </div>
            </Reveal>

            {/* Right: Hero Image */}
            <Reveal direction="left" duration={0.8} delay={200}>
              <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/images/hero-payment.webp"
                  alt="Payment Gateway Dashboard"
                  width={600}
                  height={500}
                  className="h-auto w-full object-cover transition-transform duration-700 hover:scale-110"
                  priority
                />
              </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Live Stats Section */}
        <section className="border-b border-border/50 bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up" duration={0.6}>
              <div className="mb-12 text-center">
                <Badge variant="outline" className="mb-3">
                  Real-time Statistics
                </Badge>
                <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  Dipercaya oleh Ribuan Pengguna
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Reveal direction="up" delay={100}>
                <StatsCardModern
                  title="Total Terkumpul"
                  value={stats.totalAmount}
                  icon={Wallet}
                  gradient="from-primary to-blue-600"
                />
              </Reveal>
              <Reveal direction="up" delay={200}>
                <StatsCardModern
                  title="Total Transaksi"
                  value={stats.totalTransactions}
                  suffix="+"
                  icon={Users}
                  gradient="from-accent to-purple-600"
                />
              </Reveal>
              <Reveal direction="up" delay={300}>
                <StatsCardModern
                  title="Aktif Hari Ini"
                  value={stats.activeToday}
                  icon={TrendingUp}
                  gradient="from-green-500 to-emerald-600"
                />
              </Reveal>
              <Reveal direction="up" delay={400}>
                <StatsCardModern
                  title="Success Rate"
                  value={stats.successRate}
                  suffix="%"
                  icon={CheckCircle2}
                  gradient="from-orange-500 to-red-500"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Features Section with Images */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up">
              <div className="mb-16 text-center">
                <Badge variant="outline" className="mb-3">
                  Fitur Unggulan
                </Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Platform Payment Gateway Lengkap
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                Semua yang Anda butuhkan untuk menerima pembayaran dan mengelola donasi
              </p>
              </div>
            </Reveal>

            {/* Feature 1: Multi Payment Method */}
            <Reveal direction="left" delay={100}>
              <div className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/images/mobile-payment.webp"
                    alt="Multi Payment Methods"
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <Badge variant="secondary" className="mb-4">
                  <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                  Payment Methods
                </Badge>
                <h3 className="text-3xl font-bold">Terima Semua Metode Pembayaran</h3>
                <p className="mt-4 text-lg text-muted-foreground">
                  Mendukung QRIS, e-wallet (DANA, OVO, GoPay, ShopeePay), virtual account semua
                  bank, dan transfer bank langsung. Satu integrasi untuk semua.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'QRIS - Scan & Pay Instant',
                    'E-Wallet - DANA, OVO, GoPay, ShopeePay',
                    'Virtual Account - BCA, Mandiri, BNI, BRI',
                    'Bank Transfer - Real-time Verification',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
            </Reveal>

            {/* Feature 2: Security */}
            <Reveal direction="right" delay={100}>
              <div className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  <Shield className="mr-1.5 h-3.5 w-3.5" />
                  Security First
                </Badge>
                <h3 className="text-3xl font-bold">Keamanan Tingkat Enterprise</h3>
                <p className="mt-4 text-lg text-muted-foreground">
                  Enkripsi end-to-end, webhook signature verification, dan compliance dengan
                  standar industri internasional. Data Anda aman bersama kami.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'SSL/TLS Encryption',
                    'Webhook Signature Verification',
                    'Rate Limiting & DDoS Protection',
                    'PCI DSS Compliant',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/images/secure-payment.webp"
                    alt="Secure Payment System"
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
              </div>
            </Reveal>

            {/* Feature 3: Analytics */}
            <Reveal direction="left" delay={100}>
              <div className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/images/analytics.webp"
                    alt="Analytics Dashboard"
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <Badge variant="secondary" className="mb-4">
                  <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                  Analytics & Insights
                </Badge>
                <h3 className="text-3xl font-bold">Dashboard Analytics Real-time</h3>
                <p className="mt-4 text-lg text-muted-foreground">
                  Monitor semua transaksi, analisa performa, dan dapatkan insights bisnis dengan
                  dashboard analytics yang powerful dan mudah dipahami.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Real-time Transaction Monitoring',
                    'Revenue Analytics & Reports',
                    'Success Rate Tracking',
                    'Export Data & Custom Reports',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
            </Reveal>

            {/* Feature 4: API Integration */}
            <Reveal direction="right" delay={100}>
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  <Zap className="mr-1.5 h-3.5 w-3.5" />
                  Developer Friendly
                </Badge>
                <h3 className="text-3xl font-bold">API Documentation Lengkap</h3>
                <p className="mt-4 text-lg text-muted-foreground">
                  Dokumentasi API yang jelas, contoh kode untuk berbagai bahasa pemrograman, dan
                  sandbox environment untuk testing. Integrasi dalam hitungan menit.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'RESTful API dengan JSON Response',
                    'Webhook untuk Real-time Updates',
                    'SDKs untuk Multiple Languages',
                    'Sandbox Environment Testing',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" variant="outline" className="mt-8" asChild>
                  <Link href="/docs">Lihat API Documentation</Link>
                </Button>
              </div>
              <div>
                <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/images/api-integration.webp"
                    alt="API Integration"
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="border-y border-border/50 bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold">Dipercaya oleh Perusahaan Terkemuka</h2>
              <p className="mt-2 text-muted-foreground">
                Ribuan bisnis menggunakan PaymentHub untuk payment processing
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                '/images/partners/fintech-partner.webp',
                '/images/partners/ecommerce.webp',
                '/images/partners/ngo.webp',
                '/images/partners/tech-startup.webp',
              ].map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-lg border border-border/50 bg-card p-8 grayscale transition-all hover:grayscale-0"
                >
                  <Image
                    src={logo}
                    alt={`Partner ${i + 1}`}
                    width={120}
                    height={60}
                    className="h-auto w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section with 3D Carousel */}
        <section className="overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <Badge variant="outline" className="mb-3">
                Testimonials
              </Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Apa Kata Mereka?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                Testimoni dari ribuan pengguna yang puas menggunakan PaymentHub
              </p>
            </div>

            <Carousel3D items={testimonials.map((testimonial, index) => ({
              id: index,
              content: (
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent" />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            }))} />
          </div>
        </section>

        {/* CTA Section with Image */}
        <section className="relative overflow-hidden border-y border-border/50 bg-gradient-to-br from-primary to-accent px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[url('/images/hero-donation.webp')] bg-cover bg-center opacity-10" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Siap Mulai Terima Pembayaran?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-white/90">
              Bergabunglah dengan ribuan bisnis yang telah mempercayai PaymentHub. Daftar
              sekarang dan mulai terima pembayaran dalam hitungan menit.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="h-12 shadow-xl" asChild>
                <Link href="/payment">Mulai Sekarang</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/20 bg-white/10 text-white hover:bg-white/20"
                asChild>
                <Link href="/contact">Hubungi Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

const testimonials = [
  {
    name: 'Ambatukan',
    role: 'CEO, TechStart Indonesia',
    content:
      'PaymentHub sangat memudahkan kami dalam menerima pembayaran. Integrasi API-nya mudah dan dokumentasinya lengkap. Highly recommended!',
  },
  {
    name: 'Kontokuning',
    role: 'Founder, Charity Foundation',
    content:
      'Platform terbaik untuk mengelola donasi. Dashboard analytics-nya membantu kami monitor campaign dengan mudah. Support team juga sangat responsif.',
  },
  {
    name: 'Dr.riski',
    role: 'CTO, E-Commerce Startup',
    content:
      'Success rate 99.5%! Real-time processing dan webhook notification membuat customer experience kami jadi lebih baik. Worth every penny!',
  },
]
