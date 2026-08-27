import { useEffect, useState } from 'react'
import { getSkinTypes } from '../services/skinTypeService'
import type { SkinType } from '../types/skinType'

export function useSkinTypes() {
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getSkinTypes().then(data => {
      if (active) setSkinTypes(data)
    }).catch(() => {
      if (active) setError('Unable to load skin types.')
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return { skinTypes, loading, error }
}