import { useEffect, useState } from 'react'
import { getIngredients } from '../services/ingredientService'
import type { Ingredient } from '../types/ingredient'

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getIngredients().then(data => {
      if (active) setIngredients(data)
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return { ingredients, loading }
}
