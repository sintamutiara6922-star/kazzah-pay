'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import {
  MessageCircle,
  Mail,
  Phone,
  Book,
  FileText,
  Video,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

const supportChannels = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat langsung dengan tim support kami',
    availability: '24/7',
    responseTime: '< 2 menit',
    action: 'Mulai Chat',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Kirim pertanyaan detail via email',
    availability: '24/7',
    responseTime: '< 4 jam',
    action: 'Kirim Email',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Hubungi hotline kami langsung',
    availability: 'Sen-Jum 09:00-17:00',
    responseTime: 'Instant',
    action: 'Hubungi Sekarang',
    color: 'from-orange-500 to-red-500',
  },
]

const resources = [
  {
    icon: Book,
    title: 'Knowledge Base',
    description: 'Artikel dan panduan lengkap',
    count: '200+ artikel',
    link: '/help',
  },
  {
    icon: FileText,
    title: 'API Documentation',
    description: 'Dokumentasi teknis lengkap',
    count: 'Comprehensive docs',
    link: '/docs',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Tutorial step-by-step',
    count: '50+ videos',
    link: '#',
  },
]

const faqs = [
  {
    question: 'Bagaimana cara memulai menggunakan PaymentHub?',
    answer: 'Daftar akun gratis, verifikasi email, integrasikan API, dan mulai terima pembayaran.',
  },
  {
    question: 'Apakah ada biaya bulanan?',
    answer: 'Paket Starter gratis tanpa biaya bulanan. Anda hanya membayar biaya transaksi. Upgrade ke Professional untuk fitur lebih lengkap.',
  },
  {
    question: 'Berapa lama waktu settlement?',
    answer: 'Starter: 2 hari kerja, Professional: 1 hari kerja, Enterprise: instant settlement.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Ya, kami menggunakan enkripsi SSL, PCI DSS compliant, dan audit keamanan berkala.',
  },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleContact = (channel: string) => {
    toast.success(`Opening ${channel}...`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background px-4 py-20 sm:px-6 lg:px-8">
          <Reveal direction="up" duration={0.8}>
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4">Kami Siap Membantu</Badge>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Pusat Bantuan PaymentHub
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                Tim support profesional kami siap membantu Anda 24/7. Pilih channel yang paling nyaman untuk Anda.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Support Channels */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Hubungi Kami
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Pilih cara terbaik untuk mendapatkan bantuan
                </p>
              </div>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-3">
              {supportChannels.map((channel, index) => (
                <Reveal key={channel.title} direction="up" delay={index * 100}>
                  <Card className="relative overflow-hidden hover-lift">
                    <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-5`} />
                    <CardHeader>
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${channel.color}`}>
                        <channel.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>{channel.title}</CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{channel.availability}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Response time: {channel.responseTime}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleContact(channel.title)}
                      >
                        {channel.action}
                      </Button>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="border-t bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Sumber Daya
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Pelajari lebih lanjut dengan resource kami
                </p>
              </div>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-3">
              {resources.map((resource, index) => (
                <Reveal key={resource.title} direction="up" delay={index * 100}>
                  <Card className="group cursor-pointer hover-lift">
                    <CardHeader>
                      <resource.icon className="mb-4 h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {resource.count}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={resource.link}>Lihat →</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Reveal direction="up">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Pertanyaan Umum
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Jawaban untuk pertanyaan yang sering diajukan
                </p>
              </div>
            </Reveal>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Reveal key={index} direction="up" delay={index * 50}>
                  <Card
                    className="cursor-pointer hover-lift"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    {openFaq === index && (
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    )}
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
                Tidak Menemukan yang Anda Cari?
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Tim expert kami siap membantu dengan pertanyaan spesifik Anda.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary">
                  Contact Support
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Call
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
                    
