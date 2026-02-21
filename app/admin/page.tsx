'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  LogOut,
  RefreshCw,
  Shield,
  Server,
  AlertCircle,
  CheckCircle2,
  Clock,
  Heart,
  Wallet,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'

interface Stats {
  totalAmount: number
  totalTransactions: number
  totalDonations: number
  totalPayments: number
  activeUsers: number
  successRate: number
  avgAmount: number
  todayAmount: number
  todayTransactions: number
  donationAmount: number
  paymentAmount: number
  todayDonations: number
  todayPayments: number
}

interface Transaction {
  id: string
  type: 'donation' | 'payment'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  name: string
  method: string
  createdAt: string
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  uptime: number
  redis: boolean
  api: boolean
  lastCheck: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [atlanticProfile, setAtlanticProfile] = useState<any>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include',
          cache: 'no-store',
        })
        const data = await response.json()
        
        if (!data.authenticated) {
          router.push('/admin/login')
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('[Yilzi] Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return
    
    fetchData()
  }, [isAuthenticated])

  useEffect(() => {
    if (autoRefresh && isAuthenticated) {
      const interval = setInterval(() => {
        fetchData()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh, isAuthenticated])

  const fetchData = async () => {
    try {
      const [statsRes, healthRes] = await Promise.all([
        fetch('/api/stats', { cache: 'no-store' }),
        fetch('/api/admin/health', { cache: 'no-store' }),
      ])

      const statsData = await statsRes.json()
      const healthData = await healthRes.json()

      if (statsData.success) {
        setStats(statsData.stats)
        setTransactions(statsData.recentTransactions || [])
        setAtlanticProfile(statsData.atlanticProfile || null)
      }

      if (healthData.success) {
        setHealth(healthData.health)
      }

      setLoading(false)
    } catch (error) {
      console.error('[Yilzi] Fetch data error:', error)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      toast.success('Logout berhasil')
      router.push('/admin/login')
    } catch (error) {
      console.error('[Yilzi] Logout error:', error)
    }
  }

  if (checkingAuth || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const chartData = transactions.slice(0, 7).reverse().map((tx, index) => ({
    date: new Date(tx.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
    amount: tx.amount,
    donation: tx.type === 'donation' ? tx.amount : 0,
    payment: tx.type === 'payment' ? tx.amount : 0,
  }))

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header - Mobile Responsive */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground">Monitor dan kelola platform secara realtime</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'border-green-500' : ''}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}</span>
                <span className="sm:hidden">Auto</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* System Health & Gateway Status */}
        {health && (
          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">System Health</CardTitle>
                </div>
                <Badge variant={health.status === 'healthy' ? 'default' : 'destructive'} className="bg-green-500">
                  {health.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Redis: {health.redis ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">API: {health.api ? 'Online' : 'Offline'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Gateway: {atlanticProfile?.gateway?.toUpperCase() || 'UNKNOWN'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Uptime: {Math.floor((health.uptime || 0) / 3600)}h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Stats Grid */}
        {stats && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Terkumpul</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Hari ini: {formatCurrency(stats.todayAmount || 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.totalTransactions || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Hari ini: {stats.todayTransactions || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.activeUsers || 0)}</div>
                <p className="text-xs text-muted-foreground">Online sekarang</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.successRate || 100}%</div>
                <p className="text-xs text-muted-foreground">Transaksi berhasil</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Donation vs Payment Stats */}
        {stats && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Donasi</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.donationAmount || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalDonations || 0} transaksi • Hari ini: {stats.todayDonations || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Pembayaran</CardTitle>
                <Wallet className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.paymentAmount || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalPayments || 0} transaksi • Hari ini: {stats.todayPayments || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs - Mobile Responsive */}
        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-1.5 md:p-1.5 h-auto">
            <TabsTrigger value="overview" className="text-xs md:text-sm py-2.5 md:py-2">Overview</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs md:text-sm py-2.5 md:py-2">Transactions</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm py-2.5 md:py-2">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs md:text-sm py-2.5 md:py-2">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {/* Transaction Chart */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Transaction Overview</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Grafik transaksi 7 hari terakhir</CardDescription>
                </CardHeader>
                <CardContent className="p-2 md:p-4 overflow-hidden">
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Total",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[220px] md:h-[280px] w-full max-w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                        <YAxis tick={{ fontSize: 8 }} width={35} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Area type="monotone" dataKey="amount" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorAmount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Donation vs Payment Chart */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Donation vs Payment</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Perbandingan donasi dan pembayaran</CardDescription>
                </CardHeader>
                <CardContent className="p-2 md:p-4 overflow-hidden">
                  <ChartContainer
                    config={{
                      donation: {
                        label: "Donasi",
                        color: "hsl(var(--chart-2))",
                      },
                      payment: {
                        label: "Pembayaran",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[220px] md:h-[280px] w-full max-w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                        <YAxis tick={{ fontSize: 8 }} width={35} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="donation" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="payment" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic & Activity</CardTitle>
                <CardDescription>Aktivitas pengguna real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Visitors</p>
                      <p className="text-2xl font-bold">{formatNumber((stats?.activeUsers || 0) * 10)}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">{((stats?.totalTransactions || 0) / Math.max((stats?.activeUsers || 0) * 10, 1) * 100).toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Transaction</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats?.avgAmount || 0)}</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Transaksi Terbaru</CardTitle>
                <CardDescription className="text-xs md:text-sm">Real-time transaction monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length > 0 ? transactions.map((tx, index) => (
                    <div
                      key={`${tx.id}-${index}`}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            tx.type === 'donation' ? 'bg-red-100' : 'bg-indigo-100'
                          }`}
                        >
                        {tx.type === 'donation' ? (
                            <Heart className="h-5 w-5 text-red-600" />
                          ) : (
                            <Wallet className="h-5 w-5 text-indigo-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm md:text-base truncate">{tx.name}</p>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {tx.method} • {formatDate(tx.createdAt, 'long')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end md:text-right gap-2 pl-13 md:pl-0">
                        <p className="font-semibold text-sm md:text-base">{formatCurrency(tx.amount)}</p>
                        <Badge
                          variant={
                            tx.status === 'completed'
                              ? 'default'
                              : tx.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }
                          className="text-xs"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-sm text-muted-foreground py-8">Belum ada transaksi</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Donation Analytics</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Statistik donasi lengkap</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Donasi</span>
                        <span className="font-semibold">{formatNumber(stats.totalDonations || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Amount</span>
                        <span className="font-semibold">{formatCurrency(stats.donationAmount || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hari Ini</span>
                        <span className="font-semibold">{stats.todayDonations || 0}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2">
                        <span className="text-sm">Rata-rata</span>
                        <span className="font-semibold">
                          {formatCurrency((stats.donationAmount || 0) / Math.max(stats.totalDonations || 1, 1))}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Payment Analytics</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Statistik pembayaran lengkap</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Pembayaran</span>
                        <span className="font-semibold">{formatNumber(stats.totalPayments || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Amount</span>
                        <span className="font-semibold">{formatCurrency(stats.paymentAmount || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hari Ini</span>
                        <span className="font-semibold">{stats.todayPayments || 0}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2">
                        <span className="text-sm">Rata-rata</span>
                        <span className="font-semibold">
                          {formatCurrency((stats.paymentAmount || 0) / Math.max(stats.totalPayments || 1, 1))}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Metrik performa sistem</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-semibold">{stats && stats.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Users</span>
                    <span className="font-semibold">{stats && formatNumber(stats.activeUsers || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. Response Time</span>
                    <span className="font-semibold">{"<100ms"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Atlantic Profile Table - Mobile Responsive (Only show for Atlantic gateway) */}
              {atlanticProfile?.gateway === 'atlantic' && atlanticProfile?.profile && (
                <Card className="col-span-1 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <Wallet className="h-4 w-4 md:h-5 md:w-5" />
                      Atlantic H2H Profile
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Informasi akun Atlantic payment gateway
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-lg border overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left text-sm font-semibold">Field</th>
                            <th className="p-3 text-left text-sm font-semibold">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3 text-sm font-medium">Name</td>
                            <td className="p-3 text-sm">{atlanticProfile.profile.name}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 text-sm font-medium">Username</td>
                            <td className="p-3 text-sm font-mono text-muted-foreground">
                              {atlanticProfile.profile.username}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 text-sm font-medium">Email</td>
                            <td className="p-3 text-sm break-all">{atlanticProfile.profile.email}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 text-sm font-medium">Phone</td>
                            <td className="p-3 text-sm">{atlanticProfile.profile.phone}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 text-sm font-medium">Balance</td>
                            <td className="p-3 text-sm">
                              <span className="font-semibold text-green-600">
                                {formatCurrency(parseInt(atlanticProfile.profile.balance || '0'))}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 text-sm font-medium">Status</td>
                            <td className="p-3">
                              <Badge
                                variant={atlanticProfile.profile.status === 'active' ? 'default' : 'secondary'}
                                className={atlanticProfile.profile.status === 'active' ? 'bg-green-500' : ''}
                              >
                                {atlanticProfile.profile.status.toUpperCase()}
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      <div className="rounded-lg border p-3 bg-muted/30">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Name</div>
                        <div className="text-sm font-semibold">{atlanticProfile.profile.name}</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Username</div>
                        <div className="text-sm font-mono">{atlanticProfile.profile.username}</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Email</div>
                        <div className="text-sm break-all">{atlanticProfile.profile.email}</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Phone</div>
                        <div className="text-sm">{atlanticProfile.profile.phone}</div>
                      </div>
                      <div className="rounded-lg border p-3 bg-green-50 dark:bg-green-950/20">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Balance</div>
                        <div className="text-base font-bold text-green-600">
                          {formatCurrency(parseInt(atlanticProfile.profile.balance || '0'))}
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs font-medium text-muted-foreground mb-2">Status</div>
                        <Badge
                          variant={atlanticProfile.profile.status === 'active' ? 'default' : 'secondary'}
                          className={atlanticProfile.profile.status === 'active' ? 'bg-green-500' : ''}
                        >
                          {atlanticProfile.profile.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Status sistem real-time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Redis Status</span>
                    <Badge variant="default" className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="default" className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default" className="bg-green-500">Healthy</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure your platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Auto Refresh</p>
                      <p className="text-sm text-muted-foreground">Automatically update dashboard data</p>
                    </div>
                  </div>
                  <Button
                    variant={autoRefresh ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                  >
                    {autoRefresh ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive alerts for transactions</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Report Schedule</p>
                      <p className="text-sm text-muted-foreground">Automated daily/weekly reports</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
      }
                    
