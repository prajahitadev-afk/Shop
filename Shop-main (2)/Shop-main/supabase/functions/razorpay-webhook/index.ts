import { createClient } from 'npm:@supabase/supabase-js@2'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function verifyWebhookSignature(body: string, signature: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const expected = bytesToHex(new Uint8Array(digest))
  if (expected.length !== signature.length) return false

  let difference = 0
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index)
  }
  return difference === 0
}

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  try {
    const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const signature = request.headers.get('x-razorpay-signature')
    if (!secret || !supabaseUrl || !serviceRoleKey) {
      throw new Error('Razorpay webhook or Supabase secrets are not configured.')
    }
    if (!signature) return jsonResponse({ error: 'Missing Razorpay webhook signature.' }, 400)

    const rawBody = await request.text()
    if (!await verifyWebhookSignature(rawBody, signature, secret)) {
      return jsonResponse({ error: 'Invalid Razorpay webhook signature.' }, 400)
    }

    const event: unknown = JSON.parse(rawBody)
    if (!isRecord(event) || event.event !== 'payment.captured') {
      return jsonResponse({ received: true, ignored: true })
    }

    const payload = event.payload
    const paymentPayload = isRecord(payload) ? payload.payment : null
    const entity = isRecord(paymentPayload) ? paymentPayload.entity : null
    if (!isRecord(entity)
      || typeof entity.id !== 'string'
      || typeof entity.order_id !== 'string'
      || typeof entity.amount !== 'number'
      || entity.currency !== 'INR'
      || entity.status !== 'captured') {
      return jsonResponse({ error: 'Invalid captured-payment webhook payload.' }, 400)
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: order, error: orderError } = await admin
      .from('orders')
      .select('id, total_amount')
      .eq('razorpay_order_id', entity.order_id)
      .maybeSingle()
    if (orderError) throw new Error(`Could not find the matching order: ${orderError.message}`)
    if (!order || entity.amount !== Math.round(Number(order.total_amount) * 100)) {
      return jsonResponse({ error: 'The captured payment does not match an order amount.' }, 409)
    }

    const { error: completionError } = await admin.rpc('complete_razorpay_payment', {
      p_razorpay_order_id: entity.order_id,
      p_razorpay_payment_id: entity.id,
    })
    if (completionError) throw new Error(`Could not update the verified payment: ${completionError.message}`)

    return jsonResponse({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed.'
    console.error('Razorpay webhook error:', message)
    return jsonResponse({ error: message }, 400)
  }
})
