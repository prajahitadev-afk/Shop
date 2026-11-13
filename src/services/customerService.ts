import { supabase } from '../lib/supabase'
import { generateUUID } from '../lib/uuid'
import type { Customer } from '../types/customer'

export type CustomerPayload = {
  id?: string
  customerCode?: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  pincode?: string
  status?: string
  authUserId?: string | null
}

const CUSTOMER_STORAGE_KEY = 'prajahita-customers'

function readStoredCustomers() {
  if (typeof window === 'undefined') return [] as Customer[]

  try {
    const raw = window.localStorage.getItem(CUSTOMER_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Customer[]) : []
  } catch {
    return []
  }
}

function writeStoredCustomers(customers: Customer[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers))
}

function mergeCustomers(customers: Customer[]) {
  const byId = new Map<string, Customer>()
  customers.forEach(customer => {
    if (customer.id) byId.set(customer.id, customer)
  })
  return Array.from(byId.values())
}

function cleanString(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function createCustomerCode(id: string) {
  return `CUS-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

function splitName(name?: string | null) {
  const cleanName = cleanString(name)
  if (!cleanName) {
    return { firstName: null, lastName: null }
  }

  const [firstName, ...rest] = cleanName.split(/\s+/)
  return {
    firstName,
    lastName: rest.length > 0 ? rest.join(' ') : null,
  }
}

function mapCustomerRow(row: Record<string, unknown>): Customer {
  const id = String(row.id ?? generateUUID())
  const email = cleanString(typeof row.email === 'string' ? row.email.toLowerCase() : null)

  return {
    id,
    customer_code: String(row.customer_code ?? createCustomerCode(id)),
    first_name: cleanString(typeof row.first_name === 'string' ? row.first_name : null),
    last_name: cleanString(typeof row.last_name === 'string' ? row.last_name : null),
    email,
    phone: cleanString(typeof row.phone === 'string' ? row.phone : null),
    city: cleanString(typeof row.city === 'string' ? row.city : null),
    state: cleanString(typeof row.state === 'string' ? row.state : null),
    pincode: cleanString(typeof row.pincode === 'string' ? row.pincode : null),
    status: cleanString(typeof row.status === 'string' ? row.status : null) ?? 'active',
    created_at: cleanString(typeof row.created_at === 'string' ? row.created_at : null) ?? new Date().toISOString(),
    auth_user_id: cleanString(typeof row.auth_user_id === 'string' ? row.auth_user_id : null),
  }
}

function buildCustomer(payload: CustomerPayload): Customer {
  const id = payload.id ?? generateUUID()
  const parsedName = splitName(payload.name)
  const email = cleanString(payload.email?.toLowerCase())

  return {
    id,
    customer_code: payload.customerCode ?? createCustomerCode(id),
    first_name: cleanString(payload.firstName) ?? parsedName.firstName,
    last_name: cleanString(payload.lastName) ?? parsedName.lastName,
    email,
    phone: cleanString(payload.phone),
    city: cleanString(payload.city),
    state: cleanString(payload.state),
    pincode: cleanString(payload.pincode),
    status: cleanString(payload.status) ?? 'active',
    created_at: new Date().toISOString(),
    auth_user_id: cleanString(payload.authUserId),
  }
}

export async function getCustomers() {
  const localCustomers = readStoredCustomers()
  if (!supabase) return localCustomers

  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })

  if (error) {
    return localCustomers
  }

  const customers = (data ?? []).map(row => mapCustomerRow(row as Record<string, unknown>))
  return mergeCustomers([...customers, ...localCustomers])
}

export async function getCustomerByAuthUserId(authUserId: string) {
  const localCustomer = readStoredCustomers().find(customer => customer.auth_user_id === authUserId)
  if (!supabase) return localCustomer ?? null

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle()

    if (error) return localCustomer ?? null
    return data ? mapCustomerRow(data as Record<string, unknown>) : localCustomer ?? null
  } catch {
    return localCustomer ?? null
  }
}

export async function saveCustomerToDatabase(payload: CustomerPayload) {
  const customer = buildCustomer(payload)

  if (!supabase) {
    writeStoredCustomers(mergeCustomers([customer, ...readStoredCustomers()]))
    return { success: true as const, customer, storedLocally: true }
  }

  try {
    const upsertPayload = {
      ...customer,
      auth_user_id: customer.auth_user_id,
    }

    const client = supabase.from('customers')
    const primaryAttempt = customer.auth_user_id
      ? client.upsert(upsertPayload, { onConflict: 'auth_user_id' }).select().maybeSingle()
      : client.upsert(customer, { onConflict: 'id' }).select().maybeSingle()

    const { data, error } = await primaryAttempt

    if (error) {
      const fallback = await supabase.from('customers').upsert(customer, { onConflict: 'id' }).select().maybeSingle()
      const fallbackData = fallback.data
      const fallbackError = fallback.error

      if (fallbackError) {
        writeStoredCustomers(mergeCustomers([customer, ...readStoredCustomers()]))
        return { success: false as const, customer, error: fallbackError.message, storedLocally: true }
      }

      const savedCustomer = fallbackData ? mapCustomerRow(fallbackData as Record<string, unknown>) : customer
      writeStoredCustomers(mergeCustomers([savedCustomer, ...readStoredCustomers()]))
      return { success: true as const, customer: savedCustomer }
    }

    const savedCustomer = data ? mapCustomerRow(data as Record<string, unknown>) : customer
    writeStoredCustomers(mergeCustomers([savedCustomer, ...readStoredCustomers()]))
    return { success: true as const, customer: savedCustomer }
  } catch (error) {
    writeStoredCustomers(mergeCustomers([customer, ...readStoredCustomers()]))
    return {
      success: false as const,
      customer,
      error: error instanceof Error ? error.message : 'Unable to save customer.',
      storedLocally: true,
    }
  }
}
