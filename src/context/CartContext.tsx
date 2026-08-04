import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { clearCartFromDatabase, loadCartFromDatabase, syncCartToDatabase, updateCartItemQuantity } from '../services/cartService'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types/product'

type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  wishlist: string[]
  addToCart: (product: Product, quantity?: number) => Promise<void> | void
  removeFromCart: (productId: string) => Promise<void> | void
  updateQuantity: (productId: string, quantity: number) => Promise<void> | void
  clearCart: () => Promise<void> | void
  totalItems: number
  totalPrice: number
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  couponCode: string
  setCouponCode: (code: string) => void
  discount: number
}

const CartContext = createContext<CartContextType | null>(null)

const COUPONS: Record<string, number> = {
  'HERBAL10': 0.10,
  'NATURAL20': 0.20,
  'FIRSTBUY15': 0.15,
  'WELLNESS25': 0.25,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { authUser, customer } = useAuth()
  const { products } = useProducts()
  const [items, setItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [couponCode, setCouponCodeState] = useState('')
  const [discount, setDiscount] = useState(0)

  const applyCartItems = (nextItems: CartItem[]) => {
    console.log('CART_STATE_UPDATED', {
      count: nextItems.length,
      items: nextItems.map(item => ({ id: item.product.id, quantity: item.quantity })),
    })
    setItems(nextItems)
  }

  useEffect(() => {
    const refreshCart = async () => {
      if (!customer?.id) {
        applyCartItems([])
        return
      }

      console.log('CART_CONTEXT_CUSTOMER', { authUserId: authUser?.id ?? null, customerId: customer.id })
      const dbItems = await loadCartFromDatabase(customer.id, products)
      applyCartItems(dbItems)
    }

    void refreshCart()
  }, [authUser?.id, customer?.id, products])

  const addToCart = async (product: Product, quantity = 1) => {
    const optimisticItems = (prev: CartItem[]) => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      }
      return [...prev, { product, quantity }]
    }

    setItems(prev => {
      const nextItems = optimisticItems(prev)
      console.log('CART_STATE_UPDATED', {
        count: nextItems.length,
        items: nextItems.map(item => ({ id: item.product.id, quantity: item.quantity })),
      })
      return nextItems
    })

    if (!customer?.id) {
      return
    }

    await syncCartToDatabase(customer.id, product, quantity)
    const dbItems = await loadCartFromDatabase(customer.id, products)
    const resolvedItems = dbItems.length > 0 ? dbItems : (await loadCartFromDatabase(customer.id, products))
    applyCartItems(resolvedItems)
  }

  const removeFromCart = async (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))

    if (!customer?.id) {
      return
    }

    await updateCartItemQuantity(customer.id, productId, 0)
    const dbItems = await loadCartFromDatabase(customer.id, products)
    applyCartItems(dbItems)
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!customer?.id) {
      if (quantity <= 0) {
        setItems(prev => prev.filter(item => item.product.id !== productId))
        return
      }
      setItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item))
      return
    }

    setItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item))
    const result = await updateCartItemQuantity(customer.id, productId, quantity)
    if (!result.success) return
    const dbItems = await loadCartFromDatabase(customer.id, products)
    applyCartItems(dbItems)
  }

  const clearCart = async () => {
    if (!customer?.id) {
      applyCartItems([])
      return
    }

    applyCartItems([])
    await clearCartFromDatabase(customer.id)
    const dbItems = await loadCartFromDatabase(customer.id, products)
    applyCartItems(dbItems)
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const totalPrice = subtotal * (1 - discount)

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }

  const isWishlisted = (productId: string) => wishlist.includes(productId)

  const setCouponCode = (code: string) => {
    setCouponCodeState(code)
    const rate = COUPONS[code.toUpperCase()]
    setDiscount(rate ?? 0)
  }

  return (
    <CartContext.Provider value={{
      items, wishlist, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, toggleWishlist, isWishlisted,
      couponCode, setCouponCode, discount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
