import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type RazorpayCartItem = {
  productId: string
  quantity: number
}

export type RazorpayShippingAddress = {
  fullName: string
  phone: string
  addressLine1: string
  city: string
  state: string
  pincode: string
  country: string
}

export type RazorpayOrder = {
  orderId: string
  orderNumber: string
  amount: number
  currency: 'INR'
  keyId: string
}

export type RazorpayPaymentResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayCheckoutOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: { color: string }
  handler: (response: RazorpayPaymentResponse) => void
  modal: { ondismiss: () => void }
}

type RazorpayCheckout = {
  open: () => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckout
  }
}

async function loadRazorpayCheckout() {
  if (window.Razorpay) return

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]')
    const script = existingScript ?? document.createElement('script')

    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Could not load Razorpay Checkout. Please try again.')), { once: true })

    if (!existingScript) {
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.dataset.razorpayCheckout = 'true'
      document.body.appendChild(script)
    }
  })

  if (!window.Razorpay) {
    throw new Error('Razorpay Checkout did not initialize. Please try again.')
  }
}

async function invokeRazorpay<T>(body: Record<string, unknown>) {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase.functions.invoke<T>('razorpay', { body })
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const responseBody: unknown = await error.context.json()
      if (typeof responseBody === 'object' && responseBody !== null
        && 'error' in responseBody && typeof responseBody.error === 'string') {
        throw new Error(responseBody.error)
      }
    }
    throw new Error(error.message)
  }
  if (!data) {
    throw new Error('The payment service returned an empty response.')
  }
  return data
}

export async function createRazorpayOrder(payload: {
  customerId: string
  items: RazorpayCartItem[]
  couponCode: string
  shippingAddress: RazorpayShippingAddress
}) {
  return invokeRazorpay<RazorpayOrder>({
    action: 'create-order',
    ...payload,
  })
}

export async function verifyRazorpayPayment(payment: RazorpayPaymentResponse) {
  return invokeRazorpay<{
    orderId: string
    orderNumber: string
    orderDate: string
    totalAmount: number
    paymentStatus: 'Paid'
  }>({
    action: 'verify-payment',
    ...payment,
  })
}

export async function openRazorpayCheckout(options: {
  order: RazorpayOrder
  customerName: string
  customerEmail: string
  customerPhone: string
  onSuccess: (payment: RazorpayPaymentResponse) => void
  onDismiss: () => void
}) {
  await loadRazorpayCheckout()

  const Checkout = window.Razorpay
  if (!Checkout) {
    throw new Error('Razorpay Checkout did not initialize. Please try again.')
  }

  new Checkout({
    key: options.order.keyId,
    amount: Math.round(options.order.amount * 100),
    currency: options.order.currency,
    name: 'Prajahita',
    description: `Order ${options.order.orderNumber}`,
    order_id: options.order.orderId,
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone,
    },
    theme: { color: '#567051' },
    handler: options.onSuccess,
    modal: { ondismiss: options.onDismiss },
  }).open()
}
