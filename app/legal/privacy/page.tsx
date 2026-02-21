import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { siteConfig } from '@/lib/config'

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-neutral mx-auto max-w-4xl dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="lead">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
          </p>

          <p>
            {siteConfig.business.name} ("kami", "milik kami") berkomitmen untuk melindungi privasi
            Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
            melindungi informasi pribadi Anda.
          </p>

          <h2>1. Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan informasi berikut:</p>
          <ul>
            <li>
              <strong>Informasi Pribadi:</strong> Nama, email, nomor telepon yang Anda berikan saat
              melakukan pembayaran atau donasi
            </li>
            <li>
              <strong>Informasi Transaksi:</strong> Detail pembayaran, jumlah, metode pembayaran,
              dan status transaksi
            </li>
            <li>
              <strong>Informasi Teknis:</strong> Alamat IP, jenis browser, dan informasi perangkat
            </li>
          </ul>

          <h2>2. Penggunaan Informasi</h2>
          <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
          <ul>
            <li>Memproses transaksi pembayaran dan donasi</li>
            <li>Mengirim konfirmasi dan notifikasi transaksi</li>
            <li>Meningkatkan layanan dan pengalaman pengguna</li>
            <li>Mencegah penipuan dan kegiatan ilegal</li>
            <li>Mematuhi kewajiban hukum</li>
          </ul>

          <h2>3. Keamanan Data</h2>
          <p>
            Kami mengimplementasikan langkah-langkah keamanan teknis dan organisasi yang sesuai
            untuk melindungi data pribadi Anda dari akses tidak sah, kehilangan, atau penyalahgunaan.
          </p>

          <h2>4. Berbagi Informasi</h2>
          <p>Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga.</p>
          <p>Kami hanya membagikan informasi dengan:</p>
          <ul>
            <li>Penyedia layanan pembayaran untuk memproses transaksi</li>
            <li>Pihak berwenang jika diwajibkan oleh hukum</li>
          </ul>

          <h2>5. Cookies</h2>
          <p>
            Kami menggunakan cookies untuk meningkatkan pengalaman Anda di website kami. Anda dapat
            mengatur browser Anda untuk menolak cookies, namun ini mungkin mempengaruhi fungsi
            website.
          </p>

          <h2>6. Hak Anda</h2>
          <p>Anda memiliki hak untuk:</p>
          <ul>
            <li>Mengakses dan melihat data pribadi Anda</li>
            <li>Meminta koreksi data yang tidak akurat</li>
            <li>Meminta penghapusan data Anda</li>
            <li>Menarik persetujuan penggunaan data</li>
          </ul>

          <h2>7. Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan
            diposting di halaman ini dengan tanggal pembaruan yang baru.
          </p>

          <h2>8. Hubungi Kami</h2>
          <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, hubungi kami di:</p>
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
