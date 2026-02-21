// App Configuration
export const APP_CONFIG = {
  name: 'PaymentHub',
  description: 'Enterprise Payment Gateway & Donation Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://paymenthub.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
} as const

// Payment Configuration
export const PAYMENT_CONFIG = {
  minAmount: Number(process.env.PAYMENT_MIN_AMOUNT) || 1000,
  maxAmount: Number(process.env.PAYMENT_MAX_AMOUNT) || 10000000,
  expiryMinutes: Number(process.env.PAYMENT_EXPIRY_MINUTES) || 60,
  defaultFeePercent: Number(process.env.DEFAULT_FEE_PERCENT) || 0,
} as const

// Donation Tiers
export const DONATION_TIERS = {
  bronze: { min: 10000, max: 50000, label: 'Bronze', color: '#CD7F32' },
  silver: { min: 50001, max: 100000, label: 'Silver', color: '#C0C0C0' },
  gold: { min: 100001, max: 500000, label: 'Gold', color: '#FFD700' },
  platinum: { min: 500001, max: 1000000, label: 'Platinum', color: '#E5E4E2' },
  diamond: { min: 1000001, max: Infinity, label: 'Diamond', color: '#B9F2FF' },
} as const

// Quick Amount Presets (in IDR)
// Atlantic H2H accepts any amount from Rp100 upwards
export const QUICK_AMOUNTS = [
  1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000,
] as const

// Payment Method Icons/Logos
export const PAYMENT_METHODS = {
  // E-Wallets
  DANA: { name: 'DANA', type: 'ewallet', icon: '💳' },
  OVO: { name: 'OVO', type: 'ewallet', icon: '💳' },
  GOPAY: { name: 'GoPay', type: 'ewallet', icon: '💳' },
  SHOPEEPAY: { name: 'ShopeePay', type: 'ewallet', icon: '💳' },
  LINKAJA: { name: 'LinkAja', type: 'ewallet', icon: '💳' },

  // Banks
  BCA: { name: 'Bank BCA', type: 'bank', icon: '🏦' },
  MANDIRI: { name: 'Bank Mandiri', type: 'bank', icon: '🏦' },
  BNI: { name: 'Bank BNI', type: 'bank', icon: '🏦' },
  BRI: { name: 'Bank BRI', type: 'bank', icon: '🏦' },
  PERMATA: { name: 'Bank Permata', type: 'bank', icon: '🏦' },
  CIMB: { name: 'Bank CIMB', type: 'bank', icon: '🏦' },

  // Virtual Accounts
  VA_BCA: { name: 'VA BCA', type: 'va', icon: '🏦' },
  VA_MANDIRI: { name: 'VA Mandiri', type: 'va', icon: '🏦' },
  VA_BNI: { name: 'VA BNI', type: 'va', icon: '🏦' },
  VA_BRI: { name: 'VA BRI', type: 'va', icon: '🏦' },
  VA_PERMATA: { name: 'VA Permata', type: 'va', icon: '🏦' },

  // QRIS
  QRIS: { name: 'QRIS', type: 'qris', icon: '📱' },
} as const

// Status Colors
export const STATUS_COLORS = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: '⏳' },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: '⚙️' },
  success: { bg: 'bg-green-500/10', text: 'text-green-500', icon: '✓' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-500', icon: '✗' },
  expired: { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: '⌛' },
  cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: '⊘' },
} as const

// Rate Limiting
export const RATE_LIMITS = {
  api: {
    requests: Number(process.env.RATE_LIMIT_REQUESTS) || 100,
    window: Number(process.env.RATE_LIMIT_WINDOW) || 60,
  },
  ipRequests: 1000,
  ipWindow: 3600,
} as const

// Leaderboard Periods
export const LEADERBOARD_PERIODS = [
  { key: 'realtime', label: 'Real-time', duration: 'Last Hour' },
  { key: 'today', label: 'Today', duration: 'Today' },
  { key: 'week', label: 'This Week', duration: 'Mon-Sun' },
  { key: 'month', label: 'This Month', duration: 'Current Month' },
  { key: 'quarter', label: 'This Quarter', duration: 'Q1/Q2/Q3/Q4' },
  { key: 'year', label: 'This Year', duration: 'Current Year' },
  { key: 'alltime', label: 'All-Time', duration: 'All Time' },
] as const

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key',
  IP_NOT_WHITELISTED: 'IP address not whitelisted',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Try again later',
  INVALID_AMOUNT: 'Invalid amount',
  METHOD_NOT_AVAILABLE: 'Payment method not available',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  PAYMENT_EXPIRED: 'Payment has expired',
  UNAUTHORIZED: 'Unauthorized access',
  SERVER_ERROR: 'Internal server error',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  PAYMENT_CREATED: 'Payment created successfully',
  PAYMENT_CONFIRMED: 'Payment confirmed successfully',
  PAYMENT_CANCELLED: 'Payment cancelled successfully',
  DONATION_RECEIVED: 'Thank you for your donation!',
} as const

// Regex Patterns
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+62|62|0)[0-9]{9,13}$/,
  alphanumeric: /^[a-zA-Z0-9-_]+$/,
  ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
} as const

// API Endpoints (Atlantic H2H)
export const ATLANTIC_ENDPOINTS = {
  base: process.env.ATLANTIC_BASE_URL || 'https://atlantich2h.com',
  methods: '/deposit/metode',
  create: '/deposit/create',
  status: '/deposit/status',
  cancel: '/deposit/cancel',
  instant: '/deposit/instant',
} as const
