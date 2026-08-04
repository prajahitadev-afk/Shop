export interface OrderRecord {
  id: string
  order_number: string
  customer_id: string
  order_date: string
  expected_delivery: string
  status: string
  total_amount: number
  payment_status: string
  payment_method: string
  shipping_address: string
  created_at: string
}

export type Order = OrderRecord