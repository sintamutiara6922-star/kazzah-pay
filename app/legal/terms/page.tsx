import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { siteConfig } from '@/lib/config'

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-neutral mx-auto max-w-4xl dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="lead">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
          </p>

          <p>
            Selamat datang di {siteConfig.business.name}. Dengan mengakses dan menggunakan layanan
            kami, Anda menyetujui syarat dan ketentuan berikut.
          </p>

          <h2>1. Penerimaan Syarat</h2>
          <p>
            Dengan menggunakan platform {siteConfig.business.name}, Anda menyetujui untuk terikat
            oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju, harap jangan gunakan layanan
            kami.
          </p>

          <h2>2. Layanan</h2>
          <p>{siteConfig.business.name} menyediakan layanan payment gateway yang memungkinkan:</p>
          <ul>
            <li>Penerimaan pembayaran melalui berbagai metode (QRIS, e-wallet, VA, transfer bank)</li>
            <li>Pengelolaan donasi online</li>
            <li>Dokumentasi API untuk integrasi</li>
            <li>Dashboard monitoring transaksi</li>
          </ul>

          <h2>3. Penggunaan Layanan</h2>
          <p>Anda setuju untuk:</p>
          <ul>
            <li>Memberikan informasi yang akurat dan lengkap</li>
            <li>Menjaga kerahasiaan akun Anda</li>
            <li>Tidak menggunakan layanan untuk aktivitas ilegal</li>
            <li>Mematuhi semua hukum dan regulasi yang berlaku</li>
          </ul>

          <h2>4. Biaya dan Pembayaran</h2>
          <p>
            Setiap transaksi dikenakan biaya sesuai dengan metode pembayaran yang dipilih. Biaya
            akan ditampilkan sebelum Anda menyelesaikan transaksi.
          </p>

          <h2>5. Keamanan</h2>
          <p>
            Kami mengimplementasikan langkah-langkah keamanan untuk melindungi transaksi dan data
            Anda. Namun, Anda juga bertanggung jawab untuk menjaga keamanan akun dan informasi
            pribadi Anda.
          </p>

          <h2>6. Pembatalan dan Pengembalian Dana</h2>
          <p>
            Kebijakan pembatalan dan pengembalian dana tergantung pada jenis transaksi. Silakan
            lihat halaman Refund Policy untuk informasi lebih lanjut.
          </p>

          <h2>7. Batasan Tanggung Jawab</h2>
          <p>
            {siteConfig.business.name} tidak bertanggung jawab atas kerugian tidak langsung,
            insidental, atau konsekuensial yang timbul dari penggunaan layanan kami.
          </p>

          <h2>8. Perubahan Layanan</h2>
          <p>
            Kami berhak untuk memodifikasi atau menghentikan layanan (atau bagian dari layanan)
            kapan saja dengan atau tanpa pemberitahuan.
          </p>

          <h2>9. Hukum yang Berlaku</h2>
          <p>
            Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik
            Indonesia.
          </p>

          <h2>10. Hubungi Kami</h2>
          <p>Untuk pertanyaan tentang Syarat dan Ketentuan, hubungi:</p>
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
          </ul>
        </article>
      </main>

      <Footer />
    </div>
  )
}
