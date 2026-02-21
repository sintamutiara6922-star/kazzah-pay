import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { siteConfig } from '@/lib/config'

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-neutral mx-auto max-w-4xl dark:prose-invert">
          <h1>Refund Policy</h1>
          <p className="lead">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
          </p>

          <p>
            Kebijakan Pengembalian Dana ini menjelaskan kondisi dan prosedur untuk meminta
            pengembalian dana di {siteConfig.business.name}.
          </p>

          <h2>1. Kebijakan Umum</h2>
          <p>
            Kami berusaha untuk memberikan layanan terbaik. Namun, kami memahami bahwa terkadang
            Anda mungkin perlu meminta pengembalian dana.
          </p>

          <h2>2. Donasi</h2>
          <p>
            <strong>Penting:</strong> Donasi pada umumnya bersifat final dan tidak dapat dikembalikan,
            kecuali dalam kondisi berikut:
          </p>
          <ul>
            <li>Terjadi kesalahan teknis yang menyebabkan duplikasi transaksi</li>
            <li>Jumlah yang didonasikan salah karena error sistem</li>
            <li>Donasi dilakukan tanpa persetujuan pemilik akun (fraud)</li>
          </ul>
          <p>
            Permintaan pengembalian dana untuk donasi harus diajukan dalam waktu 7 hari sejak
            transaksi dengan bukti yang memadai.
          </p>

          <h2>3. Pembayaran</h2>
          <p>Pengembalian dana untuk pembayaran dapat dilakukan jika:</p>
          <ul>
            <li>Layanan atau produk tidak diterima sesuai yang dijanjikan</li>
            <li>Terjadi kesalahan dalam jumlah pembayaran</li>
            <li>Duplikasi pembayaran yang tidak disengaja</li>
            <li>Pembayaran dilakukan tanpa otorisasi yang sah</li>
          </ul>

          <h2>4. Waktu Pemrosesan</h2>
          <p>Setelah permintaan pengembalian dana disetujui:</p>
          <ul>
            <li><strong>E-wallet & QRIS:</strong> 1-3 hari kerja</li>
            <li><strong>Virtual Account:</strong> 3-5 hari kerja</li>
            <li><strong>Transfer Bank:</strong> 5-7 hari kerja</li>
          </ul>

          <h2>5. Biaya Pengembalian Dana</h2>
          <p>
            Biaya administrasi dan biaya transaksi yang telah dikenakan pada saat pembayaran tidak
            dapat dikembalikan, kecuali kesalahan terjadi dari pihak kami.
          </p>

          <h2>6. Cara Mengajukan Pengembalian Dana</h2>
          <p>Untuk mengajukan pengembalian dana:</p>
          <ol>
            <li>Kirim email ke {siteConfig.contact.email} dengan subject "Refund Request"</li>
            <li>Sertakan informasi berikut:
              <ul>
                <li>Nomor transaksi/invoice</li>
                <li>Tanggal dan jumlah transaksi</li>
                <li>Alasan permintaan pengembalian dana</li>
                <li>Bukti pendukung (screenshot, dll)</li>
              </ul>
            </li>
            <li>Tim kami akan meninjau permintaan Anda dalam 2-3 hari kerja</li>
            <li>Anda akan menerima notifikasi via email tentang status permintaan</li>
          </ol>

          <h2>7. Kondisi Khusus</h2>
          <p>Pengembalian dana tidak dapat dilakukan jika:</p>
          <ul>
            <li>Permintaan diajukan lebih dari 30 hari setelah transaksi</li>
            <li>Tidak ada bukti yang memadai untuk mendukung klaim</li>
            <li>Pelanggaran terhadap Syarat dan Ketentuan kami</li>
          </ul>

          <h2>8. Metode Pengembalian Dana</h2>
          <p>
            Pengembalian dana akan diproses ke metode pembayaran yang sama dengan yang digunakan
            saat transaksi, kecuali ditentukan lain.
          </p>

          <h2>9. Hubungi Kami</h2>
          <p>Untuk pertanyaan atau bantuan terkait pengembalian dana:</p>
          <ul>
            <li>
              Email: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            </li>
            <li>
              WhatsApp:{' '}
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                +{siteConfig.contact.whatsapp}
              </a>
            </li>
            <li>
              Telegram:{' '}
              <a
                href={`https://t.me/${siteConfig.social.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.social.telegram}
              </a>
            </li>
          </ul>
        </article>
      </main>

      <Footer />
    </div>
  )
}
