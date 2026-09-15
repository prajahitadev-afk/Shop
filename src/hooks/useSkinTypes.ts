import { useEffect, useState } from 'react'
import { getSkinTypes } from '../services/skinTypeService'
import type { SkinTypeWithProducts } from '../services/skinTypeService'

export function useSkinTypes() {
  const [skinTypes, setSkinTypes] = useState<SkinTypeWithProducts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getSkinTypes()
      .then(data => {
        if (active) setSkinTypes(data)
      })
      .catch(reason => {
        console.error('Unable to load skin types', reason)
        if (active) setError('Unable to load skin types right now.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { skinTypes, loading, error }
}