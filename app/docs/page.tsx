'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { siteConfig } from '@/lib/config'
import { Reveal } from '@/components/ui/reveal'
import {
  Code2,
  Play,
  CheckCircle2,
  Shield,
  Zap,
  Activity,
  Copy,
  Check,
  Globe,
  Lock,
  Server,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typedResponse, setTypedResponse] = useState('')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const simulateAPICall = (responseText: string) => {
    setIsTyping(true)
    setTypedResponse('')
    let index = 0
    const interval = setInterval(() => {
      if (index < responseText.length) {
        setTypedResponse((prev) => prev + responseText[index])
        index++
      } else {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 20)
  }

  const exampleResponse = `{
  "success": true,
  "data": {
    "transaction_id": "TRX-2026-02-XXXXX",
    "invoice_url": "${siteConfig.url}/invoice/ABC123",
    "qr_code": "data:image/png;base64,iVBORw0KG...",
    "amount": 50000,
    "status": "pending",
    "expires_at": "2026-02-15T12:00:00Z"
  }
}`

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal direction="right" duration={0.8}>
                <div>
                  <Badge className="mb-4 animate-fade-in">API Documentation v1.0</Badge>
                <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                  Payment API
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Simple & Powerful
                  </span>
                </h1>
                <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                  Integrate pembayaran digital ke aplikasi Anda dalam hitungan menit.
                  Tanpa API key, cukup whitelist IP Anda.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" className="gap-2" onClick={() => simulateAPICall(exampleResponse)}>
                    <Play className="h-5 w-5" />
                    Try Live Demo
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                    </a>
                  </Button>
                </div>
                </div>
              </Reveal>
              <Reveal direction="left" duration={0.8} delay={200}>
                <div className="relative">
                  <Image
                    src="/images/api-docs-banner.webp"
                    alt="API Documentation"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                    priority
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Health Status */}
        <section className="border-b bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
          <Reveal direction="up" delay={100}>
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">API Status</span>
                    <Badge variant="outline" className="gap-1 border-success text-success">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
                      Operational
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Uptime: 99.9% | Last 30 days</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Response Time</p>
                  <p className="font-semibold">45ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requests Today</p>
                  <p className="font-semibold">12,847</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="font-semibold">99.8%</p>
                </div>
              </div>
            </div>
            </div>
          </Reveal>
        </section>

        {/* Main Content */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <Reveal direction="up" delay={200}>
            <div className="mx-auto max-w-7xl">
            <Tabs defaultValue="quickstart" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="whitelist">IP Whitelist</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>

              {/* Quick Start */}
              <TabsContent value="quickstart" className="mt-8 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Mulai Dalam 5 Menit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-3 font-semibold">1. Whitelist IP Anda</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Tidak perlu API key! Cukup tambahkan IP server Anda ke whitelist di admin dashboard.
                      </p>
                      <div className="rounded-lg border bg-muted/50 p-4">
                        <code className="text-sm">
                          IP Anda: <span className="font-semibold text-primary">203.0.113.1</span>
                        </code>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold">2. Install Library</h3>
                      <CodeBlock
                        code={`npm install axios
# or
yarn add axios`}
                        language="bash"
                        onCopy={() => copyToClipboard('npm install axios', 'install')}
                        copied={copiedCode === 'install'}
                      />
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold">3. Buat Payment</h3>
                      <CodeBlock
                        code={`const response = await fetch('${siteConfig.api.baseUrl}/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 50000,
    method: 'qris',
    type: 'payment',
    name: 'Yilzi',
    email: 'yilzi@yilzicode.com'
  })
});

const data = await response.json();
console.log('Invoice URL:', data.invoiceUrl);`}
                        language="javascript"
                        onCopy={() => copyToClipboard('fetch code', 'create')}
                        copied={copiedCode === 'create'}
                      />
                    </div>

                    <div>
                      <Button
                        onClick={() => simulateAPICall(exampleResponse)}
                        disabled={isTyping}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        {isTyping ? 'Running...' : 'Run Demo'}
                      </Button>
                      {typedResponse && (
                        <div className="mt-4 rounded-lg border bg-card p-3 md:p-4 overflow-hidden">
                          <p className="mb-2 text-xs font-semibold text-success">✓ Success Response:</p>
                          <pre className="overflow-x-auto text-xs md:text-sm">
                            <code className="text-success break-all whitespace-pre-wrap">{typedResponse}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Endpoints */}
              <TabsContent value="endpoints" className="mt-8 space-y-6">
                {endpoints.map((endpoint) => (
                  <Card key={endpoint.path}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm">{endpoint.path}</code>
                          </div>
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {endpoint.request && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold">Request Body:</h4>
                          <CodeBlock
                            code={JSON.stringify(endpoint.request, null, 2)}
                            language="json"
                            onCopy={() => copyToClipboard(JSON.stringify(endpoint.request), endpoint.path)}
                            copied={copiedCode === endpoint.path}
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">Response:</h4>
                        <CodeBlock
                          code={JSON.stringify(endpoint.response, null, 2)}
                          language="json"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* IP Whitelist */}
              <TabsContent value="whitelist" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      IP Whitelist Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-3 font-semibold">Kenapa IP Whitelist?</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                          Lebih aman dari API key yang bisa bocor
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                          Tidak perlu manage key rotation
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                          Request hanya dari server terpercaya
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                          Setup sekali, langsung jalan
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
                      <h3 className="mb-3 font-semibold">Cara Whitelist IP:</h3>
                      <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            1
                          </span>
                          <div>
                            <p className="font-medium">Login ke Admin Dashboard</p>
                            <p className="text-muted-foreground">
                              Akses {siteConfig.url}/admin dengan kredensial admin
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            2
                          </span>
                          <div>
                            <p className="font-medium">Buka Settings → IP Whitelist</p>
                            <p className="text-muted-foreground">
                              Tambahkan IP server production Anda
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            3
                          </span>
                          <div>
                            <p className="font-medium">Save & Test</p>
                            <p className="text-muted-foreground">
                              Coba hit endpoint untuk verify
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold">Mendapatkan IP Server:</h3>
                      <CodeBlock
                        code={`# Untuk mendapatkan IP server Anda
curl https://api.ipify.org

# Atau
curl https://icanhazip.com

# Output: 203.0.113.1`}
                        language="bash"
                      />
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="flex gap-3">
                        <Server className="h-5 w-5 shrink-0 text-primary" />
                        <div className="text-sm">
                          <p className="font-semibold">Production Tips:</p>
                          <p className="mt-1 text-muted-foreground">
                            Untuk deployment di Vercel/Netlify, whitelist range IP mereka atau gunakan
                            custom domain dengan static IP
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Webhooks */}
              <TabsContent value="webhooks" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Webhook Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi real-time saat status pembayaran berubah. Webhook akan dipanggil
                      otomatis ke endpoint yang Anda daftarkan.
                    </p>

                    <div>
                      <h3 className="mb-3 font-semibold">Setup Webhook Endpoint:</h3>
                      <CodeBlock
                        code={`// pages/api/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transaction_id, status, amount } = req.body;

  // Verify signature untuk keamanan
  const signature = req.headers['x-webhook-signature'];
  // ... verify signature logic

  if (status === 'success') {
    // Update database Anda
    await updateTransactionStatus(transaction_id, 'paid');
    
    // Send notification ke user
    await sendEmailNotification(transaction_id);
  }

  res.status(200).json({ received: true });
}`}
                        language="typescript"
                      />
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold">Webhook Payload:</h3>
                      <CodeBlock
                        code={JSON.stringify({
                          event: 'payment.success',
                          transaction_id: 'TRX-2026-02-XXXXX',
                          amount: 50000,
                          status: 'success',
                          method: 'qris',
                          customer: {
                            name: 'Yilzi',
                            email: 'yilzi@yilzicode.com',
                          },
                          paid_at: '2026-02-15T10:30:00Z',
                        }, null, 2)}
                        language="json"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            </div>
          </Reveal>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-gradient-to-br from-primary to-accent px-4 py-16 text-white sm:px-6 lg:px-8">
          <Reveal direction="up" delay={100}>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl animate-fade-in">
              Siap Integrate Payment API?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-white/90">
              Whitelist IP Anda sekarang dan mulai terima pembayaran dalam hitungan menit
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <a href="/admin">Whitelist IP Sekarang</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function CodeBlock({
  code,
  language,
  onCopy,
  copied,
}: {
  code: string
  language: string
  onCopy?: () => void
  copied?: boolean
}) {
  return (
    <div className="group relative rounded-lg border bg-slate-950 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 md:px-4 py-2">
        <span className="text-xs font-semibold text-slate-400">{language}</span>
        {onCopy && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 md:gap-2 text-xs text-slate-400 opacity-100 md:opacity-0 transition-opacity hover:text-white md:group-hover:opacity-100"
            onClick={onCopy}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </Button>
        )}
      </div>
      <pre className="overflow-x-auto p-3 md:p-4 text-xs md:text-sm">
        <code className="text-slate-50 break-all whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  )
}

const endpoints = [
  {
    method: 'POST',
    path: `/api/payment/create`,
    description: 'Buat transaksi pembayaran atau donasi baru',
    request: {
      amount: 50000,
      method: 'qris',
      type: 'payment',
      name: 'Yilzi',
      email: 'yilzi@yilzicode.com',
    },
    response: {
      success: true,
      invoiceUrl: `${siteConfig.url}/invoice/ABC123`,
      invoiceCode: 'ABC123',
      transactionId: 'TRX-2026-02-XXXXX',
    },
  },
  {
    method: 'GET',
    path: `/api/payment/status?code=ABC123`,
    description: 'Cek status pembayaran',
    request: null,
    response: {
      success: true,
      status: 'pending',
      amount: 50000,
      method: 'qris',
      createdAt: '2026-02-15T10:00:00Z',
    },
  },
  {
    method: 'GET',
    path: `/api/leaderboard?period=month&type=donation`,
    description: 'Ambil data leaderboard donatur',
    request: null,
    response: {
      success: true,
      period: 'month',
      leaderboard: [
        { rank: 1, name: 'Yilzi', amount: 1000000, tier: 'platinum' },
        { rank: 2, name: 'Budi', amount: 500000, tier: 'gold' },
      ],
    },
  },
]
