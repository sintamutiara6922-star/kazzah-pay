import { atlanticAPI } from './atlantic'
import { pakasirAPI } from './pakasir'
import type { PaymentMethod, Transaction, ApiResponse } from '@/types'

// Payment gateway selector based on environment variable
const PAYMENT_GATEWAY = process.env.PAYMENT_GATEWAY || 'atlantic'

console.log('[Yilzi] Payment Gateway selected:', PAYMENT_GATEWAY)

// Unified Payment Gateway Interface
interface IPaymentGateway {
  getMethods(params?: any): Promise<ApiResponse<PaymentMethod[]>>
  createDeposit(params: any): Promise<ApiResponse<Transaction>>
  getDepositStatus(id: string): Promise<ApiResponse<Transaction>>
  cancelDeposit(id: string): Promise<ApiResponse<any>>
}

// Atlantic Gateway Adapter
class AtlanticGateway implements IPaymentGateway {
  async getMethods(params?: { type?: string; metode?: string }) {
    return atlanticAPI.getMethods(params)
  }

  async createDeposit(params: {
    reff_id: string
    nominal: number
    type: 'va' | 'ewallet' | 'bank' | 'qris'
    metode: string
    customer_name?: string
    customer_email?: string
    customer_phone?: string
  }) {
    return atlanticAPI.createDeposit(params)
  }

  async getDepositStatus(id: string) {
    return atlanticAPI.getDepositStatus(id)
  }

  async cancelDeposit(id: string) {
    return atlanticAPI.cancelDeposit(id)
  }
}

// Pakasir Gateway Adapter
class PakasirGateway implements IPaymentGateway {
  async getMethods() {
    return pakasirAPI.getMethods()
  }

  async createDeposit(params: {
    reff_id: string
    nominal: number
    type: 'va' | 'ewallet' | 'bank' | 'qris'
    metode: string
    customer_name?: string
    customer_email?: string
    customer_phone?: string
  }) {
    // Convert Atlantic-style params to Pakasir format (QRIS only)
    return pakasirAPI.createTransaction({
      order_id: params.reff_id,
      amount: params.nominal,
      payment_method: 'qris', // Force QRIS
    })
  }

  async getDepositStatus(id: string, amount?: number) {
    // For Pakasir, we need amount to check status
    // Amount should be passed from the calling function
    return pakasirAPI.getTransactionStatus({
      order_id: id,
      amount: amount || 0,
    })
  }

  async cancelDeposit(id: string, amount?: number) {
    return pakasirAPI.cancelTransaction({
      order_id: id,
      amount: amount || 0,
    })
  }
}

// Factory function to get the appropriate gateway
function getPaymentGateway(): IPaymentGateway {
  switch (PAYMENT_GATEWAY.toLowerCase()) {
    case 'pakasir':
      return new PakasirGateway()
    case 'atlantic':
    default:
      return new AtlanticGateway()
  }
}

// Export unified API
export const paymentGateway = getPaymentGateway()
export const currentGateway = PAYMENT_GATEWAY

// Export gateway-specific APIs if needed
export { atlanticAPI, pakasirAPI }
