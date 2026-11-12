import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const couponDiscounts: Record<string, number> = {
  HERBAL10: 0.1,
  NATURAL20: 0.2,
  FIRSTBUY15: 0.15,
  WELLNESS25: 0.25,
}

type CartItemInput = {
  productId: string
  quantity: number
}

type ShippingAddressInput = {
  fullName: string
  phone: string
  addressLine1: string
  city: string
  state: string
  pincode: string
  country: string
}

type RazorpayOrderResponse = {
  id: string
  amount: number
  currency: string
}

type RazorpayPaymentResponse = {
  id: string
  order_id: string
  amount: number
  currency: string
  status: string
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function isCartItem(value: unknown): value is CartItemInput {
  return isRecord(value)
    && typeof value.productId === 'string'
    && value.productId.length > 0
    && Number.isInteger(value.quantity)
    && Number(value.quantity) > 0
    && Number(value.quantity) <= 50
}

function isShippingAddress(value: unknown): value is ShippingAddressInput {
  return isRecord(value)
    && ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode', 'country']
      .every((field) => readNonEmptyString(value[field]) !== null)
}

async function authenticatedUser(request: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const authorization = request.headers.get('Authorization')

  if (!supabaseUrl || !supabaseAnonKey || !authorization) {
    throw new Error('Supabase authentication is not configured.')
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: { user }, error } = await authClient.auth.getUser()
  if (error || !user) {
    throw new Error('Please sign in before making a payment.')
  }
  return user
}

function adminClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Payment backend is not configured. Add the Supabase service role secret.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function razorpayCredentials() {
  const keyId = Deno.env.get('RAZORPAY_KEY_ID')
  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured. Add the Razorpay keys to Supabase Function secrets.')
  }
  return { keyId, keySecret }
}

function razorpayAuthorization(keyId: string, keySecret: string) {
  return `Basic ${btoa(`${keyId}:${keySecret}`)}`
}

async function createOrder(request: Request, body: Record<string, unknown>) {
  const customerId = readNonEmptyString(body.customerId)
  const items = body.items
  const couponCode = typeof body.couponCode === 'string' ? body.couponCode.trim().toUpperCase() : ''
  const address = body.shippingAddress
  const method = body.method

  if (!customerId || !Array.isArray(items) || items.length === 0 || items.length > 50
    || !items.every(isCartItem) || !isShippingAddress(address)
    || (method !== 'upi' && method !== 'card')) {
    return jsonResponse({ error: 'Your cart or shipping details are incomplete. Please review them and try again.' }, 400)
  }
  if (couponCode && !(couponCode in couponDiscounts)) {
    return jsonResponse({ error: 'That coupon code is not valid.' }, 400)
  }

  const user = await authenticatedUser(request)
  const admin = adminClient()
  const credentials = razorpayCredentials()

  const { data: customer, error: customerError } = await admin
    .from('customers')
    .select('id')
    .eq('id', customerId)
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (customerError) throw new Error(`Could not validate your customer account: ${customerError.message}`)
  if (!customer) return jsonResponse({ error: 'Your customer profile could not be verified. Please refresh and try again.' }, 403)

  const quantities = new Map<string, number>()
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity)
  }
  if ([...quantities.values()].some((quantity) => quantity > 50)) {
    return jsonResponse({ error: 'The quantity for an item exceeds the checkout limit.' }, 400)
  }

  const productIds = [...quantities.keys()]
  const { data: products, error: productsError } = await admin
    .from('products')
    .select('*')
    .in('id', productIds)
  if (productsError) throw new Error(`Could not verify product prices: ${productsError.message}`)
  if (!products || products.length !== productIds.length) {
    return jsonResponse({ error: 'One or more products are no longer available. Refresh your cart and try again.' }, 400)
  }

  const productRows = new Map(products.map((product) => [String(product.id), product]))
  const orderItems = productIds.map((productId) => {
    const product = productRows.get(productId)
    const price = Number(product?.price ?? product?.unit_price)
    if (!product || !Number.isFinite(price) || price <= 0
      || product.status === 'inactive' || product.is_active === false) {
      throw new Error('One or more products are unavailable or have an invalid price.')
    }
    if (typeof product.stock_quantity === 'number' && product.stock_quantity < (quantities.get(productId) ?? 0)) {
      throw new Error(`${String(product.name ?? 'A product')} does not have enough stock for this order.`)
    }

    return {
      productId,
      productName: String(product.name ?? 'Product'),
      quantity: quantities.get(productId) ?? 0,
      unitPrice: price,
      totalPrice: price * (quantities.get(productId) ?? 0),
    }
  })

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const discount = subtotal * (couponDiscounts[couponCode] ?? 0)
  const shipping = subtotal >= 699 ? 0 : 79
  const amountPaise = Math.round((subtotal - discount + shipping) * 100)
  if (amountPaise <= 0 || amountPaise > 100_000_000) {
    return jsonResponse({ error: 'The order total is outside the supported payment range.' }, 400)
  }

  const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: razorpayAuthorization(credentials.keyId, credentials.keySecret),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: crypto.randomUUID(),
    }),
  })
  const razorpayResult = await razorpayResponse.json() as RazorpayOrderResponse & { error?: { description?: string } }
  if (!razorpayResponse.ok) {
    throw new Error(razorpayResult.error?.description ?? 'Razorpay could not create the payment order.')
  }
  if (!razorpayResult.id || razorpayResult.amount !== amountPaise || razorpayResult.currency !== 'INR') {
    throw new Error('Razorpay returned an unexpected order amount.')
  }

  const orderId = crypto.randomUUID()
  const orderNumber = `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const orderDate = new Date().toISOString()
  const shippingAddress = JSON.stringify(address)
  const totalAmount = amountPaise / 100

  const { error: orderError } = await admin.from('orders').insert({
    id: orderId,
    order_number: orderNumber,
    customer_id: customerId,
    order_date: orderDate,
    expected_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    total_amount: totalAmount,
    payment_status: 'Pending',
    payment_method: `razorpay_${method}`,
    shipping_address: shippingAddress,
    razorpay_order_id: razorpayResult.id,
    created_at: orderDate,
  })
  if (orderError) throw new Error(`Could not save your order: ${orderError.message}`)

  const { error: itemsError } = await admin.from('order_items').insert(orderItems.map((item) => ({
    id: crypto.randomUUID(),
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
  })))
  if (itemsError) {
    await admin.from('orders').delete().eq('id', orderId)
    throw new Error(`Could not save order items: ${itemsError.message}`)
  }

  const { error: paymentError } = await admin.from('payments').insert({
    id: crypto.randomUUID(),
    order_id: orderId,
    payment_method: `razorpay_${method}`,
    amount: totalAmount,
    status: 'Pending',
    created_at: orderDate,
  })
  if (paymentError) {
    await admin.from('order_items').delete().eq('order_id', orderId)
    await admin.from('orders').delete().eq('id', orderId)
    throw new Error(`Could not save payment details: ${paymentError.message}`)
  }

  return jsonResponse({
    orderId: razorpayResult.id,
    orderNumber,
    amount: totalAmount,
    currency: 'INR',
    keyId: credentials.keyId,
    orderDate,
  })
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function verifySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${orderId}|${paymentId}`),
  )
  const expected = bytesToHex(new Uint8Array(digest))
  if (expected.length !== signature.length) return false
  let difference = 0
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index)
  }
  return difference === 0
}

