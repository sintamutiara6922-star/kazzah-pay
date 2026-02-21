import { z } from 'zod'
import { PAYMENT_CONFIG, REGEX_PATTERNS } from './constants'

// Payment schemas
export const createPaymentSchema = z.object({
  reff_id: z
    .string()
    .min(3, 'Reference ID minimal 3 karakter')
    .max(50, 'Reference ID maksimal 50 karakter')
    .regex(REGEX_PATTERNS.alphanumeric, 'Reference ID hanya boleh huruf, angka, dash, dan underscore'),
  nominal: z
    .number()
    .min(1000, 'Minimal pembayaran Rp 1.000')
    .max(PAYMENT_CONFIG.maxAmount, `Maksimal pembayaran Rp ${PAYMENT_CONFIG.maxAmount.toLocaleString('id-ID')}`),
  type: z.enum(['va', 'ewallet', 'bank', 'qris'], {
    errorMap: () => ({ message: 'Tipe pembayaran tidak valid' }),
  }),
  method: z.string().min(1, 'Metode pembayaran harus dipilih'),
  customer_name: z.string().min(3).max(100).optional(),
  customer_email: z.string().email('Email tidak valid').optional(),
  customer_phone: z
    .string()
    .regex(REGEX_PATTERNS.phone, 'Nomor telepon tidak valid')
    .optional(),
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>

// Donation schemas
export const createDonationSchema = z.object({
  nominal: z
    .number()
    .min(1000, 'Minimal donasi Rp 1.000')
    .max(PAYMENT_CONFIG.maxAmount, `Maksimal donasi Rp ${PAYMENT_CONFIG.maxAmount.toLocaleString('id-ID')}`),
  type: z.enum(['va', 'ewallet', 'bank', 'qris']),
  method: z.string().min(1),
  donor_name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(50, 'Nama maksimal 50 karakter'),
  donor_email: z.string().email('Email tidak valid').optional(),
  message: z.string().max(500, 'Pesan maksimal 500 karakter').optional(),
  anonymous: z.boolean().default(false),
})

export type CreateDonationInput = z.infer<typeof createDonationSchema>

// Admin schemas
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const createApiKeySchema = z.object({
  label: z
    .string()
    .min(3, 'Label minimal 3 karakter')
    .max(50, 'Label maksimal 50 karakter'),
  permissions: z.array(z.string()).min(1, 'Minimal 1 permission'),
  environment: z.enum(['production', 'sandbox']),
  expires_at: z.string().optional(),
})

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>

export const addIPWhitelistSchema = z.object({
  ip: z.string().regex(REGEX_PATTERNS.ip, 'Format IP address tidak valid'),
  label: z.string().min(3).max(100),
  api_key: z.string().min(1),
  expires_at: z.string().optional(),
})

export type AddIPWhitelistInput = z.infer<typeof addIPWhitelistSchema>

// Query schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const transactionFilterSchema = paginationSchema.extend({
  status: z.enum(['pending', 'processing', 'success', 'failed', 'expired', 'cancelled']).optional(),
  type: z.enum(['va', 'ewallet', 'bank', 'qris']).optional(),
  method: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  search: z.string().optional(),
})

export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>

export const leaderboardQuerySchema = z.object({
  type: z.enum(['donors', 'payments']).default('donors'),
  period: z.enum(['realtime', 'today', 'week', 'month', 'quarter', 'year', 'alltime']).default('today'),
  limit: z.number().int().min(1).max(100).default(10),
})

export type LeaderboardQueryInput = z.infer<typeof leaderboardQuerySchema>
