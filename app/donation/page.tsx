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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { mockPaymentMethods } from '@/lib/atlantic'
import { PaymentMethod } from '@/types'
import { getDonationTier } from '@/lib/utils'
import { DONATION_TIERS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Heart, Trophy, Users, TrendingUp, Award } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

export default function DonationPage() {
  const router = useRouter()
  const [amount, setAmount] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  const tier = getDonationTier(amount)
  const tierInfo = tier ? DONATION_TIERS[tier] : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (amount < 1000) {
      toast.error('Nominal donasi minimal Rp 1.000')
      return
    }

    if (!selectedMethod) {
      toast.error('Silakan pilih metode pembayaran')
      return
    }

    if (!donorName.trim()) {
      toast.error('Nama donatur harus diisi')
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
          type: 'donation',
          name: donorName,
          email: donorEmail || `donor${Date.now()}@temp.com`,
          phone: '',
          message,
          anonymous,
        }),
      })

      const data = await response.json()

      if (data.success && data.invoiceUrl) {
        toast.success('Terima kasih atas donasi Anda!')
        router.push(`/invoice/${data.invoiceCode}`)
      } else {
        toast.error(data.error || 'Gagal membuat donasi')
      }
    } catch (error) {
      console.error('[Yilzi] Donation error:', error)
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
            src="/images/donation-banner.webp"
            alt="Donation Banner"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <Reveal direction="up" duration={0.8}>
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Berbagi Kebaikan untuk Sesama
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Setiap donasi Anda memberikan dampak nyata. Mari bersama membangun masa depan yang lebih
            baik.
          </p>
          </div>
        </Reveal>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" delay={100}>
            <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-primary" />
              <div className="text-3xl font-bold">3,245+</div>
              <div className="text-sm text-muted-foreground">Total Donatur</div>
            </div>
            <div className="text-center">
              <TrendingUp className="mx-auto mb-3 h-10 w-10 text-accent" />
              <div className="text-3xl font-bold">Rp 125 Juta</div>
              <div className="text-sm text-muted-foreground">Terkumpul</div>
            </div>
            <div className="text-center">
              <Award className="mx-auto mb-3 h-10 w-10 text-success" />
              <div className="text-3xl font-bold">98.7%</div>
              <div className="text-sm text-muted-foreground">Kepuasan Donatur</div>
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
                    <CardTitle className="text-2xl">Form Donasi</CardTitle>
                    <CardDescription>
                      Isi form berikut untuk melanjutkan donasi Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Amount Section */}
                      <div className="space-y-4">
                        <Label htmlFor="amount" className="text-base font-semibold">
                          Nominal Donasi (Min. Rp 1.000)
                        </Label>
                        <AmountSelector
                          value={amount}
                          onChange={setAmount}
                        />
                        {tierInfo && (
                          <div className="mt-4 rounded-lg bg-primary/10 p-4">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-5 w-5" style={{ color: tierInfo.color }} />
                              <div>
                                <div className="font-semibold" style={{ color: tierInfo.color }}>
                                  {(tierInfo as any).name || tierInfo.label} Tier
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {(tierInfo as any).description || `Donasi ${tierInfo.min.toLocaleString('id-ID')} - ${tierInfo.max === Infinity ? 'unlimited' : tierInfo.max.toLocaleString('id-ID')}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Donor Info */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="donorName">Nama Lengkap *</Label>
                          <Input
                            id="donorName"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            placeholder="Masukkan nama Anda"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="donorEmail">Email (Opsional)</Label>
                          <Input
                            id="donorEmail"
                            type="email"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Pesan/Doa (Opsional)</Label>
                          <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tulis pesan atau doa Anda..."
                            rows={4}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="anonymous"
                            checked={anonymous}
                            onCheckedChange={(checked) => setAnonymous(checked as boolean)}
                          />
                          <Label htmlFor="anonymous" className="cursor-pointer text-sm">
                            Donasi sebagai Anonim (nama tidak ditampilkan di leaderboard)
                          </Label>
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
                            <Heart className="mr-2 h-5 w-5" />
                            Lanjutkan Donasi
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
                {/* Impact Section */}
                <Card className="overflow-hidden shadow-lg hover-lift">
                <div className="relative h-48">
                  <Image
                    src="/images/donation-impact.webp"
                    alt="Donation Impact"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Dampak Donasi Anda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Transparansi Penuh</div>
                      <div className="text-sm text-muted-foreground">
                        Setiap donasi tercatat dan dapat ditrack secara real-time
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <Trophy className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold">Penghargaan Tier</div>
                      <div className="text-sm text-muted-foreground">
                        Dapatkan badge eksklusif sesuai total donasi Anda
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10">
                      <Users className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold">Komunitas Peduli</div>
                      <div className="text-sm text-muted-foreground">
                        Bergabung dengan ribuan donatur lainnya
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tier Information */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Tingkatan Donatur</CardTitle>
                  <CardDescription>
                    Raih tier lebih tinggi dengan total donasi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(DONATION_TIERS).map(([key, tier]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5" style={{ color: tier.color }} />
                        <div>
                          <div className="font-semibold" style={{ color: tier.color }}>
                            {(tier as any).name || tier.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(tier as any).description || `Donasi ${tier.min.toLocaleString('id-ID')} - ${tier.max === Infinity ? 'unlimited' : tier.max.toLocaleString('id-ID')}`}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{tier.min.toLocaleString('id-ID')}</Badge>
                    </div>
                  ))}
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
                                                                                                                        
