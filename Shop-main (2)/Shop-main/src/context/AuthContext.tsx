import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthUser } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { getCustomerByAuthUserId } from '../services/customerService'
import type { Customer } from '../types/customer'

type AuthContextValue = {
  authUser: AuthUser | null
  customer: Customer | null
  loading: boolean
  ready: boolean
  setAuthUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapSupabaseAuthUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null): AuthUser | null {
  if (!user?.id) return null

  const name = typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()
    ? user.user_metadata.name.trim()
    : user.email?.split('@')[0] ?? 'Customer'

  return {
    id: user.id,
    name,
    email: user.email?.toLowerCase() ?? '',
    password: '',
  }
}

export async function loadCustomer(userId: string) {
  const customer = await getCustomerByAuthUserId(userId)
  console.log('CUSTOMER RECORD', customer)
  return customer
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null)
  const [customer, setCustomerState] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      if (!supabase) {
        if (mounted) {
          setAuthUserState(null)
          setCustomerState(null)
          setLoading(false)
          setReady(true)
        }
        return
      }

      const [{ data: { session } }, { data: { user }, error: userError }] = await Promise.all([
        supabase.auth.getSession(),
        supabase.auth.getUser(),
      ])

      if (!mounted) return

      console.log('AUTH_PROVIDER_INIT', { session, user, userError })

      const nextUser = mapSupabaseAuthUser(user)
      setAuthUserState(nextUser)

      if (nextUser) {
        const nextCustomer = await loadCustomer(nextUser.id)
        setCustomerState(nextCustomer)
      } else {
        setCustomerState(null)
      }

      setReady(true)
      setLoading(false)
    }

    void initializeAuth()

    const { data: authListener } = supabase?.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return

      const nextUser = mapSupabaseAuthUser(nextSession?.user ?? null)
      setAuthUserState(nextUser)

      if (nextUser) {
        const nextCustomer = await loadCustomer(nextUser.id)
        setCustomerState(nextCustomer)
      } else {
        setCustomerState(null)
      }
    }) ?? { data: null }

    return () => {
      mounted = false
      authListener?.subscription?.unsubscribe?.()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    authUser,
    customer,
    loading,
    ready,
    setAuthUser: (user: AuthUser | null) => {
      setAuthUserState(user)
      if (!user) {
        setCustomerState(null)
      }
    },
  }), [authUser, customer, loading, ready])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
