import { supabase } from '../lib/supabase'
import type { Product } from '../types/product'
import type { CartRecord } from '../types/cart'

export type CartDbItem = {
  id: string
  product: Product
  quantity: number
}

const LOCAL_CART_KEY_PREFIX = 'prajahita-cart:'

function readStoredCartItems(scope = 'guest') {
  if (typeof window === 'undefined') return [] as CartDbItem[]

  try {
    const raw = window.localStorage.getItem(`${LOCAL_CART_KEY_PREFIX}${scope}`)
    return raw ? (JSON.parse(raw) as CartDbItem[]) : []
  } catch {
    return [] as CartDbItem[]
  }
}

function writeStoredCartItems(items: CartDbItem[], scope = 'guest') {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`${LOCAL_CART_KEY_PREFIX}${scope}`, JSON.stringify(items))
}

export function loadLocalCart(scope: string, products: Product[]) {
  return readStoredCartItems(scope).filter(item => products.some(product => product.id === item.product.id))
}

export function saveLocalCart(scope: string, items: CartDbItem[]) {
  writeStoredCartItems(items, scope)
}

async function getOrCreateCart(customerId: string) {
  if (!supabase) return null

  console.log('CART_SERVICE_CUSTOMER_ID', { customerId })

  const { data: existingCart, error: cartLookupError } = await supabase
    .from('carts')
    .select('*')
    .eq('customer_id', customerId)
    .maybeSingle()

  if (cartLookupError && cartLookupError.code !== 'PGRST116') {
    throw cartLookupError
  }

  if (existingCart) {
    console.log('CART_SERVICE_FOUND', { cart: existingCart })
    return existingCart as CartRecord
  }

  const { data: createdCart, error: createCartError } = await supabase
    .from('carts')
    .insert({ customer_id: customerId, created_at: new Date().toISOString() })
    .select()
    .maybeSingle()

  if (createCartError) {
    throw createCartError
  }

  console.log('CART_SERVICE_CREATED', { cart: createdCart })
  return createdCart as CartRecord | null
}

export async function syncCartToDatabase(customerId: string, product: Product, quantity = 1) {
  if (!supabase || !customerId) return { success: false as const, error: 'Missing customer context.' }

  try {
    const cart = await getOrCreateCart(customerId)
    if (!cart?.id) {
      return { success: false as const, error: 'Unable to create cart.' }
    }

    const { data: existingItem, error: lookupError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', product.id)
      .maybeSingle()

    if (lookupError && lookupError.code !== 'PGRST116') {
      throw lookupError
    }

    if (existingItem) {
      const nextQuantity = Number(existingItem.quantity ?? 0) + quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: nextQuantity })
        .eq('id', existingItem.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase.from('cart_items').insert({
        cart_id: cart.id,
        product_id: product.id,
        quantity,
      })

      if (insertError) throw insertError
    }

    return { success: true as const }
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unable to update cart.' }
  }
}

export async function loadCartFromDatabase(customerId: string, products: Product[], localScope = `customer:${customerId}`) {
  if (!supabase || !customerId) return loadLocalCart(localScope, products)

  try {
    const cart = await getOrCreateCart(customerId)
    if (!cart?.id) return loadLocalCart(localScope, products)

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .order('id', { ascending: true })

    if (error) return loadLocalCart(localScope, products)

    const items = (data ?? [])
      .map((row: Record<string, unknown>) => {
        const productId = String(row.product_id ?? '')
        const product = products.find(item => item.id === productId)
        if (!product) return null
        return {
          id: String(row.id ?? ''),
          product,
          quantity: Number(row.quantity ?? 0),
        } satisfies CartDbItem
      })
      .filter((item): item is CartDbItem => item !== null)

    console.log('DB_CART_LOADED', { customerId, count: items.length, items: items.map(item => ({ id: item.product.id, quantity: item.quantity })) })
    console.log('DB_CART_ITEM_COUNT', { customerId, count: items.length })
    writeStoredCartItems(items, localScope)
    return items
  } catch {
    return loadLocalCart(localScope, products)
  }
}

export async function updateCartItemQuantity(customerId: string, productId: string, quantity: number) {
  if (!supabase || !customerId) return { success: false as const, error: 'Missing customer context.' }

  try {
    const cart = await getOrCreateCart(customerId)
    if (!cart?.id) return { success: false as const, error: 'Unable to create cart.' }

    const { data: existingItem, error: lookupError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .maybeSingle()

    if (lookupError && lookupError.code !== 'PGRST116') throw lookupError
    if (!existingItem) return { success: true as const }

    if (quantity <= 0) {
      const { error: deleteError } = await supabase.from('cart_items').delete().eq('id', existingItem.id)
      if (deleteError) throw deleteError
      return { success: true as const }
    }

    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', existingItem.id)

    if (updateError) throw updateError
    return { success: true as const }
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unable to update cart item.' }
  }
}

export async function clearCartFromDatabase(customerId: string) {
  if (!supabase || !customerId) return { success: false as const, error: 'Missing customer context.' }

  try {
    const cart = await getOrCreateCart(customerId)
    if (!cart?.id) return { success: false as const, error: 'Unable to create cart.' }

    const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id)
    if (error) throw error
    return { success: true as const }
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unable to clear cart.' }
  }
}
