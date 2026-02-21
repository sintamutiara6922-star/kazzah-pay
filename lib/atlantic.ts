import { ATLANTIC_ENDPOINTS } from './constants'
import type { PaymentMethod, Transaction, ApiResponse } from '@/types'

// Atlantic H2H API Configuration - Only requires API Key
const API_KEY = process.env.ATLANTIC_API_KEY || 'PAzqva90XEwUtkB7sbnL4Ct27boeQNvv254vBGF7oyn5895uLlwwa0OXTFrB8wyEJMu5Hpk4ga7b4BrrQ3xJooOOadkldrmOvG5N'
const BASE_URL = 'https://atlantich2h.com'

console.log('[Yilzi] Atlantic API initialized with key:', API_KEY ? '***' + API_KEY.slice(-4) : 'NOT_SET')

interface CreateDepositParams {
  reff_id: string
  nominal: number
  type: 'va' | 'ewallet' | 'bank' | 'qris'
  metode: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
}

interface AtlanticDepositResponse {
  status: boolean
  data: {
    id: string
    reff_id: string
    nominal: number
    tambahan: number
    fee: number
    get_balance: number
    qr_string: string
    qr_image: string
    status: 'pending' | 'success' | 'expired' | 'failed' | 'processing' | 'cancel'
    created_at: string
    expired_at: string
  }
  code: number
  message?: string
}

class AtlanticAPI {
  private async request<T>(
    endpoint: string,
    data: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      // Build request body with api_key first (matching working example)
      const requestBody: Record<string, any> = {
        api_key: API_KEY,
        ...data
      }

      // Remove undefined, null, or empty string values
      Object.keys(requestBody).forEach(key => {
        if (requestBody[key] === undefined || requestBody[key] === null || requestBody[key] === '') {
          delete requestBody[key]
        }
      })

      console.log('[Yilzi] Atlantic API Request:', {
        endpoint,
        params: { ...requestBody, api_key: '***' }
      })

      // Convert to URLSearchParams for proper form encoding
      const formData = new URLSearchParams()
      Object.entries(requestBody).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
      
      const url = `${BASE_URL}${endpoint}`
      
      console.log('[Yilzi] Sending request to:', url)
      console.log('[Yilzi] Request body:', formData.toString().replace(API_KEY, '***'))

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      const result = await response.json()
      
      console.log('[Yilzi] Atlantic API Response:', {
        endpoint,
        status: result.status,
        code: result.code || response.status,
        message: result.message,
        hasData: !!result.data
      })

      if (!result.status) {
        console.error('[Yilzi] Atlantic API Error Response:', result)
      }

      return {
        status: result.status || false,
        data: result.data,
        code: result.code || response.status,
        message: result.message || 'Request completed',
      }
    } catch (error) {
      console.error('[Yilzi] Atlantic API Error:', error)
      return {
        status: false,
        code: 500,
        message: 'Internal server error',
      }
    }
  }

  // Get available payment methods
  async getMethods(params?: {
    type?: string
    metode?: string
  }): Promise<ApiResponse<PaymentMethod[]>> {
    console.log('[Yilzi] Getting payment methods with filters:', params)
    return this.request<PaymentMethod[]>('/deposit/metode', params || {})
  }

  // Create new deposit
  async createDeposit(
    params: CreateDepositParams
  ): Promise<ApiResponse<Transaction>> {
    console.log('[Yilzi] Creating deposit:', {
      reff_id: params.reff_id,
      nominal: params.nominal,
      type: params.type,
      metode: params.metode
    })
    return this.request<Transaction>('/deposit/create', params)
  }

  // Check deposit status (regular check)
  async getDepositStatus(id: string): Promise<ApiResponse<Transaction>> {
    console.log('[Yilzi] Checking deposit status:', id)
    return this.request<Transaction>('/deposit/status', { id })
  }

  // Check instant deposit fee (action=false) or process instant deposit (action=true)
  // Use this for deposits with status "processing" to make them instant
  async instantDeposit(
    id: string,
    action: boolean = false
  ): Promise<
    ApiResponse<{
      id: string
      reff_id: string
      nominal: number
      penanganan: number
      total_fee: number
      total_diterima: number
      status: string
      created_at: string
    }>
  > {
    console.log('[Yilzi] Instant deposit request:', { id, action })
    return this.request('/deposit/instant', {
      id,
      action: action.toString(),
    })
  }

  // Cancel deposit
  async cancelDeposit(id: string): Promise<ApiResponse<{ id: string; status: string; created_at: string }>> {
    console.log('[Yilzi] Canceling deposit:', id)
    return this.request<{ id: string; status: string; created_at: string }>(
      '/deposit/cancel',
      { id }
    )
  }

  // Get profile
  async getProfile(): Promise<ApiResponse<{
    name: string
    username: string
    email: string
    phone: string
    balance: string
    status: string
  }>> {
    console.log('[Yilzi] Getting Atlantic profile')
    return this.request('/get_profile', {})
  }
}

export const atlanticAPI = new AtlanticAPI()

// Mock data for development (when API key is not configured)
// Updated to match Atlantic H2H API response format
export const mockPaymentMethods: PaymentMethod[] = [
  {
    metode: 'QRIS',
    name: 'QRIS',
    type: 'qris',
    min: 1000,
    max: 50000000,
    fee: 0,
    fee_persen: 0.7,
    status: 'aktif',
    img_url: '/images/qris.png',
  },
  {
    metode: 'DANA',
    name: 'DANA',
    type: 'ewallet',
    min: 10000,
    max: 10000000,
    fee: 1500,
    fee_persen: 0,
    status: 'aktif',
    img_url: '/images/ewallet/dana.png',
  },
  {
    metode: 'OVO',
    name: 'OVO',
    type: 'ewallet',
    min: 10000,
    max: 10000000,
    fee: 1500,
    fee_persen: 0,
    status: 'aktif',
    img_url: '/images/ewallet/ovo.png',
  },
  {
    metode: 'GOPAY',
    name: 'GoPay',
    type: 'ewallet',
    min: 10000,
    max: 10000000,
    fee: 1500,
    fee_persen: 0,
    status: 'aktif',
    img_url: '/images/ewallet/gopay.png',
  },
  {
    metode: 'BCA',
    name: 'Bank BCA',
    type: 'va',
    min: 10000,
    max: 50000000,
    fee: 0,
    fee_persen: 0,
    status: 'aktif',
    img_url: '/images/banks/bca.png',
  },
  {
    metode: 'MANDIRI',
    name: 'Bank Mandiri',
    type: 'va',
    min: 10000,
    max: 50000000,
    fee: 0,
    fee_persen: 0,
    status: 'aktif',
    img_url: '/images/banks/mandiri.png',
  },
  {
    metode: 'BNI',
    name: 'Bank BNI',
    type: 'va',
    min: 10000,
    max: 50000000,
    fee: 2750,
    fee_persen: 0,
    status: 'aktif',
    img_url: '/images/banks/bni.png',
  },
  {
    metode: 'BRI',
    name: 'Bank BRI',
    type: 'va',
    min: 10000,
    max: 50000000,
    fee: 2750,
    fee_persen: 0,
    status: 'aktif',
    img_url: '/images/banks/bri.png',
  },
]
        
