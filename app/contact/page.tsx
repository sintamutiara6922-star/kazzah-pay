import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config'
import { Mail, Phone, MessageCircle, Send, Github } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Us - Hubungi Kami',
  description: 'Hubungi tim support ' + siteConfig.name + ' untuk bantuan dan pertanyaan',
}

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Chat langsung dengan tim support kami',
    value: siteConfig.owner.whatsapp,
    link: siteConfig.social.whatsapp,
    action: 'Chat di WhatsApp',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Kirim email untuk pertanyaan detail',
    value: siteConfig.owner.email,
    link: siteConfig.social.email,
    action: 'Kirim Email',
  },
  {
    icon: Send,
    title: 'Telegram',
    description: 'Hubungi kami via Telegram',
    value: siteConfig.social.telegram,
    link: `https://t.me/${siteConfig.social.telegram.replace('@', '')}`,
    action: 'Open Telegram',
  },
  {
    icon: Phone,
    title: 'Telepon',
    description: 'Hubungi kami via telepon',
    value: `+${siteConfig.owner.phone}`,
    link: `tel:+${siteConfig.owner.phone}`,
    action: 'Telepon Sekarang',
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Image
              src="/images/paymenthub-logo.webp"
              alt="PaymentHub Logo"
              width={100}
              height={100}
              className="mx-auto mb-6"
              priority
            />
            <h1 className="text-4xl font-bold tracking-tight">Hubungi Kami</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Ada pertanyaan atau butuh bantuan? Tim kami siap membantu Anda
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {contactMethods.map((method) => (
              <Card key={method.title} className="group transition-colors hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{method.title}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <p className="font-mono text-sm">{method.value}</p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href={method.link} target="_blank" rel="noopener noreferrer">
                          {method.action}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Informasi Bisnis</h2>
              <div className="mt-6 space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Nama Bisnis:</strong> {siteConfig.businessName}
                </p>
                <p>
                  <strong className="text-foreground">Owner:</strong> {siteConfig.owner.name}
                </p>
                <p>
                  <strong className="text-foreground">Domain:</strong> {siteConfig.domain}
                </p>
                <p>
                  <strong className="text-foreground">Email:</strong> {siteConfig.owner.email}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link
                    href={`https://github.com/${siteConfig.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link
                    href={`https://tiktok.com/@${siteConfig.social.tiktok}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TikTok @{siteConfig.social.tiktok}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold">Jam Operasional</h3>
            <p className="mt-2 text-muted-foreground">
              Senin - Jumat: 09:00 - 17:00 WIB
              <br />
              Sabtu: 09:00 - 15:00 WIB
              <br />
              Minggu & Tanggal Merah: Libur
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              * Untuk pertanyaan mendesak di luar jam operasional, silakan hubungi via WhatsApp
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
                                }
