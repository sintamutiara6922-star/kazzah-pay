import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config'
import {
  BookOpen,
  CreditCard,
  HelpCircle,
  Shield,
  Code,
  MessageCircle,
  FileText,
  Users,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Help Center - Pusat Bantuan',
  description: 'Temukan panduan dan bantuan untuk menggunakan ' + siteConfig.name,
}

const helpTopics = [
  {
    icon: CreditCard,
    title: 'Panduan Pembayaran',
    description: 'Cara melakukan pembayaran dengan berbagai metode',
    articles: [
      'Cara membayar dengan QRIS',
      'Cara membayar dengan e-Wallet (DANA, OVO, GoPay)',
      'Cara membayar dengan Virtual Account',
      'Cara membayar dengan Transfer Bank',
      'Troubleshooting pembayaran gagal',
    ],
  },
  {
    icon: Users,
    title: 'Panduan Donasi',
    description: 'Cara melakukan donasi dan masuk leaderboard',
    articles: [
      'Cara melakukan donasi',
      'Apa itu tier donasi?',
      'Cara masuk leaderboard',
      'Donasi anonim vs publik',
      'Melihat riwayat donasi',
    ],
  },
  {
    icon: Code,
    title: 'Integrasi API',
    description: 'Dokumentasi untuk developer',
    articles: [
      'Getting Started dengan API',
      'Authentication & API Key',
      'Membuat transaksi via API',
      'Webhook integration',
      'Rate limiting & Best practices',
    ],
    link: '/docs',
  },
  {
    icon: Shield,
    title: 'Keamanan & Privasi',
    description: 'Informasi keamanan dan privasi data',
    articles: [
      'Bagaimana kami melindungi data Anda',
      'Kebijakan privasi',
      'Terms of Service',
      'Cookie policy',
      'Refund policy',
    ],
    link: '/legal/privacy',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Pertanyaan yang sering diajukan',
    articles: [
      'Berapa lama proses verifikasi?',
      'Apakah ada biaya transaksi?',
      'Bagaimana jika pembayaran gagal?',
      'Cara menghubungi customer support',
      'Dan banyak lagi...',
    ],
    link: '/faq',
  },
  {
    icon: FileText,
    title: 'Invoice & Riwayat',
    description: 'Kelola invoice dan riwayat transaksi',
    articles: [
      'Cara mengakses invoice',
      'Download invoice sebagai PDF',
      'Melihat status pembayaran',
      'Riwayat transaksi',
      'Export data transaksi',
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight">Pusat Bantuan</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Temukan panduan lengkap dan jawaban untuk semua pertanyaan Anda
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic) => (
              <Card key={topic.title} className="group transition-colors hover:border-primary/50">
                <CardHeader>
                  <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-3">
                    <topic.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {topic.articles.map((article, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{article}</span>
                      </li>
                    ))}
                  </ul>
                  {topic.link && (
                    <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
                      <Link href={topic.link}>Lihat Semua</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mt-12 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-4 text-2xl font-semibold">Butuh Bantuan Lebih Lanjut?</h2>
              <p className="mt-2 text-muted-foreground">
                Tim support kami siap membantu Anda 24/7
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp Support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={siteConfig.social.email}>
                    Email Support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link
                    href={`https://t.me/${siteConfig.social.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telegram
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Popular Articles */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold">Artikel Populer</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card className="cursor-pointer transition-colors hover:border-primary/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold">Cara Melakukan Pembayaran Pertama Anda</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Panduan lengkap untuk pengguna baru dalam melakukan pembayaran pertama
                  </p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer transition-colors hover:border-primary/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold">Integrasi API dalam 5 Menit</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tutorial cepat untuk developer yang ingin mengintegrasikan API
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
                        }
