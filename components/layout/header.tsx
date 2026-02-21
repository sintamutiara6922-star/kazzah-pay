'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, Zap, ArrowRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useState } from 'react'

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Donasi', href: '/donation' },
  { name: 'Pembayaran', href: '/payment' },
  { name: 'API Docs', href: '/docs' },
]

const leaderboardLinks = [
  { name: 'Leaderboard Donasi', href: '/leaderboard/donations' },
  { name: 'Leaderboard Pembayaran', href: '/leaderboard/payments' },
]

const mobileNavigation = [
  { name: 'Beranda', href: '/', group: 'MAIN' },
  { name: 'Donasi', href: '/donation', group: 'TRANSACTION' },
  { name: 'Pembayaran', href: '/payment', group: 'TRANSACTION' },
  { name: 'Leaderboard Donasi', href: '/leaderboard/donations', group: 'LEADERBOARD' },
  { name: 'Leaderboard Pembayaran', href: '/leaderboard/payments', group: 'LEADERBOARD' },
  { name: 'API Documentation', href: '/docs', group: 'DEVELOPER' },
  { name: 'Bantuan', href: '/help', group: 'SUPPORT' },
]

export function Header() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg group-hover:shadow-xl transition-shadow">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none">PaymentHub</span>
            <span className="text-xs text-primary font-semibold">Payment Gateway</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          
          {/* Leaderboard Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group" suppressHydrationWarning>
              Leaderboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-3 space-y-1">
              {leaderboardLinks.map((item) => (
                <DropdownMenuItem key={item.name} asChild className="cursor-pointer">
                  <Link href={item.href} className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            suppressHydrationWarning
            className="hover:bg-muted transition-colors"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button asChild className="hidden md:inline-flex bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all">
            <Link href="/admin" className="gap-1.5">
              Admin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" suppressHydrationWarning className="hover:bg-muted transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[60%] max-w-sm p-0 border-l">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="border-b px-6 py-4">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm">PaymentHub</span>
                  </div>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto">
                  {Object.entries(
                    mobileNavigation.reduce((acc, item) => {
                      if (!acc[item.group]) acc[item.group] = []
                      acc[item.group].push(item)
                      return acc
                    }, {} as Record<string, typeof mobileNavigation>)
                  ).map(([group, items], index) => (
                    <div key={group}>
                      <div className="px-6 py-3 bg-muted/40">
                        <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                          {group}
                        </h3>
                      </div>
                      <div className="space-y-0">
                        {items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors border-b border-border/50 last:border-b-0"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="border-t p-4 space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/admin">Admin Dashboard</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
