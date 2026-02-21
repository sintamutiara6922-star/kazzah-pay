'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Medal, Award, TrendingUp, CreditCard, Sparkles } from 'lucide-react'
import { getInitials, formatCurrency } from '@/lib/utils'
import { Card3D } from '@/components/ui/card-3d'

interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  amount: number
  count: number
  tier: string | null
}

export default function PaymentsLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [period, setPeriod] = useState('alltime')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard(period)
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => fetchLeaderboard(period), 10000)
    return () => clearInterval(interval)
  }, [period])

  const fetchLeaderboard = async (selectedPeriod: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/leaderboard?period=${selectedPeriod}&type=payment`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await response.json()
      if (data.success) {
        setLeaderboard(data.leaderboard || [])
      } else {
        setLeaderboard([])
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case 'diamond':
        return 'from-cyan-400 to-blue-600'
      case 'platinum':
        return 'from-gray-300 to-gray-600'
      case 'gold':
        return 'from-yellow-400 to-yellow-600'
      case 'silver':
        return 'from-gray-400 to-gray-500'
      case 'bronze':
        return 'from-orange-400 to-orange-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getPodiumGradient = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 via-yellow-500 to-yellow-600'
    if (rank === 2) return 'from-gray-300 via-gray-400 to-gray-500'
    return 'from-orange-400 via-orange-500 to-orange-600'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-border/50 pb-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-[128px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-[128px]" />

          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/50">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Leaderboard{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Pembayaran
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Top pembayaran terbesar yang telah berhasil diproses
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pt-12">
          <Tabs
            value={period}
            onValueChange={(value) => {
              setPeriod(value)
              fetchLeaderboard(value)
            }}
            className="space-y-8"
          >
            <div className="flex justify-center overflow-x-auto pb-2">
              <TabsList className="inline-flex w-full min-w-max rounded-xl border border-border/50 bg-card/50 p-1 backdrop-blur-xl md:w-auto">
                <TabsTrigger value="realtime" className="rounded-lg text-xs md:text-sm whitespace-nowrap">
                  <Sparkles className="mr-1 h-3 w-3 md:h-4 md:w-4 md:mr-1.5" />
                  Real-time
                </TabsTrigger>
                <TabsTrigger value="today" className="rounded-lg text-xs md:text-sm whitespace-nowrap">
                  Hari Ini
                </TabsTrigger>
                <TabsTrigger value="week" className="rounded-lg text-xs md:text-sm whitespace-nowrap">
                  Minggu Ini
                </TabsTrigger>
                <TabsTrigger value="month" className="rounded-lg text-xs md:text-sm whitespace-nowrap">
                  Bulan Ini
                </TabsTrigger>
                <TabsTrigger value="quarter" className="rounded-lg text-xs md:text-sm whitespace-nowrap">
                  Quarter
                </TabsTrigger>
                <TabsTrigger value="year" className="rounded-lg text-xs md:text-sm whitespace-nowrap">
                  Tahun Ini
                </TabsTrigger>
                <TabsTrigger value="alltime" className="rounded-lg text-xs md:text-sm whitespace-nowrap">
                  All-Time
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={period} className="space-y-8">
              {loading ? (
                <div className="py-20 text-center text-muted-foreground">Loading...</div>
              ) : leaderboard.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground">Belum ada data pembayaran untuk periode ini</p>
                </div>
              ) : (
                <>
                  {/* Top 3 Podium - Modern 3D */}
                  {leaderboard.length > 0 && leaderboard.length <= 3 && (
                    <div className="grid gap-6 md:grid-cols-3">
                      {leaderboard.map((payer, index) => (
                        <Card3D
                          key={payer.id}
                          glowColor={
                            index === 0
                              ? 'rgba(234, 179, 8, 0.5)'
                              : index === 1
                                ? 'rgba(156, 163, 175, 0.5)'
                                : 'rgba(249, 115, 22, 0.5)'
                          }
                        >
                          <div className="relative overflow-hidden p-8">
                            {/* Gradient background */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${getPodiumGradient(payer.rank)} opacity-5`}
                            />

                            <div className="relative text-center">
                              <div
                                className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${getPodiumGradient(payer.rank)} shadow-2xl`}
                              >
                                {index === 0 && <Trophy className="h-12 w-12 text-white" />}
                                {index === 1 && <Medal className="h-12 w-12 text-white" />}
                                {index === 2 && <Award className="h-12 w-12 text-white" />}
                              </div>
                              <div className="mb-2 text-4xl font-bold">#{payer.rank}</div>
                              <div className="mb-4 text-xl font-semibold">{payer.name}</div>
                              <div className="mb-2 text-3xl font-bold text-blue-500">
                                {formatCurrency(payer.amount)}
                              </div>
                              <div className="mb-4 text-sm text-muted-foreground">
                                {payer.count} transaksi
                              </div>
                              {payer.tier && (
                                <Badge
                                  className={`bg-gradient-to-r ${getTierColor(payer.tier)} border-0 text-white shadow-lg`}
                                >
                                  {payer.tier.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Card3D>
                      ))}
                    </div>
                  )}
                  
                  {/* Display for 4+ entries - show top 3 podium + rest as cards */}
                  {leaderboard.length > 3 && (
                    <>
                      <div className="grid gap-6 md:grid-cols-3">
                        {leaderboard.slice(0, 3).map((payer, index) => (
                          <Card3D
                            key={payer.id}
                            glowColor={
                              index === 0
                                ? 'rgba(234, 179, 8, 0.5)'
                                : index === 1
                                  ? 'rgba(156, 163, 175, 0.5)'
                                  : 'rgba(249, 115, 22, 0.5)'
                            }
                          >
                            <div className="relative overflow-hidden p-8">
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${getPodiumGradient(payer.rank)} opacity-5`}
                              />
                              <div className="relative text-center">
                                <div
                                  className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${getPodiumGradient(payer.rank)} shadow-2xl`}
                                >
                                  {index === 0 && <Trophy className="h-12 w-12 text-white" />}
                                  {index === 1 && <Medal className="h-12 w-12 text-white" />}
                                  {index === 2 && <Award className="h-12 w-12 text-white" />}
                                </div>
                                <div className="mb-2 text-4xl font-bold">#{payer.rank}</div>
                                <div className="mb-4 text-xl font-semibold">{payer.name}</div>
                                <div className="mb-2 text-3xl font-bold text-blue-500">
                                  {formatCurrency(payer.amount)}
                                </div>
                                <div className="mb-4 text-sm text-muted-foreground">
                                  {payer.count} transaksi
                                </div>
                                {payer.tier && (
                                  <Badge
                                    className={`bg-gradient-to-r ${getTierColor(payer.tier)} border-0 text-white shadow-lg`}
                                  >
                                    {payer.tier.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Card3D>
                        ))}
                      </div>

                  {/* Rest of Rankings - Modern Cards */}
                      <div className="space-y-3">
                        <div className="mb-6 text-center">
                          <Badge variant="secondary" className="text-sm">
                            Ranking Lengkap
                          </Badge>
                        </div>
                        {leaderboard.slice(3).map((payer) => (
                        <Card3D key={payer.id}>
                          <div className="relative overflow-hidden">
                            <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-blue-500/5 to-transparent" />
                            <div className="relative flex items-center gap-6 p-6">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-lg">
                                #{payer.rank}
                              </div>
                              <Avatar className="h-12 w-12 border-2 border-border">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                  {getInitials(payer.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-semibold">{payer.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {payer.count} transaksi
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-blue-500">
                                  {formatCurrency(payer.amount)}
                                </div>
                                {payer.tier && (
                                  <Badge
                                    variant="secondary"
                                    className={`mt-1.5 bg-gradient-to-r ${getTierColor(payer.tier)} border-0 text-xs text-white`}
                                  >
                                    {payer.tier.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card3D>
                      ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
