import { supabase, debugSupabaseAuthContext } from '../lib/supabase'
import { generateUUID } from '../lib/uuid'

export type CustomerAddress = {
  id: string
  customer_id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
  created_at?: string | null
}

export type CustomerAddressPayload = {
  id?: string
  customerId: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  pincode: string
  country: string
  isDefault?: boolean
  authUserId?: string | null
}

const ADDRESS_STORAGE_KEY = 'prajahita-customer-addresses'

function readStoredAddresses() {
  if (typeof window === 'undefined') return [] as CustomerAddress[]

  try {
    const raw = window.localStorage.getItem(ADDRESS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CustomerAddress[]) : []
  } catch {
    return []
  }
}

function writeStoredAddresses(addresses: CustomerAddress[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses))
}

function mapAddressRow(row: Record<string, unknown>): CustomerAddress {
  return {
    id: String(row.id ?? generateUUID()),
    customer_id: String(row.customer_id ?? ''),
    full_name: String(row.full_name ?? ''),
    phone: String(row.phone ?? ''),
    address_line_1: String(row.address_line_1 ?? ''),
    address_line_2: typeof row.address_line_2 === 'string' ? row.address_line_2 : null,
    city: String(row.city ?? ''),
    state: String(row.state ?? ''),
    pincode: String(row.pincode ?? ''),
    country: String(row.country ?? 'India'),
    is_default: Boolean(row.is_default ?? row.default_address ?? false),
    created_at: typeof row.created_at === 'string' ? row.created_at : null,
  }
}

export async function getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
  if (!customerId) return []

  const fallback = readStoredAddresses().filter(address => address.customer_id === customerId)
  if (!supabase) return fallback

  try {
    const { data, error } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    if (error) return fallback

    const addresses = (data ?? []).map(row => mapAddressRow(row as Record<string, unknown>))
    writeStoredAddresses(addresses)
    return addresses
  } catch {
    return fallback
  }
}

export async function saveCustomerAddress(payload: CustomerAddressPayload) {
  await debugSupabaseAuthContext('customer address insert')

  const address: CustomerAddress = {
    id: payload.id ?? generateUUID(),
    customer_id: payload.customerId,
    full_name: payload.fullName.trim(),
    phone: payload.phone.trim(),
    address_line_1: payload.addressLine1.trim(),
    address_line_2: payload.addressLine2?.trim() ?? null,
    city: payload.city.trim(),
    state: payload.state.trim(),
    pincode: payload.pincode.trim(),
    country: payload.country.trim() || 'India',
    is_default: Boolean(payload.isDefault),
  }

  const existing = readStoredAddresses()
  const resolved = existing.filter(item => item.customer_id !== payload.customerId)
  if (address.is_default) {
    resolved.forEach(item => {
      if (item.customer_id === payload.customerId) item.is_default = false
    })
  }

  if (!supabase) {
    const next = [...resolved, address]
    writeStoredAddresses(next)
    return { success: true as const, address, storedLocally: true }
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const resolvedAuthUserId = payload.authUserId ?? user?.id ?? null

    const { data, error } = await supabase
      .from('customer_addresses')
      .upsert({
        id: address.id,
        customer_id: address.customer_id,
        full_name: address.full_name,
        phone: address.phone,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        is_default: address.is_default,
        auth_user_id: resolvedAuthUserId,
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      .select()
      .maybeSingle()

    if (error) {
      const next = [...resolved, address]
      writeStoredAddresses(next)
      return { success: false as const, error: error.message, storedLocally: true, address }
    }

    const saved = data ? mapAddressRow(data as Record<string, unknown>) : address
    const next = [...resolved, saved]
    writeStoredAddresses(next)
    return { success: true as const, address: saved }
  } catch (error) {
    const next = [...resolved, address]
    writeStoredAddresses(next)
    return { success: false as const, error: error instanceof Error ? error.message : 'Unable to save address.', storedLocally: true, address }
  }
}
