export interface CartRecord {
  id: string
  customer_id: string
  created_at?: string | null
}

export interface CartItemRecord {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  created_at?: string | null
}
