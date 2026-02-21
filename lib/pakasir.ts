import type { PaymentMethod, Transaction, ApiResponse } from '@/types'

// Pakasir API Configuration  
const API_KEY = process.env.PAKASIR_API_KEY || 'fCUeGsS0vOxX2HKsgWJGfTzZJGkWCfAp'
const PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || ''
const BASE_URL = 'https://app.pakasir.com/api'

console.log('[Yilzi] Pakasir API initialized with key:', API_KEY ? '***' + API_KEY.slice(-4) : 'NOT_SET')
console.log('[Yilzi] Pakasir project slug:', PROJECT_SLUG || 'NOT_SET')

interface PakasirCreateParams {
  project: string
  order_id: string
  amount: number
  api_key: string
}

interface PakasirTransactionResponse {
  payment: {
    project: string
    order_id: string
    amount: number
    fee: number
    total_payment: number
    payment_method: string
    payment_number: string
    expired_at: string
  }
}

interface PakasirTransactionDetailResponse {
  transaction: {
    amount: number
    order_id: string
    project: string
    status: 'pending' | 'completed' | 'expired' | 'cancelled' | 'canceled'
    payment_method: string
    completed_at?: string
  }
}

// Map Pakasir payment methods to our internal format
const pakasirMethodMap: Record<string, { type: string; name: string; img: string }> = {
  'qris': { type: 'qris', name: 'QRIS', img: '/images/qris.png' },
  'bni_va': { type: 'va', name: 'Bank BNI', img: '/images/banks/bni.png' },
  'bri_va': { type: 'va', name: 'Bank BRI', img: '/images/banks/bri.png' },
  'cimb_niaga_va': { type: 'va', name: 'Bank CIMB Niaga', img: '/images/banks/cimb.png' },
  'mandiri_va': { type: 'va', name: 'Bank Mandiri', img: '/images/banks/mandiri.png' },
  'permata_va': { type: 'va', name: 'Bank Permata', img: '/images/banks/permata.png' },
  'maybank_va': { type: 'va', name: 'Bank Maybank', img: '/images/banks/maybank.png' },
  'sampoerna_va': { type: 'va', name: 'Bank Sampoerna', img: '/images/banks/sampoerna.png' },
  'bnc_va': { type: 'va', name: 'Bank BNC', img: '/images/banks/bnc.png' },
  'atm_bersama_va': { type: 'va', name: 'ATM Bersama', img: '/images/banks/atm-bersama.png' },
  'artha_graha_va': { type: 'va', name: 'Bank Artha Graha', img: '/images/banks/artha-graha.png' },
}

class PakasirAPI {
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    data?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      console.log('[Yilzi] Pakasir API Request:', {
        endpoint,
        method,
        params: data ? { ...data, api_key: '***' } : undefined
      })

      const url = `${BASE_URL}${endpoint}`
      
      let fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (method === 'POST' && data) {
        fetchOptions.body = JSON.stringify(data)
      }

      console.log('[Yilzi] Sending request to:', url)

      const response = await fetch(url, fetchOptions)
      const result = await response.json()
      
      console.log('[Yilzi] Pakasir API Response:', {
        endpoint,
        status: response.ok,
        statusCode: response.status,
        hasData: !!result.payment || !!result.transaction
      })

      if (!response.ok) {
        console.error('[Yilzi] Pakasir API Error Response:', result)
        return {
          status: false,
          code: response.status,
          message: result.message || 'Request failed',
        }
      }

