'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  ExternalLink,
  Download,
  Timer,
  QrCode,
  CreditCard,
  User,
  Mail,
  Receipt,
  ArrowLeft,
  Smartphone,
  DollarSign,
} from 'lucide-react'

interface Transaction {
  id: string
  invoiceCode: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed' | 'expired' | 'cancel'
  type: 'payment' | 'donation'
  method: string
  name?: string
  email?: string
  phone?: string
  customerName?: string
  customerEmail?: string
  paymentData?: any
  message?: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  canUseInstantDeposit?: boolean
}

export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isExpired, setIsExpired] = useState(false)

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/payment/status?invoice=${code}`)
      const data = await response.json()

      if (data.success && data.transaction) {
        setTransaction(data.transaction)
        
        // Calculate time remaining if transaction is pending
        if (data.transaction.status === 'pending' && data.transaction.expiresAt) {
          const expiryTime = new Date(data.transaction.expiresAt).getTime()
          const now = Date.now()
          const remaining = Math.max(0, expiryTime - now)
          setTimeRemaining(remaining)
        }
      } else {
        toast.error('Invoice tidak ditemukan')
        router.push('/')
      }
    } catch (error) {
      console.error('[v0] Fetch transaction error:', error)
      toast.error('Gagal memuat invoice')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransaction()
    
    // Auto-refresh every 5 seconds for pending transactions
    const interval = setInterval(() => {
      if (transaction?.status === 'pending' || transaction?.status === 'processing') {
        fetchTransaction()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [code, transaction?.status])

  // Countdown timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || !transaction || transaction.status !== 'pending') return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000
        if (newTime <= 0) {
          setIsExpired(true)
          // Auto-cancel when expired
          handleCancelPayment()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, transaction])

  const handleCancelPayment = async () => {
    if (!transaction) return
    
    try {
      const response = await fetch('/api/payment/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: transaction.id }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Pembayaran berhasil dibatalkan')
        // Set cancel status locally - polling will stop since status is no longer 'pending'
        setTransaction({ ...transaction, status: 'cancel' })
      } else {
        toast.error(data.error || 'Gagal membatalkan pembayaran')
      }
    } catch (error) {
      console.error('[v0] Cancel payment error:', error)
      toast.error('Terjadi kesalahan saat membatalkan pembayaran')
    }
  }

  const handleCheckStatus = async () => {
    setChecking(true)
    await fetchTransaction()
    toast.info('Status pembayaran diperbarui')
    setChecking(false)
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} disalin`)
  }

  const handleDownload = () => {
    if (!transaction) {
      toast.error('Data transaksi tidak ditemukan')
      return
    }

    // Create invoice content
    const invoiceContent = `
INVOICE PEMBAYARAN
==================

Invoice: ${transaction.invoiceCode}
Tanggal: ${formatDate(transaction.createdAt, 'long')}
Status: ${transaction.status.toUpperCase()}

DETAIL PELANGGAN
----------------
Nama: ${transaction.name || transaction.customerName || 'N/A'}
Email: ${transaction.email || transaction.customerEmail || 'N/A'}
${transaction.phone ? `Telepon: ${transaction.phone}` : ''}

DETAIL PEMBAYARAN
-----------------
Tipe: ${transaction.type === 'donation' ? 'Donasi' : 'Pembayaran'}
Metode: ${transaction.method}
Jumlah: ${formatCurrency(transaction.amount)}

Transaction ID: ${transaction.id}
${transaction.message ? `Pesan: ${transaction.message}` : ''}

Terima kasih atas pembayaran Anda!
PaymentHub - Yilzi Digital
`

    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${transaction.invoiceCode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Invoice berhasil diunduh')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat invoice...</p>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Invoice Tidak Ditemukan</h2>
            <p className="text-center text-muted-foreground">
              Invoice yang Anda cari tidak ditemukan atau sudah tidak valid
            </p>
            <Button asChild>
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const paymentData = transaction.paymentData
    ? typeof transaction.paymentData === 'string'
      ? JSON.parse(transaction.paymentData)
      : transaction.paymentData
    : null

  console.log('[v0] Invoice paymentData parsed:', { 
    hasData: !!paymentData, 
    has_qr_image: !!paymentData?.qr_image,
    has_qr_string: !!paymentData?.qr_string,
    qr_image_preview: paymentData?.qr_image?.substring(0, 100),
    qr_string_preview: paymentData?.qr_string?.substring(0, 50),
    keys: paymentData ? Object.keys(paymentData) : [] 
  })

  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Menunggu Pembayaran',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    processing: {
      icon: Clock,
      label: 'Sedang Diproses',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    success: {
      icon: CheckCircle2,
      label: 'Pembayaran Berhasil',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    failed: {
      icon: XCircle,
      label: 'Pembayaran Gagal',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    expired: {
      icon: XCircle,
      label: 'Pembayaran Kadaluarsa',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      borderColor: 'border-gray-200 dark:border-gray-800',
    },
    cancel: {
      icon: XCircle,
      label: 'Pembayaran Dibatalkan',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      borderColor: 'border-gray-200 dark:border-gray-800',
    },
  }

  const status = statusConfig[transaction.status]
  const StatusIcon = status.icon

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const progressPercentage = transaction.expiresAt
    ? ((timeRemaining / (15 * 60 * 1000)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto max-w-5xl px-3 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
          </Button>
        </div>

        {/* Alert Banner for Pending */}
        {transaction.status === 'pending' && !isExpired && (
          <Card className={`mb-4 md:mb-6 ${status.borderColor} border-2`}>
            <CardContent className="flex items-start gap-3 md:gap-4 p-3 md:p-4">
              <Clock className="mt-0.5 h-4 w-4 md:h-5 md:w-5 shrink-0 text-amber-600" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base text-amber-900 dark:text-amber-100">
                  Selesaikan pembayaran Anda
                </h3>
                <p className="mt-1 text-xs md:text-sm text-amber-800 dark:text-amber-200">
                  Status pembayaran akan diperbarui otomatis setiap 5 detik. Anda dapat menutup tab ini dan kembali kapan saja menggunakan link invoice.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-4 md:space-y-6">
            {/* Status Card */}
            <Card className={`${status.bgColor} ${status.borderColor} border-2`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                    <div className={`rounded-full ${status.bgColor} p-2 md:p-3 shrink-0`}>
                      <StatusIcon className={`h-5 w-5 md:h-6 md:w-6 ${status.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className={`text-lg md:text-2xl font-bold ${status.color}`}>
                        {status.label}
                      </h2>
                      <p className="mt-1 text-xs md:text-sm text-muted-foreground truncate">
                        Invoice #{transaction.invoiceCode}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Dibuat {formatDate(transaction.createdAt, 'long')}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCheckStatus}
                    disabled={checking}
                    className="gap-2 w-full md:w-auto shrink-0"
                  >
                    <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
                    <span className="md:inline">Periksa Status</span>
                  </Button>
                </div>

                {/* Processing Notification for Instant Deposit */}
                {transaction.status === 'processing' && (
                  <div className="mt-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 border-2 border-blue-200 dark:border-blue-800 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="rounded-full bg-blue-500 p-3 animate-spin">
                          <RefreshCw className="h-6 w-6 text-white" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                          Sedang Memproses Pembayaran
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Sistem sedang memverifikasi pembayaran Anda. Proses ini akan selesai secara otomatis dalam beberapa detik...
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                          <span>Menggunakan Instant Deposit untuk verifikasi cepat</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Countdown Timer */}
                {transaction.status === 'pending' && timeRemaining > 0 && (
                  <div className="mt-4 md:mt-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 p-4 md:p-5 border-2 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Timer className="h-4 w-4 md:h-5 md:w-5 text-amber-600 animate-pulse" />
                          <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-amber-900 dark:text-amber-100">
                          Selesaikan Pembayaran Dalam
                        </span>
                      </div>
                    </div>
                    
                    {/* Large Timer Display */}
                    <div className="flex items-center justify-center my-3 md:my-4">
                      <div className="text-center">
                        <div className="text-3xl md:text-5xl font-mono font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          {formatTime(timeRemaining)}
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                          {Math.floor(timeRemaining / 60000)} menit {Math.floor((timeRemaining % 60000) / 1000)} detik
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded-full bg-amber-200 dark:bg-amber-900 overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all duration-1000 ease-linear ${
                            progressPercentage > 50 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                              : progressPercentage > 25
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                              : 'bg-gradient-to-r from-red-500 to-rose-600'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-center text-amber-800 dark:text-amber-200">
                        Pembayaran akan otomatis dibatalkan jika waktu habis
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Success Celebration Card */}
            {transaction.status === 'success' && (
              <Card className="overflow-hidden border-2 border-green-200 dark:border-green-800">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 p-8">
                  <div className="text-center space-y-6">
                    {/* Success Icon with Animation */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-xl">
                          <CheckCircle2 className="h-16 w-16 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Success Message */}
                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Pembayaran Berhasil!
                      </h2>
                      <p className="text-lg text-green-700 dark:text-green-300">
                        Terima kasih atas pembayaran Anda
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-semibold">Transaksi Dikonfirmasi</span>
                      </div>
                    </div>
                    
                    {/* Payment Details */}
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 space-y-3 border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Jumlah Dibayar</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Metode Pembayaran</span>
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          {transaction.method}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Waktu Pembayaran</span>
                        <span className="text-sm font-medium">
                          {formatDate(transaction.updatedAt, 'long')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center pt-4">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick={handleDownload}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Invoice
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        asChild
                      >
                        <Link href="/">
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Kembali ke Beranda
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* QRIS Payment Card */}
            {transaction.status === 'pending' && paymentData && (paymentData.qr_image || paymentData.qr_string) && (
              <Card className="overflow-hidden border-2 border-blue-200 dark:border-blue-900 shadow-xl">
                <CardHeader className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white pb-6 relative overflow-hidden">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-white/20 backdrop-blur-sm p-3 shadow-lg">
                        <QrCode className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight">Scan QRIS</h3>
                        <p className="text-sm text-blue-100 mt-1">
                          Bayar menggunakan e-wallet atau mobile banking Anda
                        </p>
                      </div>
                    </div>
                    {paymentData.expired_at && (
                      <Badge variant="secondary" className="gap-1.5 bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">{formatDate(paymentData.expired_at, 'short')}</span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
                  <div className="flex flex-col items-center space-y-8">
                    {/* QR Code Display with Premium Styling */}
                    <div className="relative group">
                      {/* Glow Effect */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                      
                      <div className="relative rounded-3xl border-4 border-white dark:border-gray-800 bg-white p-8 shadow-2xl ring-4 ring-blue-100 dark:ring-blue-900/50">
                        {paymentData?.qr_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={paymentData.qr_image}
                            alt="QR Code QRIS"
                            width={300}
                            height={300}
                            className="h-[300px] w-[300px] rounded-xl"
                          />
                        ) : paymentData?.qr_string ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://quickchart.io/qr?text=${encodeURIComponent(paymentData.qr_string)}&size=400&margin=2`}
                            alt="QR Code QRIS"
                            width={300}
                            height={300}
                            className="h-[300px] w-[300px] rounded-xl"
                          />
                        ) : (
                          <div className="flex h-[300px] w-[300px] items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <div className="text-center space-y-2">
                              <QrCode className="h-20 w-20 text-gray-400 mx-auto" />
                              <p className="text-xs text-gray-500">Loading QR Code...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* QRIS Badge */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl px-6 py-2 text-base font-bold">
                          QRIS
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Scan Instruction */}
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        Scan QR Code untuk membayar
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Arahkan kamera smartphone Anda ke QR code di atas menggunakan aplikasi e-wallet atau mobile banking
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="w-full max-w-md space-y-4">
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Cara Pembayaran
                        </h4>
                        <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                          <li className="flex gap-2">
                            <span className="font-semibold">1.</span>
                            <span>Buka aplikasi e-wallet atau mobile banking Anda</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">2.</span>
                            <span>Pilih menu QRIS atau Scan QR</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">3.</span>
                            <span>Scan QR code di atas</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">4.</span>
                            <span>Konfirmasi pembayaran di aplikasi Anda</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">5.</span>
                            <span>Tunggu konfirmasi pembayaran berhasil</span>
                          </li>
                        </ol>
                      </div>

                      {/* Supported Apps */}
                      <div>
                        <p className="text-xs text-center text-muted-foreground mb-2">
                          Didukung oleh semua aplikasi QRIS
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'].map((app) => (
                            <Badge key={app} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Detail Transaksi
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Nama
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{transaction.name || transaction.customerName || 'N/A'}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const name = transaction.name || transaction.customerName || ''
                          handleCopy(name, 'Nama')
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{transaction.email || transaction.customerEmail || 'N/A'}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const email = transaction.email || transaction.customerEmail || ''
                          handleCopy(email, 'Email')
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Metode Pembayaran
                    </label>
                    <p className="font-medium">{transaction.method}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Tipe</label>
                    <Badge variant="secondary" className="font-medium">
                      {transaction.type === 'donation' ? 'Donasi' : 'Pembayaran'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Transaction ID</label>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-sm">{transaction.id}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(transaction.id, 'Transaction ID')}
                      className="h-7 w-7 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Invoice Code</label>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-sm">{transaction.invoiceCode}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(transaction.invoiceCode, 'Invoice Code')}
                      className="h-7 w-7 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="sticky top-6 border-2 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-2">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Ringkasan Pembayaran</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Display with Premium Styling */}
                <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2 text-blue-100">
                      <DollarSign className="h-4 w-4" />
                      <p className="text-sm font-medium">Total Pembayaran</p>
                    </div>
                    <p className="text-5xl font-bold tracking-tight">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mt-3">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{transaction.method}</span>
                    </div>
                  </div>
                </div>

                {transaction.message && (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-1">Pesan</p>
                    <p className="text-sm text-muted-foreground">{transaction.message}</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleDownload}
                    disabled={transaction.status !== 'success'}
                  >
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </Button>

                  {transaction.status === 'pending' && (
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={handleCancelPayment}
                    >
                      <XCircle className="h-4 w-4" />
                      Batalkan Pembayaran
                    </Button>
                  )}

                  {(transaction.status === 'success' || transaction.status === 'failed') && (
                    <Button
                      variant="default"
                      className="w-full gap-2"
                      asChild
                    >
                      <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Butuh Bantuan?
                </h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Jika Anda mengalami kendala atau memiliki pertanyaan terkait pembayaran ini, silakan hubungi tim support kami.
                </p>
                <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                  <Link href="/help" target="_blank">
                    <ExternalLink className="h-3 w-3" />
                    Pusat Bantuan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
          }
              
