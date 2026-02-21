import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency to IDR
export function formatCurrency(amount: number): string {
  // Use manual formatting to avoid hydration mismatch
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `Rp${formatted}`
}

// Format number with thousand separators
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

// Format date/time
export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'time') {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(d)
  }

  if (format === 'long') {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

// Time ago helper
export function timeAgo(date: string | Date): string {
  const now = new Date()
  const past = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (seconds < 60) return `${seconds} detik lalu`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} minggu lalu`
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} bulan lalu`
  return `${Math.floor(seconds / 31536000)} tahun lalu`
}

// Generate unique ID
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`
}

// Calculate fee
export function calculateFee(amount: number, fee: number, feePercent: number): number {
  return fee + Math.floor((amount * feePercent) / 100)
}

// Get donation tier
export function getDonationTier(amount: number): 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null {
  if (amount >= 1000001) return 'diamond'
  if (amount >= 500001) return 'platinum'
  if (amount >= 100001) return 'gold'
  if (amount >= 50001) return 'silver'
  if (amount >= 10000) return 'bronze'
  return null
}

// Validate email
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Sanitize input (XSS prevention)
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    return false
  }
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100 * 10) / 10
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
