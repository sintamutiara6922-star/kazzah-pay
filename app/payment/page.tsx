'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AmountSelector } from '@/components/payment/amount-selector'
import { MethodSelector } from '@/components/payment/method-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockPaymentMethods } from '@/lib/atlantic'
import { PaymentMethod } from '@/types'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Reveal } from '@/components/ui/reveal'
import {
  Loader2,
  CreditCard,
  Shield,
  Zap,
  CheckCircle2,
  Clock,
  Smartphone,
} from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()
  const [amount, setAmount] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (amount < 1000) {
      toast.error('Nominal minimal Rp 1.000')
      return
    }

    if (!selectedMethod) {
      toast.error('Silakan pilih metode pembayaran')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          method: selectedMethod.metode,
          type: 'payment',
          name: customerName || 'Anonymous',
          email: customerEmail || `user${Date.now()}@temp.com`,
        }),
      })

      const data = await response.json()

      if (data.success && data.invoiceUrl) {
        toast.success('Pembayaran berhasil dibuat!')
        router.push(`/invoice/${data.invoiceCode}`)
      } else {
        toast.error(data.error || 'Gagal membuat pembayaran')
      }
    } catch (error) {
      console.error('[Yilzi] Payment error:', error)
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-background">
        <div className="absolute inset-0">
          <Image
            src="/images/payment-banner.webp"
            alt="Payment Banner"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <Reveal direction="up" duration={0.8}>
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
              <CreditCard className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Pembayaran Cepat & Aman
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Berbagai metode pembayaran modern untuk kemudahan transaksi Anda
            </p>
          </div>
        </Reveal>
      </section>

      {/* Features Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" delay={100}>
            <div className="grid gap-8 sm:grid-cols-4">
            <div className="text-center">
              <Shield className="mx-auto mb-3 h-10 w-10 text-primary" />
              <div className="font-semibold">100% Aman</div>
              <div className="text-sm text-muted-foreground">Terenkripsi SSL</div>
            </div>
            <div className="text-center">
              <Zap className="mx-auto mb-3 h-10 w-10 text-accent" />
              <div className="font-semibold">Instant</div>
              <div className="text-sm text-muted-foreground">Verifikasi Real-time</div>
            </div>
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-success" />
              <div className="font-semibold">98.7%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <Clock className="mx-auto mb-3 h-10 w-10 text-warning" />
              <div className="font-semibold">24/7</div>
              <div className="text-sm text-muted-foreground">Always Available</div>
            </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Column - Form */}
            <Reveal direction="left" delay={100}>
              <div className="space-y-8">
                <Card className="shadow-lg hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl">Form Pembayaran</CardTitle>
                  <CardDescription>
                    Lengkapi informasi berikut untuk melanjutkan pembayaran
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Section */}
                    <div>
                      <Label className="mb-3 block text-base font-semibold">
                        Nominal Pembayaran (Min. Rp 1.000)
                      </Label>
                      <AmountSelector
                        value={amount}
                        onChange={setAmount}
                      />
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="customerName">Nama (Opsional)</Label>
                        <Input
                          id="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Masukkan nama Anda"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerEmail">Email (Opsional)</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label className="mb-3 block text-base font-semibold">
                        Metode Pembayaran
                      </Label>
                      <MethodSelector
                        methods={mockPaymentMethods}
                        selectedMethod={selectedMethod?.metode || null}
                        onSelect={setSelectedMethod}
                        amount={amount}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Lanjutkan Pembayaran
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              </div>
            </Reveal>

            {/* Right Column - Information */}
            <Reveal direction="right" delay={200}>
              <div className="space-y-8">
                {/* Payment Methods Showcase */}
                <Card className="overflow-hidden shadow-lg hover-lift">
                <div className="relative h-48">
                  <Image
                    src="/images/payment-methods-showcase.webp"
                    alt="Payment Methods"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Metode Pembayaran Tersedia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Smartphone className="h-8 w-8 text-primary" />
                    <div>
                      <div className="font-semibold">QRIS</div>
                      <div className="text-sm text-muted-foreground">Scan & Pay Instant</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Instant
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <CreditCard className="h-8 w-8 text-accent" />
                    <div>
                      <div className="font-semibold">E-Wallet</div>
                      <div className="text-sm text-muted-foreground">DANA, OVO, GoPay</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Instant
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <CreditCard className="h-8 w-8 text-success" />
                    <div>
                      <div className="font-semibold">Virtual Account</div>
                      <div className="text-sm text-muted-foreground">All Major Banks</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      24 Jam
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Keamanan Terjamin</CardTitle>
                  <CardDescription>
                    Transaksi Anda dilindungi dengan teknologi terkini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Enkripsi SSL 256-bit</div>
                      <div className="text-sm text-muted-foreground">
                        Data terenkripsi end-to-end
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold">PCI DSS Compliant</div>
                      <div className="text-sm text-muted-foreground">
                        Standar keamanan internasional
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10">
                      <Zap className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold">Monitoring 24/7</div>
                      <div className="text-sm text-muted-foreground">
                        Deteksi fraud real-time
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
                              }
        
