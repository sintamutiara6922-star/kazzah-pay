import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - Syarat & Ketentuan',
  description: 'Syarat dan ketentuan penggunaan layanan PaymentHub',
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/5 to-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-primary" />
            <Badge className="mb-4">Legal</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Syarat & Ketentuan</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Terakhir diperbarui: 15 Februari 2025
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardContent className="prose prose-gray max-w-none p-8 dark:prose-invert">
                <h2>1. Penerimaan Syarat</h2>
                <p>
                  Dengan mengakses dan menggunakan layanan PaymentHub, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami.
                </p>

                <h2>2. Definisi</h2>
                <ul>
                  <li><strong>Layanan:</strong> Platform payment gateway PaymentHub dan semua fitur terkait</li>
                  <li><strong>Pengguna:</strong> Individu atau entitas yang menggunakan layanan kami</li>
                  <li><strong>Merchant:</strong> Pengguna yang menerima pembayaran melalui platform kami</li>
                  <li><strong>Transaksi:</strong> Setiap pembayaran atau transfer yang diproses melalui platform</li>
                </ul>

                <h2>3. Pendaftaran Akun</h2>
                <p>Untuk menggunakan layanan kami, Anda harus:</p>
                <ul>
                  <li>Berusia minimal 18 tahun atau usia dewasa di yurisdiksi Anda</li>
                  <li>Memberikan informasi yang akurat dan lengkap</li>
                  <li>Menjaga kerahasiaan kredensial akun Anda</li>
                  <li>Bertanggung jawab atas semua aktivitas di akun Anda</li>
                  <li>Segera memberitahu kami jika ada penggunaan tidak sah</li>
                </ul>

                <h2>4. Penggunaan Layanan</h2>
                <p>Anda setuju untuk:</p>
                <ul>
                  <li>Menggunakan layanan hanya untuk tujuan yang sah dan legal</li>
                  <li>Tidak melanggar hak pihak ketiga</li>
                  <li>Tidak menggunakan layanan untuk penipuan atau aktivitas ilegal</li>
                  <li>Mematuhi semua hukum dan peraturan yang berlaku</li>
                  <li>Tidak mengganggu atau merusak integritas layanan</li>
                </ul>

                <h2>5. Biaya dan Pembayaran</h2>
                <p>Biaya layanan kami meliputi:</p>
                <ul>
                  <li>Biaya transaksi sesuai dengan paket yang dipilih</li>
                  <li>Biaya tambahan untuk fitur premium</li>
                  <li>Semua biaya sudah termasuk pajak yang berlaku</li>
                  <li>Biaya dapat berubah dengan pemberitahuan 30 hari sebelumnya</li>
                </ul>

                <h2>6. Settlement dan Pencairan Dana</h2>
                <p>Ketentuan pencairan dana:</p>
                <ul>
                  <li>Settlement dilakukan sesuai jadwal paket Anda</li>
                  <li>Dana akan ditransfer ke rekening bank terdaftar</li>
                  <li>Kami berhak menahan dana jika ada indikasi penipuan</li>
                  <li>Minimum pencairan dana: Rp 10,000</li>
                </ul>

                <h2>7. Refund dan Chargeback</h2>
                <p>Kebijakan refund:</p>
                <ul>
                  <li>Merchant bertanggung jawab atas kebijakan refund mereka sendiri</li>
                  <li>Kami memfasilitasi proses refund sesuai permintaan merchant</li>
                  <li>Biaya transaksi tidak dapat dikembalikan</li>
                  <li>Chargeback akan ditangani sesuai prosedur standar payment processor</li>
                </ul>

                <h2>8. Larangan Penggunaan</h2>
                <p>Anda dilarang menggunakan layanan kami untuk:</p>
                <ul>
                  <li>Produk atau layanan ilegal</li>
                  <li>Konten dewasa atau pornografi</li>
                  <li>Perjudian online (kecuali yang berlisensi)</li>
                  <li>Skema ponzi atau MLM ilegal</li>
                  <li>Obat-obatan terlarang</li>
                  <li>Senjata api atau bahan peledak</li>
                  <li>Pencucian uang atau pendanaan teroris</li>
                </ul>

                <h2>9. Keamanan</h2>
                <p>
                  Kami berkomitmen untuk menjaga keamanan platform, namun Anda juga bertanggung jawab untuk menjaga keamanan akun Anda. Kami tidak bertanggung jawab atas kerugian akibat kelalaian Anda.
                </p>

                <h2>10. Hak Kekayaan Intelektual</h2>
                <p>
                  Semua konten, merek dagang, dan hak kekayaan intelektual pada platform ini adalah milik PaymentHub. Anda tidak boleh menggunakan, menyalin, atau memodifikasi tanpa izin tertulis.
                </p>

                <h2>11. Pembatasan Tanggung Jawab</h2>
                <p>
                  PaymentHub tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan kami. Tanggung jawab kami terbatas pada jumlah biaya yang Anda bayarkan dalam 6 bulan terakhir.
                </p>

                <h2>12. Penangguhan dan Penghentian</h2>
                <p>Kami berhak untuk:</p>
                <ul>
                  <li>Menangguhkan akun Anda jika ada pelanggaran syarat</li>
                  <li>Menghentikan layanan dengan pemberitahuan 30 hari</li>
                  <li>Segera menutup akun jika ada aktivitas ilegal</li>
                </ul>

                <h2>13. Perubahan Syarat</h2>
                <p>
                  Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email atau notifikasi di platform.
                </p>

                <h2>14. Hukum yang Berlaku</h2>
                <p>
                  Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui Pengadilan Negeri Jakarta Selatan.
                </p>

                <h2>15. Kontak</h2>
                <p>Untuk pertanyaan tentang syarat dan ketentuan ini:</p>
                <ul>
                  <li>Email: legal@paymenthub.com</li>
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
