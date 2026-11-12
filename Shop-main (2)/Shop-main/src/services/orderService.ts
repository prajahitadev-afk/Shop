import { supabase } from '../lib/supabase'
import { generateUUID } from '../lib/uuid'
import type { OrderRecord } from '../types/order'

export type CreateOrderPayload = {
  id: string
  orderNumber: string
  customerId: string
  orderDate: string
  expectedDelivery: string
  status?: string
  paymentStatus?: string
  paymentMethod?: string
  shippingAddress?: string
  totalAmount: number
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}

const fallbackOrders: OrderRecord[] = []
const REQUEST_TIMEOUT_MS = 15000

async function withTimeout<T>(request: PromiseLike<T>, message: string) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), REQUEST_TIMEOUT_MS)
  })

  try {
    return await Promise.race([Promise.resolve(request), timeout])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

export async function getOrders() {
  if (!supabase) return fallbackOrders

  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })

  if (error) {
    return fallbackOrders
  }

  return (data ?? []) as OrderRecord[]
}

export async function createOrder(payload: CreateOrderPayload) {
  if (!supabase) {
    return { success: false as const, error: 'Supabase is not configured.' }
  }

  try {
    const { data: createdOrder, error: orderError } = await withTimeout(
      supabase
        .from('orders')
        .insert({
          id: payload.id,
          order_number: payload.orderNumber,
          customer_id: payload.customerId,
          order_date: payload.orderDate,
          expected_delivery: payload.expectedDelivery,
          status: payload.status ?? 'Confirmed',
          total_amount: payload.totalAmount,
          payment_status: payload.paymentStatus ?? 'Pending',
          payment_method: payload.paymentMethod ?? 'cod',
          shipping_address: payload.shippingAddress ?? '',
          created_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle(),
      'Order save timed out. Please try again.',
    )

    console.log('ORDER_INSERT_RESULT', { orderError: orderError?.message ?? null, createdOrder })
    console.log('ORDER_ID', createdOrder?.id ?? null)

    if (orderError || !createdOrder) {
      return { success: false as const, error: orderError?.message ?? 'Unable to create order.' }
    }

    const orderItemsPayload = payload.items.map(item => ({
      id: generateUUID(),
      order_id: createdOrder.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
    }))

    console.log('ORDER_ITEMS_PAYLOAD', { orderId: createdOrder.id, items: orderItemsPayload })

    if (orderItemsPayload.length > 0) {
      const { data: insertedItems, error: itemError } = await withTimeout(
        supabase
          .from('order_items')
          .insert(orderItemsPayload)
          .select(),
        'Order items save timed out. Please try again.',
      )

      console.log('ORDER_ITEMS_INSERT_RESULT', { insertedItems, itemError: itemError?.message ?? null })

      if (itemError) {
        console.log('ORDER_ITEMS_ERROR', {
          message: itemError.message,
          code: itemError.code,
          details: itemError.details,
          hint: itemError.hint,
        })
        return { success: false as const, error: itemError.message }
      }

      return {
        success: true as const,
        order: createdOrder as OrderRecord,
        items: orderItemsPayload,
      }
    }

    return {
      success: true as const,
      order: createdOrder as OrderRecord,
      items: [],
    }
  } catch (error) {
    console.log('ORDER_ITEMS_ERROR', { message: error instanceof Error ? error.message : 'Unable to create order.' })
    return { success: false as const, error: error instanceof Error ? error.message : 'Unable to create order.' }
  }
}
