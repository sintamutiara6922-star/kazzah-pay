import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react'
import { getInitials, formatCurrency } from '@/lib/utils'

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
            <p className="mt-2 text-muted-foreground">
              Top donors dan contributors yang luar biasa
            </p>
          </div>

          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-7">
              <TabsTrigger value="realtime">Real-time</TabsTrigger>
              <TabsTrigger value="today">Hari Ini</TabsTrigger>
              <TabsTrigger value="week">Minggu Ini</TabsTrigger>
              <TabsTrigger value="month">Bulan Ini</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Tahun Ini</TabsTrigger>
              <TabsTrigger value="alltime">All-Time</TabsTrigger>
            </TabsList>

            {['realtime', 'today', 'week', 'month', 'quarter', 'year', 'alltime'].map((period) => (
              <TabsContent key={period} value={period}>
                <div className="space-y-4">
                  {/* Top 3 */}
                  <div className="grid gap-4 md:grid-cols-3">
                    {mockLeaderboard.slice(0, 3).map((donor, index) => (
                      <Card
                        key={donor.id}
                        className={
                          index === 0
                            ? 'border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5'
                            : ''
                        }
                      >
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                            {index === 0 && <Trophy className="h-10 w-10 text-white" />}
                            {index === 1 && <Medal className="h-10 w-10 text-white" />}
                            {index === 2 && <Award className="h-10 w-10 text-white" />}
                          </div>
                          <CardTitle className="text-2xl">#{donor.rank}</CardTitle>
                          <CardDescription className="text-base font-medium text-foreground">
                            {donor.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(donor.amount)}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {donor.count} transaksi
                          </p>
                          <Badge className="mt-4" variant="secondary">
                            {donor.tier}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Rest of leaderboard */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ranking</CardTitle>
                      <CardDescription>Top donors periode ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockLeaderboard.slice(3).map((donor) => (
                          <div
                            key={donor.id}
                            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold">
                                #{donor.rank}
                              </div>
                              <Avatar>
                                <AvatarFallback>{getInitials(donor.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{donor.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {donor.count} transaksi
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold tabular-nums">
                                  {formatCurrency(donor.amount)}
                                </p>
                                {donor.rankChange !== 0 && (
                                  <p className="flex items-center justify-end gap-1 text-xs">
                                    {donor.rankChange > 0 ? (
                                      <>
                                        <TrendingUp className="h-3 w-3 text-success" />
                                        <span className="text-success">+{donor.rankChange}</span>
                                      </>
                                    ) : (
                                      <>
                                        <TrendingDown className="h-3 w-3 text-destructive" />
                                        <span className="text-destructive">{donor.rankChange}</span>
                                      </>
                                    )}
                                  </p>
                                )}
                              </div>
                              <Badge variant="secondary">{donor.tier}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

const mockLeaderboard = [
  {
    id: '1',
    rank: 1,
    name: 'John Doe',
    amount: 5000000,
    count: 12,
    tier: 'Diamond',
    rankChange: 2,
  },
  {
    id: '2',
    rank: 2,
    name: 'Jane Smith',
    amount: 3500000,
    count: 8,
    tier: 'Platinum',
    rankChange: -1,
  },
  {
    id: '3',
    rank: 3,
    name: 'Bob Johnson',
    amount: 2000000,
    count: 15,
    tier: 'Platinum',
    rankChange: 1,
  },
  {
    id: '4',
    rank: 4,
    name: 'Alice Williams',
    amount: 1500000,
    count: 10,
    tier: 'Gold',
    rankChange: 0,
  },
  {
    id: '5',
    rank: 5,
    name: 'Charlie Brown',
    amount: 1200000,
    count: 7,
    tier: 'Gold',
    rankChange: 3,
  },
  {
    id: '6',
    rank: 6,
    name: 'Diana Prince',
    amount: 800000,
    count: 5,
    tier: 'Gold',
    rankChange: -2,
  },
  {
    id: '7',
    rank: 7,
    name: 'Edward Norton',
    amount: 500000,
    count: 4,
    tier: 'Silver',
    rankChange: 1,
  },
]
