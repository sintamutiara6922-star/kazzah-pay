import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/lib/config'
import { CheckCircle2, Zap, Shield, Heart } from 'lucide-react'

export const metadata = {
  title: 'Tentang Kami - About ' + siteConfig.name,
  description: 'Pelajari lebih lanjut tentang ' + siteConfig.name + ' dan misi kami',
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-background to-muted/20 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Image
              src="/images/paymenthub-wordmark.webp"
              alt="PaymentHub"
              width={280}
              height={70}
              className="mx-auto mb-8"
              priority
            />
            <Badge variant="outline" className="mb-4">
              Tentang Kami
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Platform Payment Gateway
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Modern untuk Indonesia
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {siteConfig.name} adalah platform payment gateway yang memudahkan bisnis dan individu untuk menerima pembayaran digital dengan berbagai metode di Indonesia.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="border-b px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardContent className="p-8">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Misi Kami</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    Memberikan solusi pembayaran digital yang mudah, aman, dan terjangkau untuk semua kalangan. Kami percaya bahwa setiap bisnis, besar atau kecil, berhak mendapatkan akses ke teknologi payment gateway modern.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold">Visi Kami</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    Menjadi platform payment gateway pilihan utama di Indonesia dengan terus berinovasi dan menghadirkan fitur-fitur terbaik yang membantu pertumbuhan bisnis Anda.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="border-b bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold">Kenapa Memilih {siteConfig.name}?</h2>
            <div className="mt-12 space-y-6">
              {whyChooseUs.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Owner Info */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 text-center">
                <Shield className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 text-2xl font-bold">{siteConfig.businessName}</h2>
                <p className="mt-2 text-muted-foreground">
                  Dikelola oleh {siteConfig.owner.name}
                </p>
                <div className="mt-6 space-y-2 text-sm">
                  <p>Email: {siteConfig.owner.email}</p>
                  <p>WhatsApp: +{siteConfig.owner.whatsapp}</p>
                  <p>Domain: {siteConfig.domain}</p>
                </div>
                <p className="mt-6 text-muted-foreground">
                  Kami berkomitmen untuk memberikan layanan terbaik dan terus berinovasi untuk memenuhi kebutuhan pembayaran digital Anda.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

const whyChooseUs = [
  {
    title: 'Mudah Digunakan',
    description: 'Interface yang intuitif dan mudah dipahami, bahkan untuk pemula sekalipun.',
  },
  {
    title: 'Multi Payment Method',
    description: 'Dukung berbagai metode pembayaran populer di Indonesia: QRIS, e-wallet, Virtual Account, dan bank transfer.',
  },
  {
    title: 'Verifikasi Real-time',
    description: 'Pembayaran diverifikasi secara otomatis dan real-time untuk pengalaman yang seamless.',
  },
  {
    title: 'Keamanan Terjamin',
    description: 'Kami menggunakan enkripsi dan standar keamanan tertinggi untuk melindungi data Anda.',
  },
  {
    title: 'Biaya Transparan',
    description: 'Tanpa biaya tersembunyi. Semua biaya ditampilkan dengan jelas sebelum transaksi.',
  },
  {
    title: 'API Documentation',
    description: 'Dokumentasi API lengkap untuk integrasi yang mudah dengan sistem Anda.',
  },
  {
    title: 'Support Responsif',
    description: 'Tim support kami siap membantu Anda via WhatsApp, Email, dan Telegram.',
  },
  {
    title: 'Dashboard Analytics',
    description: 'Monitor semua transaksi dengan dashboard analytics yang informatif.',
  },
]
        
