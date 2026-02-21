import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/providers/theme-provider'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PaymentHub - Enterprise Payment Gateway & Donation Platform',
  description:
    'Modern payment gateway supporting QRIS, e-wallets, virtual accounts, and bank transfers. Accept donations and payments with ease.',
  keywords: [
    'payment gateway',
    'donation platform',
    'QRIS',
    'e-wallet',
    'virtual account',
    'payment indonesia',
  ],
  authors: [{ name: 'PaymentHub' }],
  creator: 'PaymentHub',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://paymenthub.com',
    title: 'PaymentHub - Enterprise Payment Gateway',
    description:
      'Modern payment gateway supporting QRIS, e-wallets, virtual accounts, and bank transfers.',
    siteName: 'PaymentHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaymentHub - Enterprise Payment Gateway',
    description: 'Modern payment gateway for Indonesia',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
