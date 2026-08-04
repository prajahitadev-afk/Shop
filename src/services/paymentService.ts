import { supabase } from '../lib/supabase'
import { generateUUID } from '../lib/uuid'

export type PaymentRecord = {
  id: string
  order_id: string
  payment_method: string
  amount: number
  status: 'Pending' | 'Paid' | 'Failed'
  created_at: string
}

export type CreatePaymentPayload = {
  orderId: string
  amount: number
  paymentMethod: string
  status?: 'Pending' | 'Paid' | 'Failed'
}

export async function createPaymentRecord(payload: CreatePaymentPayload) {
  const payment: PaymentRecord = {
    id: generateUUID(),
    order_id: payload.orderId,
    payment_method: payload.paymentMethod,
    amount: payload.amount,
    status: payload.status ?? 'Pending',
    created_at: new Date().toISOString(),
  }

  if (!supabase) {
    return { success: true as const, payment, storedLocally: true }
  }

  try {
    const { error } = await supabase.from('payments').insert(payment)
    if (error) {
      return { success: false as const, error: error.message, payment }
    }

    return { success: true as const, payment }
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unable to create payment record.', payment }
  }
}
