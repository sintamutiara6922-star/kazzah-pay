import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw } from 'lucide-react'

export const metadata = {
  title: 'Refund Policy - Kebijakan Pengembalian Dana',
  description: 'Kebijakan pengembalian dana dan refund di PaymentHub',
}

export default function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/5 to-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <RefreshCw className="mx-auto mb-4 h-12 w-12 text-primary" />
            <Badge className="mb-4">Legal</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Kebijakan Pengembalian Dana</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Terakhir diperbarui: 15 Februari 2025
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardContent className="prose prose-gray max-w-none p-8 dark:prose-invert">
                <h2>1. Gambaran Umum</h2>
                <p>
                  Kebijakan pengembalian dana ini menjelaskan bagaimana PaymentHub menangani refund dan pengembalian dana untuk berbagai jenis transaksi. Kami berkomitmen untuk memberikan proses refund yang adil dan transparan.
                </p>

                <h2>2. Jenis Refund</h2>

                <h3>2.1 Refund untuk Pembayaran Produk/Layanan</h3>
                <p>
                  Untuk pembayaran produk atau layanan yang diproses melalui PaymentHub, kebijakan refund ditentukan oleh merchant yang menerima pembayaran, bukan oleh PaymentHub. Anda harus menghubungi merchant secara langsung untuk permintaan refund.
                </p>

                <h3>2.2 Refund Biaya Layanan PaymentHub</h3>
                <p>Biaya layanan PaymentHub dapat dikembalikan dalam kondisi berikut:</p>
                <ul>
                  <li>Kesalahan teknis dari sistem kami yang menyebabkan double charge</li>
                  <li>Transaksi yang gagal tetapi dana telah terpotong</li>
                  <li>Kesalahan pemrosesan dari pihak PaymentHub</li>
                </ul>
                <p><strong>Catatan:</strong> Biaya transaksi yang sudah diproses tidak dapat dikembalikan kecuali ada kesalahan dari sistem kami.</p>

                <h3>2.3 Refund Biaya Subscription</h3>
                <p>Untuk subscription plan (Professional/Enterprise):</p>
                <ul>
                  <li>Refund penuh jika dibatalkan dalam 7 hari pertama</li>
                  <li>Refund prorata untuk bulan berjalan setelah 7 hari</li>
                  <li>Tidak ada refund untuk bulan sebelumnya yang sudah digunakan</li>
                </ul>

                <h2>3. Proses Refund</h2>

                <h3>3.1 Cara Mengajukan Refund</h3>
                <p>Untuk mengajukan refund:</p>
                <ol>
                  <li>Login ke dashboard PaymentHub Anda</li>
                  <li>Buka halaman "Transactions" atau "Billing"</li>
                  <li>Temukan transaksi yang ingin di-refund</li>
                  <li>Klik "Request Refund" dan isi formulir</li>
                  <li>Atau hubungi support kami via email atau WhatsApp</li>
                </ol>

                <h3>3.2 Informasi yang Diperlukan</h3>
                <p>Saat mengajukan refund, sertakan:</p>
                <ul>
                  <li>Nomor transaksi atau invoice</li>
                  <li>Tanggal transaksi</li>
                  <li>Jumlah yang akan di-refund</li>
                  <li>Alasan refund dengan detail</li>
                  <li>Bukti pendukung (screenshot, email, dll)</li>
                </ul>

                <h3>3.3 Waktu Pemrosesan</h3>
                <p>Timeline pemrosesan refund:</p>
                <ul>
                  <li><strong>Review permintaan:</strong> 1-2 hari kerja</li>
                  <li><strong>Approval/rejection:</strong> 2-3 hari kerja</li>
                  <li><strong>Pemrosesan refund:</strong> 3-5 hari kerja</li>
                  <li><strong>Dana masuk ke rekening:</strong> 5-7 hari kerja (tergantung bank)</li>
                </ul>
                <p><strong>Total waktu:</strong> 14 hari kerja maksimal dari pengajuan hingga dana masuk.</p>

                <h2>4. Metode Pengembalian Dana</h2>

                <h3>4.1 Refund ke Sumber Pembayaran</h3>
                <p>Refund akan dikembalikan ke metode pembayaran original:</p>
                <ul>
                  <li><strong>Kartu Kredit/Debit:</strong> 5-7 hari kerja ke kartu yang sama</li>
                  <li><strong>Bank Transfer:</strong> 3-5 hari kerja ke rekening asal</li>
                  <li><strong>E-wallet:</strong> 1-3 hari kerja ke akun e-wallet</li>
                  <li><strong>Virtual Account:</strong> 3-5 hari kerja ke rekening terdaftar</li>
                </ul>

                <h3>4.2 Refund ke Rekening Alternatif</h3>
                <p>
                  Jika sumber pembayaran tidak lagi valid, Anda dapat meminta refund ke rekening alternatif dengan verifikasi tambahan (KTP, bukti kepemilikan rekening).
                </p>

                <h2>5. Kondisi yang Tidak Dapat Di-Refund</h2>
                <p>Refund tidak akan diproses jika:</p>
                <ul>
                  <li>Permintaan refund diajukan lebih dari 60 hari setelah transaksi</li>
                  <li>Transaksi sudah di-refund sebelumnya</li>
                  <li>Transaksi terbukti fraudulent atau melanggar TOS</li>
                  <li>Merchant menolak refund dan keputusan final telah dibuat</li>
                  <li>Biaya transaksi untuk transaksi yang sudah berhasil</li>
                </ul>

                <h2>6. Partial Refund</h2>
                <p>
                  Untuk beberapa kasus, partial refund (refund sebagian) dapat dilakukan. Misalnya, jika hanya sebagian produk yang dikembalikan atau ada kesepakatan khusus dengan merchant.
                </p>

                <h2>7. Chargeback</h2>
                <p>
                  Chargeback adalah proses dimana pelanggan menghubungi bank mereka langsung untuk membatalkan transaksi. 
                </p>
                <ul>
                  <li>Chargeback harus melalui proses yang berbeda dari refund normal</li>
                  <li>Biaya chargeback (Rp 150,000) akan dikenakan ke merchant</li>
                  <li>Kami akan memfasilitasi proses dispute resolution</li>
                  <li>Keputusan final ditentukan oleh bank issuer</li>
                </ul>
                <p><strong>Catatan:</strong> Lebih baik mengajukan refund normal terlebih dahulu sebelum melakukan chargeback.</p>

                <h2>8. Refund untuk Donasi</h2>
                <p>
                  Untuk transaksi donasi, refund hanya dapat dilakukan dalam kondisi khusus:
                </p>
                <ul>
                  <li>Kesalahan teknis dari sistem</li>
                  <li>Double charge yang tidak disengaja</li>
                  <li>Permintaan dalam 24 jam setelah transaksi</li>
                </ul>
                <p>Donasi yang sudah dikirimkan ke penerima tidak dapat di-refund.</p>

                <h2>9. Biaya Refund</h2>
                <p>Ketentuan biaya refund:</p>
                <ul>
                  <li>Tidak ada biaya untuk refund karena kesalahan sistem kami</li>
                  <li>Biaya transfer bank untuk refund ditanggung oleh penerima refund</li>
                  <li>Biaya transaksi original tidak dikembalikan</li>
                  <li>Untuk chargeback, merchant dikenakan biaya Rp 150,000</li>
                </ul>

                <h2>10. Dispute Resolution</h2>
                <p>
                  Jika Anda tidak setuju dengan keputusan refund:
                </p>
                <ol>
                  <li>Hubungi support kami dengan informasi lengkap</li>
                  <li>Ajukan formal dispute dalam 14 hari</li>
                  <li>Kami akan melakukan review ulang</li>
                  <li>Keputusan final akan diberikan dalam 7 hari kerja</li>
                </ol>

                <h2>11. Perlindungan Pembeli</h2>
                <p>
                  PaymentHub bekerja sama dengan payment processor yang menyediakan buyer protection:
                </p>
                <ul>
                  <li>Perlindungan untuk transaksi yang tidak diterima</li>
                  <li>Perlindungan untuk produk yang tidak sesuai deskripsi</li>
                  <li>Mediasi antara pembeli dan merchant</li>
                </ul>

                <h2>12. Hubungi Kami</h2>
                <p>Untuk pertanyaan atau permintaan refund:</p>
                <ul>
                  <li>Email: refund@paymenthub.com</li>
                  <li>WhatsApp: +62 21 1234 5678</li>
                  <li>Live Chat: Tersedia di dashboard</li>
                  <li>Jam Kerja: Senin-Jumat 09:00-17:00 WIB</li>
                </ul>

                <h2>13. Pembaruan Kebijakan</h2>
                <p>
                  Kami berhak memperbarui kebijakan refund ini. Perubahan akan berlaku setelah diposting di halaman ini. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
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