      return {
        status: true,
        data: result,
        code: response.status,
        message: 'Success',
      }
    } catch (error) {
      console.error('[Yilzi] Pakasir API Error:', error)
      return {
        status: false,
        code: 500,
        message: 'Internal server error',
      }
    }
  }

  // Get available payment methods (QRIS only - matching Atlantic format)
  async getMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    console.log('[Yilzi] Getting Pakasir payment methods (QRIS only)')
    
    // Return only QRIS method to match Atlantic behavior
    const methods: PaymentMethod[] = [{
      metode: 'QRIS',
      name: 'QRIS',
      type: 'qris',
      min: 1000,
      max: 50000000,
      fee: 0,
      fee_persen: 1.013,
      status: 'aktif',
      img_url: '/images/qris.png',
    }]

    return {
      status: true,
      data: methods,
      code: 200,
      message: 'Success',
    }
  }

  // Create new transaction (QRIS only)
  async createTransaction(params: {
    order_id: string
    amount: number
    payment_method: string
  }): Promise<ApiResponse<Transaction>> {
    // Validate required config
    if (!PROJECT_SLUG) {
      console.error('[Yilzi] PAKASIR_PROJECT_SLUG is not set!')
      return {
        status: false,
        code: 500,
        message: 'Pakasir project slug not configured',
      }
    }

    if (!API_KEY) {
      console.error('[Yilzi] PAKASIR_API_KEY is not set!')
      return {
        status: false,
        code: 500,
        message: 'Pakasir API key not configured',
      }
    }

    console.log('[Yilzi] Creating Pakasir QRIS transaction:', {
      order_id: params.order_id,
      amount: params.amount,
      slug: PROJECT_SLUG
    })

    const requestBody: PakasirCreateParams = {
      project: PROJECT_SLUG,
      order_id: params.order_id,
      amount: params.amount,
      api_key: API_KEY,
    }

    // Force QRIS method - sesuai docs Pakasir
    const response = await this.request<PakasirTransactionResponse>(
      '/transactioncreate/qris',
      'POST',
      requestBody
    )

    console.log('[Yilzi] Pakasir createTransaction response received:', {
      success: response.status,
      hasPayment: response.data ? 'yes' : 'no',
      code: response.code
    })

    if (!response.status || !response.data) {
      console.error('[Yilzi] Failed to create Pakasir transaction:', response.message)
      return {
        status: false,
        code: response.code,
        message: response.message || 'Failed to create transaction',
      }
    }

    // Transform Pakasir response to match Atlantic Transaction format exactly
    const pakasirData = response.data as PakasirTransactionResponse
    
    console.log('[Yilzi] Pakasir payment details:', {
      order_id: pakasirData.payment.order_id,
      amount: pakasirData.payment.amount,
      total_payment: pakasirData.payment.total_payment,
      payment_method: pakasirData.payment.payment_method,
      has_payment_number: !!pakasirData.payment.payment_number,
      payment_number_length: pakasirData.payment.payment_number?.length || 0,
      expired_at: pakasirData.payment.expired_at,
    })
    
    // Validasi payment_number
    if (!pakasirData.payment.payment_number) {
      console.error('[Yilzi] Pakasir response missing payment_number!', pakasirData)
      return {
        status: false,
        code: 400,
        message: 'Pakasir API returned invalid response: no payment_number',
      }
    }

    // Generate QR code image URL dari string payment_number - sesuai docs Pakasir
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(pakasirData.payment.payment_number)}&size=400&margin=2`
    
    console.log('[Yilzi] Generated QR image URL for QRIS scanning')
    
    const transaction: Transaction = {
      id: pakasirData.payment.order_id,
      reff_id: pakasirData.payment.order_id,
      nominal: pakasirData.payment.amount,
      tambahan: pakasirData.payment.fee,
      fee: pakasirData.payment.fee,
      get_balance: pakasirData.payment.total_payment,
      qr_string: pakasirData.payment.payment_number, // Raw QRIS string for scanning
      qr_image: qrImageUrl, // Generated QR image URL (quickchart.io)
      status: 'pending',
      type: 'qris',
      method: 'QRIS',
      name: '',
      amount: pakasirData.payment.amount,
      email: '',
      invoiceCode: '',
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expired_at: pakasirData.payment.expired_at,
    }

    console.log('[Yilzi] Transaction created successfully:', {
      id: transaction.id,
      qr_string_exists: !!transaction.qr_string,
      qr_image_exists: !!transaction.qr_image,
      status: transaction.status,
      expired_at: transaction.expired_at,
    })

    return {
      status: true,
      data: transaction,
      code: 200,
      message: 'Success',
    }
  }

  // Check transaction status
  async getTransactionStatus(params: {
    order_id: string
    amount: number
  }): Promise<ApiResponse<Transaction>> {
    console.log('[Yilzi] Checking Pakasir transaction status:', params.order_id)

    const url = `/transactiondetail?project=${PROJECT_SLUG}&amount=${params.amount}&order_id=${params.order_id}&api_key=${API_KEY}`
    
    const response = await this.request<PakasirTransactionDetailResponse>(
      url,
      'GET'
    )

    if (!response.status || !response.data) {
      return {
        status: false,
        code: response.code,
        message: response.message || 'Failed to get transaction status',
      }
    }

    // Transform Pakasir response to match Atlantic format exactly
    const pakasirData = response.data as PakasirTransactionDetailResponse
    const transaction: Transaction = {
      id: pakasirData.transaction.order_id,
      reff_id: pakasirData.transaction.order_id,
      nominal: pakasirData.transaction.amount,
      tambahan: 0,
      fee: 0,
      get_balance: pakasirData.transaction.amount,
      qr_string: '',
      qr_image: '',
      type: 'qris',
      method: 'QRIS',
      name: '',
      amount: pakasirData.transaction.amount,
      email: '',
      invoiceCode: '',
      status: pakasirData.transaction.status === 'completed' ? 'success' 
        : (pakasirData.transaction.status === 'cancelled' || pakasirData.transaction.status === 'canceled') ? 'cancel' 
        : pakasirData.transaction.status,
      created_at: pakasirData.transaction.completed_at || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expired_at: '',
    }

    return {
      status: true,
      data: transaction,
      code: 200,
      message: 'Success',
    }
  }

  // Cancel transaction
  async cancelTransaction(params: {
    order_id: string
    amount: number
  }): Promise<ApiResponse<{ id: string; status: string }>> {
    console.log('[Yilzi] Canceling Pakasir transaction:', params.order_id)

    const requestBody = {
      project: PROJECT_SLUG,
      order_id: params.order_id,
      amount: params.amount,
      api_key: API_KEY,
    }

    const response = await this.request<any>(
      '/transactioncancel',
      'POST',
      requestBody
    )

    if (!response.status) {
      return response as ApiResponse<{ id: string; status: string }>
    }

    return {
      status: true,
      data: { id: params.order_id, status: 'cancelled' },
      code: 200,
      message: 'Transaction cancelled',
    }
  }

  // Payment simulation (for sandbox/testing)
  async simulatePayment(params: {
    order_id: string
    amount: number
  }): Promise<ApiResponse<any>> {
    console.log('[Yilzi] Simulating Pakasir payment:', params.order_id)

    const requestBody = {
      project: PROJECT_SLUG,
      order_id: params.order_id,
      amount: params.amount,
      api_key: API_KEY,
    }

    return this.request<any>('/paymentsimulation', 'POST', requestBody)
  }
}

export const pakasirAPI = new PakasirAPI()

// Mock payment methods for development
export const mockPakasirMethods: PaymentMethod[] = Object.entries(pakasirMethodMap).map(([key, value]) => ({
  metode: key.toUpperCase(),
  name: value.name,
  type: value.type as 'va' | 'ewallet' | 'bank' | 'qris',
  min: 1000,
  max: 50000000,
  fee: 0,
  fee_persen: 0,
  status: 'aktif',
  img_url: value.img,
}))
