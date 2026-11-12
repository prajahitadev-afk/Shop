import { supabase, debugSupabaseAuthContext } from './supabase'
import { getCustomerByAuthUserId, saveCustomerToDatabase } from '../services/customerService'
import { getCustomerAddresses } from '../services/addressService'
import { generateUUID } from './uuid'

export type AuthUser = {
  id: string
  name: string
  email: string
  password: string
}

export type OrderSummary = {
  id: string
  orderNumber: string
  date: string
  total: number
  status: string
  paymentStatus: string
  items: string[]
  shippingAddress?: string
}

const ORDERS_KEY = 'prajahita-orders'
const demoOrders: OrderSummary[] = []

function readStoredOrders(): OrderSummary[] {
  if (typeof window === 'undefined') return demoOrders

  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    return raw ? (JSON.parse(raw) as OrderSummary[]) : demoOrders
  } catch {
    return demoOrders
  }
}

function writeStoredOrders(orders: OrderSummary[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

function mapSupabaseUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null, fallbackName = 'Customer') {
  if (!user?.id) return null

  const name = typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()
    ? user.user_metadata.name.trim()
    : fallbackName

  return {
    id: user.id,
    name,
    email: user.email?.toLowerCase() ?? '',
    password: '',
  } satisfies AuthUser
}

async function ensureCustomerForAuthUser(user: AuthUser) {
  const customer = await getCustomerByAuthUserId(user.id)
  console.log('CUSTOMER RECORD', customer)

  if (customer) {
    return customer
  }

  const createdCustomer = await saveCustomerToDatabase({
    id: generateUUID(),
    name: user.name,
    email: user.email,
    status: 'active',
    authUserId: user.id,
  })

  console.log('CUSTOMER RECORD', createdCustomer.customer)
  return createdCustomer.customer
}

export async function registerUser(name: string, email: string, password: string) {
  const trimmedName = name.trim()
  const trimmedEmail = email.trim().toLowerCase()
  const trimmedPassword = password.trim()

  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    return { success: false as const, error: 'Please fill all fields.' }
  }

  if (!supabase) {
    return { success: false as const, error: 'Supabase is not configured.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password: trimmedPassword,
    options: { data: { name: trimmedName } },
  })

  console.log('SIGNUP ERROR', error)
  console.log('SIGNUP RESPONSE', {
    user: data?.user,
    session: data?.session,
    error,
  })

  if (error) {
    const message = error.message?.toLowerCase() ?? ''

    if (message.includes('user already registered') || message.includes('already registered') || message.includes('already exists')) {
      return {
        success: false as const,
        error: 'This email already has an account. Please sign in.',
      }
    }

    if (error.status === 429 || message.includes('rate limit') || message.includes('too many requests')) {
      return {
        success: false as const,
        error: 'Too many signup attempts. Please wait a few minutes and try again.',
      }
    }

    return {
      success: false as const,
      error: error.message || 'Unable to create customer auth account.',
    }
  }

  if (!data?.user) {
    return { success: false as const, error: 'Unable to create customer auth account.' }
  }

  const user = mapSupabaseUser(data.user, trimmedName)
  if (!user) {
    return { success: false as const, error: 'Unable to create customer auth account.' }
  }

  if (!data.session) {
    await debugSupabaseAuthContext('customer signup')
    await ensureCustomerForAuthUser(user)
    return {
      success: true as const,
      user,
      needsVerification: true,
      message: 'Account created. Please verify your email before signing in.',
    }
  }

  await debugSupabaseAuthContext('customer signup')
  await ensureCustomerForAuthUser(user)

  return { success: true as const, user, needsVerification: false }
}

export async function loginUser(email: string, password: string) {
  const trimmedEmail = email.trim().toLowerCase()
  const trimmedPassword = password.trim()

  if (!trimmedEmail || !trimmedPassword) {
    return { success: false as const, error: 'Please enter your email and password.' }
  }

  if (!supabase) {
    return { success: false as const, error: 'Supabase is not configured.' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password: trimmedPassword,
  })

  console.log('LOGIN RESPONSE', {
    session: data?.session,
    user: data?.user,
    error,
  })

  if (error) {
    return { success: false as const, error: error.message }
  }

  console.log('LOGIN USER', data.user)
  console.log('LOGIN SESSION', data.session)

  const user = mapSupabaseUser(data.user, 'Customer')
  if (!user) {
    return { success: false as const, error: 'Unable to load customer auth session.' }
  }

  await debugSupabaseAuthContext('customer login')
  await ensureCustomerForAuthUser(user)

  return { success: true as const, user }
}

export async function restoreSupabaseSession() {
  if (!supabase || typeof window === 'undefined') return null

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('RESTORE_SESSION', { session, user, sessionError, userError })

  if (!session || !user) {
    return null
  }

  return {
    id: user.id,
    name: user.user_metadata?.name ? String(user.user_metadata.name) : user.email?.split('@')[0] ?? 'Customer',
    email: user.email?.toLowerCase() ?? '',
    password: '',
  } satisfies AuthUser
}

export function logoutUser() {
  if (supabase) {
    void supabase.auth.signOut()
  }
}

export async function loadAccountData(user: AuthUser | null) {
  const fallbackOrders = readStoredOrders()

  if (!user) {
    return {
      orders: fallbackOrders,
      profile: { name: 'Signed out', email: 'No email saved', membership: 'Premium skincare member' },
      addresses: [] as Awaited<ReturnType<typeof getCustomerAddresses>>,
    }
  }

  if (!supabase) {
    return {
      orders: fallbackOrders,
      profile: { name: user.name, email: user.email, membership: 'Premium skincare member' },
      addresses: [] as Awaited<ReturnType<typeof getCustomerAddresses>>,
    }
  }

  try {
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    const profile = customerError || !customerData
      ? { name: user.name, email: user.email, membership: 'Premium skincare member' }
      : {
          name: customerData.first_name ?? user.name,
          email: customerData.email ?? user.email,
          membership: 'Premium skincare member',
        }

    const addresses = customerData?.id ? await getCustomerAddresses(customerData.id) : []

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerData?.id ?? user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!orderError && Array.isArray(orderData) && orderData.length > 0) {
      const mappedOrders: OrderSummary[] = orderData.map((row: Record<string, unknown>) => ({
        id: String(row.id ?? 'ORD-0001'),
        orderNumber: String(row.order_number ?? row.id ?? 'ORD-0001'),
        date: row.created_at ? new Date(String(row.created_at)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent order',
        total: Number(row.total_amount ?? row.total ?? row.order_total ?? 0),
        status: String(row.status ?? 'Confirmed'),
        paymentStatus: String(row.payment_status ?? 'Pending'),
        items: Array.isArray(row.items)
          ? row.items.filter((item): item is string => typeof item === 'string')
          : [String(row.item_name ?? 'Herbal soap')],
        shippingAddress: typeof row.shipping_address === 'string'
          ? row.shipping_address
          : typeof row.shipping_address === 'object' && row.shipping_address
            ? JSON.stringify(row.shipping_address)
            : undefined,
      }))

      writeStoredOrders(mappedOrders)
      return { orders: mappedOrders, profile, addresses }
    }

    return { orders: fallbackOrders, profile, addresses }
  } catch {
    return { orders: fallbackOrders, profile: { name: user.name, email: user.email, membership: 'Premium skincare member' }, addresses: [] as Awaited<ReturnType<typeof getCustomerAddresses>> }
  }
}
