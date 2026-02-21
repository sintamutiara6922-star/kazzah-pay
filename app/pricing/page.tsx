import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { Check, Zap, Rocket, Building2 } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Gratis',
    description: 'Cocok untuk individu dan project kecil',
    icon: Zap,
    features: [
      'Hingga 100 transaksi/bulan',
      'Biaya transaksi 2.9% + Rp 2,000',
      'Dashboard basic analytics',
      'API access',
      'Email support',
      'Settlement 2 hari kerja',
    ],
    cta: 'Mulai Gratis',
    popular: false,
  },
  {
    name: 'Professional',
    price: 'Rp 299,000',
    period: '/bulan',
    description: 'Untuk bisnis yang sedang berkembang',
    icon: Rocket,
    features: [
      'Transaksi unlimited',
      'Biaya transaksi 2.5% + Rp 1,500',
      'Advanced analytics & reports',
      'API & Webhooks',
      'Priority support 24/7',
      'Settlement 1 hari kerja',
      'Custom branding',
      'Multi-user access',
    ],
    cta: 'Upgrade Sekarang',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Solusi lengkap untuk perusahaan besar',
    icon: Building2,
    features: [
      'Volume pricing khusus',
      'Biaya transaksi 2.0% + Rp 1,000',
      'Dedicated account manager',
      'Custom integration',
      'SLA 99.99% uptime',
      'Instant settlement',
      'White-label solution',
      'Advanced security features',
      'Training & onboarding',
    ],
    cta: 'Hubungi Sales',
    popular: false,
  },
]

const features = [
  {
    category: 'Metode Pembayaran',
    items: ['Bank Transfer', 'E-wallet (Dana, OVO, GoPay)', 'QRIS', 'Virtual Account', 'Credit Card'],
  },
  {
    category: 'Keamanan',
    items: ['PCI DSS Compliant', 'SSL Encryption', 'Fraud Detection', '2FA Authentication', 'Regular Security Audit'],
  },
  {
    category: 'Developer Tools',
    items: ['RESTful API', 'Webhooks', 'SDK Library', 'Sandbox Environment', 'Comprehensive Documentation'],
  },
  {
    category: 'Support',
    items: ['Email Support', 'Live Chat', 'Phone Support', 'Knowledge Base', 'Video Tutorials'],
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background px-4 py-20 sm:px-6 lg:px-8">
          <Reveal direction="up" duration={0.8}>
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4">Harga Transparan</Badge>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Pilih Paket yang Sesuai dengan Bisnis Anda
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                Tidak ada biaya tersembunyi. Tidak ada biaya bulanan untuk paket Starter. Mulai gratis dan upgrade kapan saja.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <Reveal key={plan.name} direction="up" delay={index * 100}>
                  <Card
                    className={`relative flex flex-col hover-lift ${
                      plan.popular
                        ? 'border-primary shadow-2xl ring-2 ring-primary/50'
                        : 'border-border'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-primary to-accent">
                          Paling Populer
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
                        <plan.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-6">
                        <div className="text-4xl font-bold">
                          {plan.price}
                          {plan.period && (
                            <span className="text-lg font-normal text-muted-foreground">
                              {plan.period}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col">
                      <ul className="space-y-3 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="h-5 w-5 shrink-0 text-primary" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`mt-8 w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-primary to-accent'
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="border-t bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Semua Paket Termasuk
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Fitur lengkap untuk mendukung bisnis Anda
                </p>
              </div>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Reveal key={feature.category} direction="up" delay={index * 100}>
                  <Card className="hover-lift">
                    <CardHeader>
                      <CardTitle className="text-lg">{feature.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-gradient-to-br from-primary to-accent px-4 py-20 text-white sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Masih Bingung Pilih Paket?
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Tim kami siap membantu Anda memilih paket yang paling sesuai dengan kebutuhan bisnis.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary">
                  Jadwalkan Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Hubungi Sales
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  )
        }