async function verifyPayment(request: Request, body: Record<string, unknown>) {
  const razorpayOrderId = readNonEmptyString(body.razorpay_order_id)
  const razorpayPaymentId = readNonEmptyString(body.razorpay_payment_id)
  const signature = readNonEmptyString(body.razorpay_signature)
  if (!razorpayOrderId || !razorpayPaymentId || !signature) {
    return jsonResponse({ error: 'Razorpay did not return all payment verification details.' }, 400)
  }

  const user = await authenticatedUser(request)
  const admin = adminClient()
  const credentials = razorpayCredentials()
  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id, order_number, order_date, total_amount, customer_id, payment_status')
    .eq('razorpay_order_id', razorpayOrderId)
    .maybeSingle()
  if (orderError) throw new Error(`Could not find the matching order: ${orderError.message}`)
  if (!order) return jsonResponse({ error: 'The payment order was not found.' }, 404)

  const { data: customer, error: customerError } = await admin
    .from('customers')
    .select('id')
    .eq('id', order.customer_id)
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (customerError) throw new Error(`Could not validate your customer account: ${customerError.message}`)
  if (!customer) return jsonResponse({ error: 'You are not authorized to verify this order.' }, 403)

  if (!await verifySignature(razorpayOrderId, razorpayPaymentId, signature, credentials.keySecret)) {
    return jsonResponse({ error: 'Razorpay payment signature verification failed.' }, 400)
  }

  const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpayPaymentId)}`, {
    headers: { Authorization: razorpayAuthorization(credentials.keyId, credentials.keySecret) },
  })
  const payment = await paymentResponse.json() as RazorpayPaymentResponse & { error?: { description?: string } }
  if (!paymentResponse.ok) {
    throw new Error(payment.error?.description ?? 'Could not confirm payment with Razorpay.')
  }
  if (payment.order_id !== razorpayOrderId
    || payment.amount !== Math.round(Number(order.total_amount) * 100)
    || payment.currency !== 'INR'
    || payment.status !== 'captured') {
    return jsonResponse({ error: 'Razorpay has not confirmed a captured payment for this order.' }, 409)
  }

  const { data: completedOrder, error: completionError } = await admin.rpc('complete_razorpay_payment', {
    p_razorpay_order_id: razorpayOrderId,
    p_razorpay_payment_id: razorpayPaymentId,
  })
  if (completionError) throw new Error(`Could not update the verified payment: ${completionError.message}`)

  return jsonResponse({
    orderId: order.id,
    orderNumber: order.order_number,
    orderDate: order.order_date,
    totalAmount: Number(order.total_amount),
    paymentStatus: 'Paid',
    completedOrder,
  })
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  try {
    const body: unknown = await request.json()
    if (!isRecord(body)) return jsonResponse({ error: 'Invalid request body.' }, 400)

    if (body.action === 'create-order') {
      return await createOrder(request, body)
    }
    if (body.action === 'verify-payment') {
      return await verifyPayment(request, body)
    }
    return jsonResponse({ error: 'Unsupported payment action.' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment could not be processed.'
    console.error('Razorpay function error:', message)
    return jsonResponse({ error: message }, 400)
  }
})
