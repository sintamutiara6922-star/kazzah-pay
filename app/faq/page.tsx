import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { siteConfig } from '@/lib/config'

export const metadata = {
  title: 'FAQ - Pertanyaan yang Sering Diajukan',
  description: 'Temukan jawaban untuk pertanyaan umum tentang ' + siteConfig.name,
}

const faqs = [
  {
    category: 'Pembayaran',
    items: [
      {
        question: 'Metode pembayaran apa saja yang didukung?',
        answer: 'Kami mendukung berbagai metode pembayaran termasuk QRIS, e-wallet (DANA, OVO, GoPay, ShopeePay), Virtual Account (BCA, Mandiri, BNI, BRI), dan transfer bank.',
      },
      {
        question: 'Berapa lama proses verifikasi pembayaran?',
        answer: 'Pembayaran via QRIS dan e-wallet diverifikasi secara instant (< 1 menit). Virtual Account dan transfer bank biasanya terverifikasi dalam 5-15 menit, maksimal 24 jam.',
      },
      {
        question: 'Apakah ada biaya transaksi?',
        answer: 'Biaya transaksi bervariasi tergantung metode pembayaran. QRIS dikenakan biaya 0.7%, e-wallet Rp 1.500, Virtual Account Rp 2.750. Detail biaya ditampilkan sebelum konfirmasi pembayaran.',
      },
      {
        question: 'Bagaimana jika pembayaran gagal?',
        answer: 'Jika pembayaran gagal, dana akan otomatis dikembalikan ke sumber pembayaran dalam 1-7 hari kerja tergantung metode pembayaran yang digunakan.',
      },
    ],
  },
  {
    category: 'Donasi',
    items: [
      {
        question: 'Apakah saya bisa donasi secara anonim?',
        answer: 'Ya, Anda dapat memilih opsi "Donasi Anonim" saat melakukan donasi. Nama Anda tidak akan ditampilkan di leaderboard atau aktivitas publik.',
      },
      {
        question: 'Apa itu tier donasi?',
        answer: 'Tier donasi adalah penghargaan berdasarkan jumlah donasi: Bronze (Rp 10k-50k), Silver (Rp 50k-100k), Gold (Rp 100k-500k), Platinum (Rp 500k-1M), Diamond (>Rp 1M).',
      },
      {
        question: 'Bagaimana cara masuk leaderboard?',
        answer: 'Donasi non-anonim otomatis masuk leaderboard setelah pembayaran berhasil. Ranking ditentukan berdasarkan total donasi dalam periode tertentu.',
      },
    ],
  },
  {
    category: 'Keamanan',
    items: [
      {
        question: 'Apakah data saya aman?',
        answer: 'Ya, kami menggunakan enkripsi SSL/TLS untuk semua transaksi. Data pembayaran tidak disimpan di server kami dan langsung diproses oleh payment gateway yang tersertifikasi PCI-DSS.',
      },
      {
        question: 'Bagaimana dengan privasi data saya?',
        answer: 'Kami sangat menjaga privasi data Anda sesuai dengan kebijakan privasi kami. Data hanya digunakan untuk keperluan transaksi dan tidak dibagikan kepada pihak ketiga tanpa persetujuan.',
      },
    ],
  },
  {
    category: 'Teknis',
    items: [
      {
        question: 'Apakah ada API untuk integrasi?',
        answer: 'Ya, kami menyediakan REST API lengkap untuk integrasi dengan sistem Anda. Dokumentasi lengkap tersedia di halaman API Docs.',
      },
      {
        question: 'Apa itu webhook?',
        answer: 'Webhook adalah notifikasi otomatis yang dikirim ke server Anda saat status pembayaran berubah. Ini memungkinkan sistem Anda merespons pembayaran secara real-time.',
      },
      {
        question: 'Bagaimana cara mendapatkan API key?',
        answer: 'Silakan hubungi kami melalui halaman Contact untuk mendapatkan akses API. Kami akan memberikan API key dan dokumentasi lengkap.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Temukan jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>

          <div className="mt-12 space-y-8">
            {faqs.map((category) => (
              <Card key={category.category} className="p-6">
                <h2 className="mb-4 text-xl font-semibold">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-muted/30 p-8 text-center">
            <h2 className="text-2xl font-semibold">Tidak menemukan jawaban?</h2>
            <p className="mt-2 text-muted-foreground">
              Tim support kami siap membantu Anda
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                WhatsApp Support
              </a>
              <span className="text-muted-foreground">·</span>
              <a
                href={siteConfig.social.email}
                className="text-primary hover:underline"
              >
                Email Support
              </a>
              <span className="text-muted-foreground">·</span>
              <a
                href={`https://t.me/${siteConfig.social.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Telegram
              </a>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
