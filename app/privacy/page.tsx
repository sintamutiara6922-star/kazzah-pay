import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - Kebijakan Privasi',
  description: 'Kebijakan privasi PaymentHub mengenai pengumpulan, penggunaan, dan perlindungan data pribadi Anda',
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/5 to-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
            <Badge className="mb-4">Legal</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Kebijakan Privasi</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Terakhir diperbarui: 15 Februari 2025
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardContent className="prose prose-gray max-w-none p-8 dark:prose-invert">
                <h2>1. Informasi yang Kami Kumpulkan</h2>
                <p>
                  PaymentHub mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat menggunakan layanan kami, termasuk:
                </p>
                <ul>
                  <li>Informasi akun: nama, alamat email, nomor telepon</li>
                  <li>Informasi transaksi: detail pembayaran, metode pembayaran, riwayat transaksi</li>
                  <li>Informasi bisnis: nama perusahaan, alamat, informasi pajak</li>
                  <li>Informasi teknis: alamat IP, browser, perangkat, log aktivitas</li>
                </ul>

                <h2>2. Penggunaan Informasi</h2>
                <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
                <ul>
                  <li>Memproses transaksi dan pembayaran Anda</li>
                  <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
                  <li>Mengirim pemberitahuan, pembaruan, dan informasi keamanan</li>
                  <li>Mencegah penipuan dan aktivitas ilegal</li>
                  <li>Memenuhi kewajiban hukum dan peraturan</li>
                  <li>Menganalisis penggunaan layanan untuk peningkatan</li>
                </ul>

                <h2>3. Keamanan Data</h2>
                <p>
                  Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi informasi pribadi Anda:
                </p>
                <ul>
                  <li>Enkripsi SSL/TLS untuk semua transmisi data</li>
                  <li>PCI DSS Level 1 compliance untuk data kartu kredit</li>
                  <li>Firewall dan sistem deteksi intrusi</li>
                  <li>Akses terbatas ke data pribadi</li>
                  <li>Audit keamanan berkala</li>
                </ul>

                <h2>4. Berbagi Informasi</h2>
                <p>Kami tidak menjual informasi pribadi Anda. Kami hanya membagikan informasi Anda dengan:</p>
                <ul>
                  <li>Penyedia layanan pihak ketiga yang membantu operasional kami</li>
                  <li>Payment processor dan bank untuk memproses transaksi</li>
                  <li>Pihak berwenang jika diwajibkan oleh hukum</li>
                  <li>Pihak lain dengan persetujuan eksplisit Anda</li>
                </ul>

                <h2>5. Cookies dan Teknologi Pelacakan</h2>
                <p>
                  Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman Anda. Anda dapat mengatur preferensi cookies melalui pengaturan browser Anda.
                </p>

                <h2>6. Hak Anda</h2>
                <p>Anda memiliki hak untuk:</p>
                <ul>
                  <li>Mengakses dan mendapatkan salinan data pribadi Anda</li>
                  <li>Memperbaiki data yang tidak akurat</li>
                  <li>Menghapus data pribadi Anda (dengan pengecualian tertentu)</li>
                  <li>Menolak atau membatasi pemrosesan data</li>
                  <li>Portabilitas data</li>
                  <li>Menarik persetujuan kapan saja</li>
                </ul>

                <h2>7. Penyimpanan Data</h2>
                <p>
                  Kami menyimpan informasi pribadi Anda selama diperlukan untuk tujuan yang dijelaskan dalam kebijakan ini, atau sesuai dengan kewajiban hukum kami (minimal 5 tahun untuk data transaksi).
                </p>

                <h2>8. Transfer Internasional</h2>
                <p>
                  Data Anda dapat ditransfer dan diproses di server yang berlokasi di luar negara Anda. Kami memastikan perlindungan yang memadai sesuai dengan standar internasional.
                </p>

                <h2>9. Privasi Anak-anak</h2>
                <p>
                  Layanan kami tidak ditujukan untuk anak-anak di bawah 18 tahun. Kami tidak dengan sengaja mengumpulkan informasi dari anak-anak.
                </p>

                <h2>10. Perubahan Kebijakan</h2>
                <p>
                  Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email atau notifikasi di platform kami.
                </p>

                <h2>11. Hubungi Kami</h2>
                <p>
                  Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak Anda, silakan hubungi kami:
                </p>
                <ul>
                  <li>Email: privacy@paymenthub.com</li>
                  <li>WhatsApp: +62 21 1234 5678</li>
                  <li>Alamat: SCBD Lot 28, Jakarta Selatan 12190</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
