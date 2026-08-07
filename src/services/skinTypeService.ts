import { supabase } from '../lib/supabase'
import type { SkinType } from '../types/skinType'
import { mapProductRow } from './productService'
import type { Product } from '../types/product'

const fallbackSkinTypes: SkinType[] = []

function mapSkinTypeRow(row: Record<string, unknown>): SkinType {
  const image = typeof row.image === 'string'
    ? row.image
    : ''

  const productCount = Array.isArray(row.product_skin_types)
    ? row.product_skin_types.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null).length
    : 0

  return {
    id: String(row.id ?? ''),
    name: typeof row.name === 'string' ? row.name : '',
    image,
    productCount,
  }
}

export async function getSkinTypes(): Promise<SkinType[]> {
  if (!supabase) return fallbackSkinTypes

  const query = supabase
    .from('skin_types')
    .select('id,name,image,product_skin_types(product_id)')
    .order('name', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error('Unable to load skin types from skin_types', error)

    // Try singular fallback if the plural table is not present.
    const fallbackQuery = await supabase
      .from('skin_type')
      .select('id,name,image,product_skin_types(product_id)')
      .order('name', { ascending: true })

    if (fallbackQuery.error) {
      console.error('Unable to load skin types from skin_type fallback', fallbackQuery.error)
      return fallbackSkinTypes
    }

    return (fallbackQuery.data ?? []).map(row => mapSkinTypeRow(row as Record<string, unknown>))
  }

  return (data ?? []).map(row => mapSkinTypeRow(row as Record<string, unknown>))
}

export async function getProductsBySkinType(skinTypeId: string): Promise<Product[]> {
  if (!supabase || !skinTypeId) return []

  const { data: linkRows, error: linkError } = await supabase
    .from('product_skin_types')
    .select('product_id')
    .eq('skin_type_id', skinTypeId)

  if (linkError) {
    console.error('Unable to load product links for skin type', linkError)
    return []
  }

  const productIds = (linkRows ?? [])
    .map((row: Record<string, unknown>) => typeof row.product_id === 'string' ? row.product_id : '')
    .filter(Boolean)

  if (productIds.length === 0) {
    return []
  }

  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('status', 'active')

  if (productsError) {
    console.error('Unable to load products for skin type', productsError)
    return []
  }

  return (productsData ?? []).map(row => mapProductRow(row as Record<string, unknown>))
}
