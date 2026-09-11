import { supabase } from "../lib/supabase";
import type { Product } from "../types/product";
import prajahitaLogo from '../imports/PRAJAHITA_LOGO.jpeg';
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
const fallbackProducts: Product[] = [
  {
    id: 'fallback-neem',
    name: 'Neem Glow Bar',
    tagline: 'Purify, brighten and restore natural radiance',
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewCount: 1284,
    image: prajahitaLogo,
    images: [prajahitaLogo],
    badge: 'bestseller',
    category: 'Acne Care',
    skinType: ['Oily', 'Acne-Prone', 'Combination'],
    ingredients: ['Neem', 'Turmeric'],
    fragrance: 'Earthy Herbal',
    weight: '100g',
    inStock: true,
    description: 'A handcrafted herbal soap with neem and turmeric for clearer, calmer skin.',
    benefits: ['Reduces acne', 'Brightens skin', 'Gentle cleansing'],
    usage: 'Use daily on wet skin and rinse well.',
    precautions: 'Patch test recommended before regular use.',
    collection: 'Acne Care',
  },
  {
    id: 'fallback-lavender',
    name: 'Lavender Calm Bar',
    tagline: 'Soothing comfort for dry and sensitive skin',
    price: 359,
    originalPrice: 429,
    rating: 4.8,
    reviewCount: 976,
    image: prajahitaLogo,
    images: [prajahitaLogo],
    badge: 'new',
    category: 'Sensitive Skin',
    skinType: ['Sensitive', 'Dry', 'Normal'],
    ingredients: ['Lavender', 'Oats'],
    fragrance: 'Soft Lavender',
    weight: '100g',
    inStock: true,
    description: 'A soft, calming bar designed for comfort and hydration.',
    benefits: ['Calms irritation', 'Hydrates skin', 'Gentle daily use'],
    usage: 'Use on damp skin and rinse thoroughly.',
    precautions: 'Avoid contact with eyes.',
    collection: 'Sensitive Skin',
  },
];
function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
<<<<<<< HEAD
    return value.filter((item): item is string => typeof item === 'string');
=======
    return value.flatMap((item) => {
      if (typeof item === 'string') return [item];
      if (isPlainObject(item)) {
        const name = item.name ?? item.label ?? item.title;
        return typeof name === 'string' ? [name] : [];
      }
      return [];
    });
