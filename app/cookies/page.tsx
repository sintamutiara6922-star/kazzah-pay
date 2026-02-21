import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cookie } from 'lucide-react'

export const metadata = {
  title: 'Cookie Policy - Kebijakan Cookie',
  description: 'Kebijakan penggunaan cookie di PaymentHub',
}

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/5 to-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Cookie className="mx-auto mb-4 h-12 w-12 text-primary" />
            <Badge className="mb-4">Legal</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Kebijakan Cookie</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Terakhir diperbarui: 15 Februari 2025
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardContent className="prose prose-gray max-w-none p-8 dark:prose-invert">
                <h2>1. Apa itu Cookie?</h2>
                <p>
                  Cookie adalah file teks kecil yang ditempatkan di perangkat Anda saat Anda mengunjungi website kami. Cookie membantu kami memberikan pengalaman yang lebih baik dengan mengingat preferensi Anda dan memahami bagaimana Anda menggunakan layanan kami.
                </p>

                <h2>2. Jenis Cookie yang Kami Gunakan</h2>
                
                <h3>2.1 Cookie yang Diperlukan (Essential Cookies)</h3>
                <p>Cookie ini penting untuk operasi dasar website dan tidak dapat dinonaktifkan:</p>
                <ul>
                  <li><strong>Session Cookie:</strong> Mengingat status login Anda</li>
                  <li><strong>Security Cookie:</strong> Melindungi dari serangan CSRF dan keamanan lainnya</li>
                  <li><strong>Load Balancing:</strong> Memastikan performa optimal</li>
                </ul>

                <h3>2.2 Cookie Fungsional (Functional Cookies)</h3>
                <p>Cookie yang meningkatkan fungsionalitas dan personalisasi:</p>
                <ul>
                  <li><strong>Preferensi Bahasa:</strong> Mengingat pilihan bahasa Anda</li>
                  <li><strong>Theme Preference:</strong> Menyimpan pilihan tema (dark/light mode)</li>
                  <li><strong>Dashboard Settings:</strong> Mengingat pengaturan dashboard Anda</li>
                </ul>

                <h3>2.3 Cookie Analitik (Analytics Cookies)</h3>
                <p>Membantu kami memahami bagaimana pengunjung berinteraksi dengan website:</p>
                <ul>
                  <li><strong>Google Analytics:</strong> Menganalisis traffic dan perilaku pengguna</li>
                  <li><strong>Performance Monitoring:</strong> Memantau kecepatan dan performa</li>
                  <li><strong>Error Tracking:</strong> Mendeteksi dan memperbaiki error</li>
                </ul>

                <h3>2.4 Cookie Marketing (Marketing Cookies)</h3>
                <p>Digunakan untuk menampilkan iklan yang relevan:</p>
                <ul>
                  <li><strong>Remarketing:</strong> Menampilkan iklan relevan di platform lain</li>
                  <li><strong>Conversion Tracking:</strong> Mengukur efektivitas kampanye marketing</li>
                  <li><strong>Social Media:</strong> Integrasi dengan platform media sosial</li>
                </ul>

                <h2>3. Cookie Pihak Ketiga</h2>
                <p>Kami menggunakan layanan pihak ketiga yang mungkin menempatkan cookie mereka sendiri:</p>
                <ul>
                  <li><strong>Google Analytics:</strong> Analisis website</li>
                  <li><strong>Stripe:</strong> Pemrosesan pembayaran</li>
                  <li><strong>Cloudflare:</strong> CDN dan keamanan</li>
                  <li><strong>Intercom:</strong> Live chat support</li>
                </ul>

                <h2>4. Durasi Cookie</h2>
                <p>Cookie yang kami gunakan memiliki durasi berbeda:</p>
                <ul>
                  <li><strong>Session Cookies:</strong> Dihapus saat Anda menutup browser</li>
                  <li><strong>Persistent Cookies:</strong> Tetap ada hingga tanggal kedaluwarsa (hingga 2 tahun)</li>
                </ul>

                <h2>5. Mengontrol Cookie</h2>
                <p>Anda memiliki beberapa cara untuk mengontrol cookie:</p>

                <h3>5.1 Pengaturan Browser</h3>
                <p>Sebagian besar browser memungkinkan Anda untuk:</p>
                <ul>
                  <li>Melihat cookie yang disimpan</li>
                  <li>Menghapus cookie yang ada</li>
                  <li>Memblokir cookie pihak ketiga</li>
                  <li>Mengizinkan cookie dari website tertentu</li>
                  <li>Menghapus semua cookie saat menutup browser</li>
                </ul>

                <h3>5.2 Cookie Preference Center</h3>
                <p>
                  Anda dapat mengelola preferensi cookie Anda melalui Cookie Preference Center kami yang dapat diakses di footer website.
                </p>

                <h3>5.3 Opt-out Tools</h3>
                <p>Untuk cookie analytics dan marketing:</p>
                <ul>
                  <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Opt-out Browser Add-on</a></li>
                  <li>Facebook: Pengaturan iklan di akun Facebook Anda</li>
                  <li>NAI: <a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a></li>
                </ul>

                <h2>6. Dampak Menonaktifkan Cookie</h2>
                <p>Jika Anda memblokir atau menghapus cookie tertentu:</p>
                <ul>
                  <li>Beberapa fitur mungkin tidak berfungsi dengan baik</li>
                  <li>Anda mungkin perlu login ulang setiap kali mengunjungi website</li>
                  <li>Preferensi Anda tidak akan tersimpan</li>
                  <li>Pengalaman pengguna mungkin kurang optimal</li>
                </ul>

                <h2>7. Cookie dan Data Pribadi</h2>
                <p>
                  Beberapa cookie mengumpulkan data pribadi. Penggunaan data ini diatur oleh Kebijakan Privasi kami. Cookie yang diperlukan tidak memerlukan persetujuan, namun cookie lain memerlukan persetujuan Anda.
                </p>

                <h2>8. Mobile Apps</h2>
                <p>
                  Aplikasi mobile kami mungkin menggunakan teknologi serupa cookie seperti SDK pihak ketiga dan identifier perangkat. Anda dapat mengontrol ini melalui pengaturan perangkat Anda.
                </p>

                <h2>9. Pembaruan Kebijakan</h2>
                <p>
                  Kami dapat memperbarui kebijakan cookie ini untuk mencerminkan perubahan dalam teknologi atau hukum. Perubahan akan diposting di halaman ini dengan tanggal "Terakhir diperbarui" yang baru.
                </p>

                <h2>10. Pertanyaan tentang Cookie</h2>
                <p>Jika Anda memiliki pertanyaan tentang penggunaan cookie kami:</p>
                <ul>
                  <li>Email: privacy@paymenthub.com</li>
                  <li>WhatsApp: +62 21 1234 5678</li>
                  <li>Alamat: SCBD Lot 28, Jakarta Selatan 12190</li>
                </ul>

                <h2>Ringkasan Cookie</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Nama Cookie</th>
                      <th>Tujuan</th>
                      <th>Durasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>session_id</td>
                      <td>Mengingat status login</td>
                      <td>Session</td>
                    </tr>
                    <tr>
                      <td>csrf_token</td>
                      <td>Keamanan CSRF</td>
                      <td>Session</td>
                    </tr>
                    <tr>
                      <td>theme</td>
                      <td>Preferensi tema</td>
                      <td>1 tahun</td>
                    </tr>
                    <tr>
                      <td>_ga</td>
                      <td>Google Analytics</td>
                      <td>2 tahun</td>
                    </tr>
                    <tr>
                      <td>_gid</td>
                      <td>Google Analytics</td>
                      <td>24 jam</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
