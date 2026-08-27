import { supabase } from '../lib/supabase'
import type { SkinType } from '../types/skinType'

export async function getSkinTypes(): Promise<SkinType[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('skin_types')
    .select('*')

  if (error) {
    console.error('Unable to load skin types', error)
    throw error
  }

  return (data ?? [])
    .map((row: Record<string, unknown>) => ({
      id: String(row.id ?? ''),
      name: String(row.name ?? row.skin_type ?? row.type ?? row.label ?? ''),
      image: typeof row.image === 'string'
        ? row.image
        : typeof row.image_url === 'string'
          ? row.image_url
          : null,
    }))
    .filter(skinType => skinType.id && skinType.name)
    .sort((first, second) => first.name.localeCompare(second.name))
}