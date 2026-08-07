import { useEffect, useState } from 'react'
import { getSkinTypes } from '../services/skinTypeService'
import type { SkinType } from '../types/skinType'

export function useSkinTypes() {
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getSkinTypes().then(data => {
      if (active) setSkinTypes(data)
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return { skinTypes, loading }
}
