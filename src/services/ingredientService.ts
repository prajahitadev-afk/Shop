import { supabase } from '../lib/supabase'
import { generateUUID } from '../lib/uuid'
import type { Ingredient } from '../types/ingredient'
import type { Product } from '../types/product'
<<<<<<< HEAD
import { mapProductRow } from './productService'
=======
import { enrichProductSkinTypes } from './productService'
>>>>>>> 860a929 (Initial Shop project)

const fallbackIngredients: Ingredient[] = []

function parseStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value === 'string') {
    return value.split(/,|\n/).map(item => item.trim()).filter(Boolean)
  }

  return []
}

function mapIngredientRow(row: Record<string, unknown>): Ingredient {
  const imageUrl = typeof row.image_url === 'string'
    ? row.image_url
    : typeof row.image === 'string'
      ? row.image
      : ''

  return {
    id: String(row.id ?? generateUUID()),
    name: typeof row.name === 'string' ? row.name : '',
    scientificName: typeof row.scientific_name === 'string' ? row.scientific_name : '',
    origin: typeof row.origin === 'string' ? row.origin : '',
    image: imageUrl,
    color: typeof row.color === 'string' ? row.color : '#84a98c',
    benefits: parseStringArray(row.benefits),
    skinTypes: parseStringArray(row.skin_types ?? row.skin_types),
    description: typeof row.description === 'string' ? row.description : '',
    historicalUse: typeof row.historical_use === 'string' ? row.historical_use : '',
    keyProperty: typeof row.key_property === 'string' ? row.key_property : '',
    image_url: imageUrl || undefined,
    created_at: typeof row.created_at === 'string' ? row.created_at : undefined,
  }
}

export async function getIngredients() {
  if (!supabase) return fallbackIngredients

  const { data, error } = await supabase.from('ingredients').select('*').order('created_at', { ascending: false })

  if (error) {
    return fallbackIngredients
  }

  return (data ?? []).map(row => mapIngredientRow(row as Record<string, unknown>))
}

export async function getProductIngredientNames(productId: string): Promise<string[]> {
  if (!supabase || !productId) return []

  const { data, error } = await supabase
    .from('product_ingredients')
    .select('ingredients(name)')
    .eq('product_id', productId)

  if (error) {
    console.error('Unable to load product ingredient names', error)
    return []
  }

  return (data ?? [])
    .flatMap((row: Record<string, unknown>) => {
      const ingredient = row.ingredients as Record<string, unknown> | null | undefined
      const name = typeof ingredient?.name === 'string' ? ingredient.name.trim() : ''
      return name ? [name] : []
    })
}

export async function getRelatedProductIds(productId: string) {
  if (!supabase || !productId) return { productIds: [] as string[], skinTypeIds: [] as string[] }

  const [{ data: ingredientLinks, error: ingredientError }, { data: skinTypeLinks, error: skinTypeError }] = await Promise.all([
    supabase.from('product_ingredients').select('product_id').eq('product_id', productId),
    supabase.from('product_skin_types').select('skin_type_id').eq('product_id', productId),
  ])

  if (ingredientError || skinTypeError) {
    console.error('Unable to load related product linkage data', ingredientError ?? skinTypeError)
    return { productIds: [], skinTypeIds: [] }
  }

  const productIds = (ingredientLinks ?? [])
    .map((link: Record<string, unknown>) => typeof link.product_id === 'string' ? link.product_id : '')
    .filter(Boolean)

  const skinTypeIds = (skinTypeLinks ?? [])
    .map((link: Record<string, unknown>) => typeof link.skin_type_id === 'string' ? link.skin_type_id : '')
    .filter(Boolean)

  return { productIds, skinTypeIds }
}

export async function getProductsByIngredient(ingredientId: string): Promise<Product[]> {
  if (!supabase || !ingredientId) return []

  const { data: ingredientLinks, error: linksError } = await supabase
    .from('product_ingredients')
    .select('product_id')
    .eq('ingredient_id', ingredientId)

  if (linksError) {
    console.error('Unable to load ingredient product links', linksError)
    return []
  }

  const productIds = (ingredientLinks ?? [])
    .map(link => typeof link.product_id === 'string' ? link.product_id : '')
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
    console.error('Unable to load related products', productsError)
    return []
  }

<<<<<<< HEAD
  return (productsData ?? []).map(row => mapProductRow(row as Record<string, unknown>))
=======
  return enrichProductSkinTypes(productsData ?? [])
>>>>>>> 860a929 (Initial Shop project)
}
