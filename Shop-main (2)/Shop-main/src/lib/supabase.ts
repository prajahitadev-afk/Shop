import { createClient } from '@supabase/supabase-js'

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const isSupabaseConfigured = hasSupabaseConfig

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export async function debugSupabaseAuthContext(label: string) {
  if (!supabase) {
    console.log(label, 'SUPABASE_NOT_CONFIGURED')
    return { session: null, user: null }
  }

  const [{ data: { session } }, { data: { user } }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ])

  console.log(label, { session, user })
  return { session, user }
}