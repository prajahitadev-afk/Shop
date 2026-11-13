import { supabase } from '../lib/supabase'
import { createPaymentRecord } from './paymentService'

export type OrderItemPayload = {
  productId: string
  productName: string
  quantity: number
  price: number
}

export type OrderPayload = {
  id: string
  customerId?: string | null
  customerName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  shippingAddress?: string
  total: number
  status: string
  paymentStatus?: string
  paymentMethod?: string
  createdAt: string
  orderNumber?: string
  orderDate?: string
  expectedDelivery?: string
  createdBy?: string
  items?: OrderItemPayload[]
  itemCount?: number
}

const ORDER_STORAGE_KEY = 'prajahita-orders'

function readStoredOrders() {
  if (typeof window === 'undefined') return [] as Array<Record<string, unknown>>

  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY)
    return raw ? JSON.parse(raw) as Array<Record<string, unknown>> : []
  } catch {
    return []
  }
}

function writeStoredOrders(orders: Array<Record<string, unknown>>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
}

export async function loadOrdersFromDatabase(customerId: string) {
  if (!supabase) {
    return { success: false as const, orders: [] as Array<Record<string, unknown>>, error: 'Supabase is not configured.' }
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, created_at, status, customer_id')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return { success: false as const, orders: [], error: error.message }
    }

    return { success: true as const, orders: data ?? [] }
  } catch (error) {
    return { success: false as const, orders: [], error: error instanceof Error ? error.message : 'Unable to load orders.' }
  }
}

export async function saveOrderToDatabase(order: OrderPayload) {

  const createdAt = order.createdAt
  const orderNumber = order.orderNumber ?? order.id
  const shippingAddress = order.shippingAddress ?? JSON.stringify({
    fullName: order.customerName ?? '',
    phone: order.phone ?? '',
    addressLine1: order.address ?? '',
    city: order.city ?? '',
    state: order.state ?? '',
    pincode: order.pincode ?? '',
  })

  const fallbackOrders = readStoredOrders()
  const fallbackEntry = {
    id: order.id,
    order_number: orderNumber,
    order_date: order.orderDate ?? createdAt,
    expected_delivery: order.expectedDelivery ?? '',
    created_by: order.createdBy ?? '',
    customer_id: order.customerId ?? null,
    customer_name: order.customerName ?? '',
    email: order.email ?? '',
    phone: order.phone ?? '',
    address: order.address ?? '',
    city: order.city ?? '',
    state: order.state ?? '',
    pincode: order.pincode ?? '',
    shipping_address: shippingAddress,
    total_amount: order.total,
    status: order.status,
    payment_status: order.paymentStatus ?? 'Pending',
    created_at: createdAt,
    item_count: order.itemCount ?? 0,
    items: order.items ?? [],
  }

  if (!supabase) {
    writeStoredOrders([...fallbackOrders, fallbackEntry])
    return { success: true as const, storedLocally: true }
  }

  try {
    const payload = {
      id: order.id,
      order_number: orderNumber,
      order_date: order.orderDate ?? createdAt,
      expected_delivery: order.expectedDelivery ?? '',
      created_by: order.createdBy ?? '',
      customer_id: order.customerId ?? null,
      customer_name: order.customerName ?? '',
      email: order.email?.toLowerCase() ?? '',
      phone: order.phone ?? '',
      address: order.address ?? '',
      city: order.city ?? '',
      state: order.state ?? '',
      pincode: order.pincode ?? '',
      shipping_address: shippingAddress,
      total_amount: order.total,
      status: order.status,
      payment_status: order.paymentStatus ?? 'Pending',
      created_at: createdAt,
      item_count: order.itemCount ?? 0,
    }

    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert(payload)
      .select()
      .maybeSingle()

    if (orderError) {
      writeStoredOrders([...fallbackOrders, fallbackEntry])
      return { success: false as const, error: orderError.message, storedLocally: true }
    }

    const orderItems = (order.items ?? []).map((item, index) => ({
      id: `${order.id}-${index + 1}`,
      order_id: insertedOrder?.id ?? order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      created_at: createdAt,
    }))

    if (orderItems.length > 0) {
      const { error: itemError } = await supabase.from('order_items').insert(orderItems)
      if (itemError) {
        return { success: false as const, error: itemError.message, storedLocally: true }
      }
    }

    const paymentResult = await createPaymentRecord({
      orderId: insertedOrder?.id ?? order.id,
      amount: order.total,
      paymentMethod: order.paymentMethod ?? 'Cash on Delivery',
      status: 'Pending',
    })

    writeStoredOrders([...fallbackOrders, fallbackEntry])
    return paymentResult.success
      ? { success: true as const }
      : { success: false as const, error: paymentResult.error, storedLocally: true }
  } catch (error) {
    writeStoredOrders([...fallbackOrders, fallbackEntry])
    return { success: false as const, error: error instanceof Error ? error.message : 'Unable to save order.', storedLocally: true }
  }
}