>>>>>>> 860a929 (Initial Shop project)
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
}
function parseImageArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === 'string') {
        return item ? [item] : [];
      }
      if (isPlainObject(item)) {
        const candidate = item.url ?? item.image_url ?? item.public_url ?? item.path ?? item.file_path ?? item.storage_path;
        return typeof candidate === 'string' && candidate ? [candidate] : [];
      }
      return [];
    });
  }
  if (typeof value === 'string') {
    return parseStringArray(value);
  }
  if (isPlainObject(value)) {
    const candidate = value.url ?? value.image_url ?? value.public_url ?? value.path ?? value.file_path ?? value.storage_path;
    return typeof candidate === 'string' && candidate ? [candidate] : [];
  }
  return [];
}
function normalizeImageUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
<<<<<<< HEAD
  const storageBucket = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string | undefined)
    || (import.meta.env.VITE_SUPABASE_BUCKET_NAME as string | undefined);

  if (supabase && storageBucket) {
    try {
      const { data } = supabase.storage.from(storageBucket).getPublicUrl(trimmed.replace(/^\/+/, ''));
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    } catch {
      // fall through to the raw URL if the storage bucket is not available
    }
  }
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (storageBucket && supabaseUrl) {
    return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${storageBucket}/${trimmed.replace(/^\/+/, '')}`;
  }
=======
>>>>>>> 860a929 (Initial Shop project)
  return trimmed;
}
function normalizeBadge(value: unknown): Product['badge'] | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.toLowerCase().trim();
  if (['bestseller', 'best seller', 'best-seller', 'customer favorite', 'trending', 'popular', 'top rated'].includes(normalized)) {
    return 'bestseller';
  }
  if (['new', 'new arrival', 'latest'].includes(normalized)) {
    return 'new';
  }
  if (['limited', 'limited edition'].includes(normalized)) {
    return 'limited';
  }
  if (['organic', 'premium'].includes(normalized)) {
    return 'organic';
  }
  return undefined;
}
export function mapProductRow(row: any): Product {
<<<<<<< HEAD
=======
    const relatedSkinTypes = Array.isArray(row.product_skin_types)
      ? row.product_skin_types.flatMap((link: any) => {
          const relatedSkinType = link?.skin_types ?? link?.skin_type;
          const name = typeof relatedSkinType === 'string'
            ? relatedSkinType
            : relatedSkinType?.name;
          return typeof name === 'string' ? [name] : [];
        })
      : [];
    const directSkinTypes = parseStringArray(row.skin_type ?? row.skinTypes ?? row.skin_types ?? row.skin_type_names);
    const skinTypes = Array.from(new Set([...relatedSkinTypes, ...directSkinTypes].map(value => value.trim()).filter(Boolean)));
>>>>>>> 860a929 (Initial Shop project)
  const relatedImages = Array.isArray(row.product_images)
    ? row.product_images.flatMap((img: any) => parseImageArray(img?.images ?? img?.image_urls ?? img?.image_url ?? img?.url ?? img?.public_url ?? img?.path ?? img?.file_path ?? img?.storage_path))
    : [];
  const directImages = parseImageArray(row.images ?? row.image_urls ?? row.image_url ?? row.image ?? row.hero_image_url ?? row.thumbnail_url);
  const allImageCandidates = [
    row.image_url,
    row.image,
    row.hero_image_url,
    row.thumbnail_url,
    ...relatedImages,
    ...directImages,
  ]
    .map((value) => normalizeImageUrl(typeof value === 'string' ? value : undefined))
    .filter((value): value is string => Boolean(value));
  const primaryImage = allImageCandidates[0] ?? '';
  const normalizedImages = allImageCandidates.length > 0 ? allImageCandidates : [prajahitaLogo];
  const category = [row.category_name, row.category, row.categories?.name, row.collection, row.category_label]
    .find((value): value is string => typeof value === 'string' && Boolean(value.trim())) ?? '';
  const badge = normalizeBadge(row.badge) ?? (Number(row.rating ?? 0) >= 4.7 ? 'bestseller' : undefined);
  return {
    id: row.id,
    name: row.name ?? 'Unnamed Product',
    tagline: row.tagline ?? '',
    price: Number(row.price ?? row.unit_price ?? 0),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    image: primaryImage || prajahitaLogo,
    images: normalizedImages,
    badge: badge ?? 'new',
    category,
<<<<<<< HEAD
    skinType: parseStringArray(row.skin_type ?? row.skinTypes ?? row.skin_types),
=======
    skinType: skinTypes,
>>>>>>> 860a929 (Initial Shop project)
    ingredients: parseStringArray(row.ingredients),
    fragrance: row.fragrance ?? '',
    weight: row.weight ?? '',
    inStock: typeof row.in_stock === 'boolean'
      ? row.in_stock
      : typeof row.inStock === 'boolean'
        ? row.inStock
        : undefined,
    description: row.description ?? '',
    benefits: parseStringArray(row.benefits),
    usage: row.usage ?? '',
    precautions: row.precautions ?? '',
    collection: row.collection ?? category,
  };
}
export async function getProducts() {
  if (!supabase) {
    return fallbackProducts;
  }
  try {
    const productQuery = supabase
      .from('products')
      .select('*, product_images(*)')
      .order('created_at', { ascending: false });
    const { data, error } = await productQuery;
    if (!error) {
      const rows = (data ?? []).filter((row: any) => {
        if (row?.status === 'active') return true;
        if (row?.is_active === false) return false;
        return true;
      });
<<<<<<< HEAD
      return rows.length > 0 ? rows.map(mapProductRow) : fallbackProducts;
=======
      return rows.length > 0 ? enrichProductSkinTypes(rows) : fallbackProducts;
>>>>>>> 860a929 (Initial Shop project)
    }
    const fallbackQuery = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (fallbackQuery.error) {
      throw fallbackQuery.error;
    }
    const rows = (fallbackQuery.data ?? []).filter((row: any) => {
      if (row?.status === 'active') return true;
      if (row?.is_active === false) return false;
      return true;
    });
<<<<<<< HEAD
    return rows.length > 0 ? rows.map(mapProductRow) : fallbackProducts;
=======
    return rows.length > 0 ? enrichProductSkinTypes(rows) : fallbackProducts;
>>>>>>> 860a929 (Initial Shop project)
  } catch (error) {
    console.warn('Falling back to local product data because Supabase is unavailable:', error);
    return fallbackProducts;
  }
}
<<<<<<< HEAD
=======

export async function enrichProductSkinTypes(rows: any[]): Promise<Product[]> {
  const products = rows.map(mapProductRow);
  const productsMissingSkinTypes = products.filter(product => product.skinType.length === 0);

  if (!supabase || productsMissingSkinTypes.length === 0) {
    return products;
  }

  const productIds = productsMissingSkinTypes.map(product => product.id);
  const { data: links, error } = await supabase
    .from('product_skin_types')
    .select('product_id, skin_type_id, skin_types(name)')
    .in('product_id', productIds);

  if (error) {
    console.warn('Unable to load product skin types from Supabase:', error.message);
    return products;
  }

  const namesByProduct = new Map<string, string[]>();
  for (const link of links ?? []) {
    const row = link as Record<string, unknown>;
    const relatedSkinType = row.skin_types as Record<string, unknown> | null | undefined;
    const name = typeof relatedSkinType?.name === 'string'
      ? relatedSkinType.name
      : typeof row.skin_type_id === 'string'
        ? row.skin_type_id
        : '';

    if (!name.trim() || typeof row.product_id !== 'string') continue;
    const current = namesByProduct.get(row.product_id) ?? [];
    namesByProduct.set(row.product_id, [...current, name.trim()]);
  }

  return products.map(product => ({
    ...product,
    skinType: Array.from(new Set(namesByProduct.get(product.id) ?? product.skinType)),
  }));
}
>>>>>>> 860a929 (Initial Shop project)
export function subscribeToProducts(onChange: (products: Product[]) => void) {
  if (!supabase) {
    return () => {};
  }
  const client = supabase;
  const channel = client
    .channel('products-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      async () => {
        const products = await getProducts();
        onChange(products);
      }
    )
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}