// Payment Types
export type PaymentType = 'va' | 'ewallet' | 'bank' | 'qris'
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'expired'
  | 'cancel'

export interface PaymentMethod {
  metode: string  // Atlantic uses 'metode' field, e.g. 'QRIS', 'BCA', 'OVO'
  name: string
  type: PaymentType
  status: 'aktif' | 'non-aktif'  // Atlantic uses 'aktif' in Indonesian
  min: string | number
  max: string | number
  fee: string | number
  fee_persen: string | number
  img_url?: string
}

export interface Transaction {
  id: string
  reff_id: string
  nominal: number
  tambahan?: number
  fee: number
  get_balance: number
  type: PaymentType | 'payment' | 'donation'
  method: string
  status: PaymentStatus
  created_at: string
  expired_at: string
  paid_at?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  // Additional fields used in our app
  amount: number
  name: string
  email: string
  phone?: string
  message?: string
  invoiceCode: string
  createdAt: string
  updatedAt: string
  paymentData?: any
  // Type-specific fields from Atlantic API
  qr_string?: string
  qr_image?: string
  bank?: string
  tujuan?: string
  atas_nama?: string
  nomor_va?: string
  url?: string
}

// Donation Types
export interface Donation extends Transaction {
  donor_name: string
  message?: string
  anonymous: boolean
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  avatar?: string
  reactions?: {
    heart: number
    clap: number
    fire: number
  }
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  amount: number
  count: number
  avatar?: string
  tier?: string
  rankChange?: number
}

// API Response Types
export interface ApiResponse<T = any> {
  status: boolean
  data?: T
  code: number
  message: string
  errors?: Record<string, string[]>
  timestamp?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// Statistics Types
export interface Statistics {
  total_revenue: number
  total_transactions: number
  active_today: number
  success_rate: number
  pending_count: number
  failed_count: number
  average_transaction: number
}

// Admin Types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'superadmin'
  permissions: string[]
  last_login?: string
  created_at: string
}

export interface ApiKey {
  key: string
  label: string
  permissions: string[]
  environment: 'production' | 'sandbox'
  created_at: string
  last_used?: string
  request_count: number
  status: 'active' | 'revoked'
}

export interface IPWhitelist {
  ip: string
  label: string
  api_key: string
  added_by: string
  added_at: string
  last_used?: string
  request_count: number
  status: 'active' | 'inactive'
}

// Webhook Types
export interface WebhookPayload {
  event:
    | 'payment.pending'
    | 'payment.processing'
    | 'payment.success'
    | 'payment.failed'
    | 'payment.expired'
    | 'payment.cancel'
  timestamp: string
  data: Transaction
}

// Chart Data Types
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface MethodDistribution {
  method: string
  count: number
  amount: number
  percentage: number
  }
  
