import { supabase } from '../lib/supabase'
import type { SkinType } from '../types/skinType'

type SkinTypeRow = Record<string, unknown>

export type SkinTypeWithProducts = SkinType & {
  image: string
  productIds: string[]
}

function firstString(row: SkinTypeRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function mapSkinType(row: SkinTypeRow, productIds: string[]): SkinTypeWithProducts {
  const imagePath = firstString(row, ['image_url', 'image', 'image_path', 'image_name', 'public_url', 'path', 'file_path', 'storage_path', 'file_name'])

  return {
    id: String(row.id ?? ''),
    name: firstString(row, ['name', 'label', 'title']),
    image: imagePath,
    productIds,
  }
}

export async function getSkinTypes(): Promise<SkinTypeWithProducts[]> {
  if (!supabase) return []

  const [{ data: skinTypeRows, error: skinTypeError }, { data: links, error: linksError }] = await Promise.all([
    supabase.from('skin_types').select('*'),
    supabase.from('product_skin_types').select('skin_type_id, product_id'),
  ])

  if (skinTypeError || linksError) {
    console.error('Unable to load skin types from Supabase', skinTypeError ?? linksError)
    return []
  }

  const productsBySkinType = new Map<string, string[]>()
  for (const link of links ?? []) {
    const row = link as SkinTypeRow
    const skinTypeId = typeof row.skin_type_id === 'string' ? row.skin_type_id : ''
    const productId = typeof row.product_id === 'string' ? row.product_id : ''
    if (!skinTypeId || !productId) continue

    const productIds = productsBySkinType.get(skinTypeId) ?? []
    productsBySkinType.set(skinTypeId, [...productIds, productId])
  }

  return (skinTypeRows ?? [])
    .map((row, index) => ({ row: row as SkinTypeRow, index }))
    .sort((left, right) => {
      const leftOrder = Number(left.row.display_order ?? left.row.sort_order ?? left.row.position ?? left.row.order_index)
      const rightOrder = Number(right.row.display_order ?? right.row.sort_order ?? right.row.position ?? right.row.order_index)
      const leftHasOrder = Number.isFinite(leftOrder)
      const rightHasOrder = Number.isFinite(rightOrder)
      if (leftHasOrder && rightHasOrder && leftOrder !== rightOrder) return leftOrder - rightOrder
      if (leftHasOrder !== rightHasOrder) return leftHasOrder ? -1 : 1
      return left.index - right.index
    })
    .map(row => {
      const record = row.row
      const id = String(record.id ?? '')
      return mapSkinType(record, Array.from(new Set(productsBySkinType.get(id) ?? [])))
    })
    .filter(skinType => skinType.id && skinType.name)
}

export async function getSkinTypeById(id: string) {
  const skinTypes = await getSkinTypes()
  return skinTypes.find(skinType => skinType.id === id) ?? null
}