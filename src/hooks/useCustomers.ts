  import { useCallback, useEffect, useState } from 'react'
  import { getCustomers } from '../services/customerService'
  import type { Customer } from '../types/customer'

  export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refreshCustomers = useCallback(async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (err) {
        console.error('Unable to load customers', err)
        setError('Unable to load customers right now.')
        setCustomers([])
      } finally {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      refreshCustomers()
    }, [refreshCustomers])

    return { customers, loading, error, refresh: refreshCustomers }
  }
