import { useEffect, useState } from 'react'
import { getOrders } from '../services/orderService'
import type { Order } from '../types/order'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getOrders().then(data => {
      if (active) setOrders(data)
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return { orders, loading }
}
