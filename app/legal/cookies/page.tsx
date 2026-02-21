import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { siteConfig } from '@/lib/config'

export default function CookiesPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-neutral mx-auto max-w-4xl dark:prose-invert">
          <h1>Cookie Policy</h1>
          <p className="lead">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
          </p>

          <p>
            Kebijakan Cookie ini menjelaskan bagaimana {siteConfig.business.name} menggunakan
            cookies dan teknologi serupa untuk mengenali Anda ketika mengunjungi website kami.
          </p>

          <h2>1. Apa itu Cookies?</h2>
          <p>
            Cookies adalah file teks kecil yang disimpan di perangkat Anda ketika Anda mengunjungi
            website. Cookies memungkinkan website untuk mengingat tindakan dan preferensi Anda.
          </p>

          <h2>2. Jenis Cookies yang Kami Gunakan</h2>
          
          <h3>Cookies Esensial</h3>
          <p>
            Cookies ini diperlukan untuk fungsi dasar website, seperti keamanan, verifikasi akun,
            dan manajemen sesi. Website tidak dapat berfungsi dengan baik tanpa cookies ini.
          </p>

          <h3>Cookies Performa</h3>
          <p>
            Cookies ini mengumpulkan informasi tentang bagaimana pengunjung menggunakan website,
            seperti halaman yang paling sering dikunjungi dan pesan error yang diterima.
          </p>

          <h3>Cookies Fungsional</h3>
          <p>
            Cookies ini memungkinkan website untuk mengingat pilihan Anda (seperti tema dark/light)
            dan menyediakan fitur yang lebih personal.
          </p>

          <h3>Cookies Analytics</h3>
          <p>
            Kami menggunakan cookies analytics untuk memahami bagaimana pengunjung berinteraksi
            dengan website kami, membantu kami meningkatkan layanan.
          </p>

          <h2>3. Cookies Pihak Ketiga</h2>
          <p>Beberapa cookies di website kami ditempatkan oleh layanan pihak ketiga, termasuk:</p>
          <ul>
            <li>Penyedia layanan pembayaran (untuk memproses transaksi)</li>
            <li>Layanan analytics (untuk analisis penggunaan website)</li>
          </ul>

          <h2>4. Mengelola Cookies</h2>
          <p>
            Anda dapat mengontrol dan/atau menghapus cookies sesuai keinginan. Anda dapat menghapus
            semua cookies yang sudah ada di komputer Anda dan mengatur kebanyakan browser untuk
            mencegah pemasangan cookies.
          </p>
          <p>
            Namun, jika Anda melakukan ini, Anda mungkin harus menyesuaikan beberapa preferensi
            secara manual setiap kali mengunjungi website, dan beberapa fitur mungkin tidak
            berfungsi.
          </p>

          <h2>5. Cara Menghapus Cookies</h2>
          <p>Untuk menghapus cookies di browser populer:</p>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and security → Clear browsing data</li>
            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data → Clear Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data → Remove All</li>
            <li><strong>Edge:</strong> Settings → Privacy, search, and services → Clear browsing data</li>
          </ul>

          <h2>6. Perubahan pada Kebijakan Cookie</h2>
          <p>
            Kami dapat memperbarui Kebijakan Cookie ini dari waktu ke waktu. Perubahan akan
            diposting di halaman ini dengan tanggal pembaruan yang baru.
          </p>

          <h2>7. Kontak</h2>
          <p>Jika Anda memiliki pertanyaan tentang penggunaan cookies kami, silakan hubungi:</p>
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
