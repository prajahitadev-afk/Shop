import { useEffect, useMemo, useState } from 'react'
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, ChevronRight, Truck, Shield, RotateCcw, CheckCircle, Leaf, UserRound, Pencil, PlusCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { getCustomerByAuthUserId, saveCustomerToDatabase } from '../services/customerService'
import { getCustomerAddresses, saveCustomerAddress, type CustomerAddress } from '../services/addressService'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { createOrder } from '../services/orderService'
import { createNotification } from '../services/notificationService'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout'
type Props = { onNavigate: (page: Page, id?: string) => void }

type ConfirmationAddress = {
  fullName?: string
  phone?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
}

function parseConfirmationAddress(value: string | Record<string, unknown> | null | undefined): ConfirmationAddress {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' ? parsed as ConfirmationAddress : {}
    } catch {
      return {}
    }
  }

  if (value && typeof value === 'object') {
    return value as ConfirmationAddress
  }

  return {}
}

function CartView({ onNavigate, onCheckout }: { onNavigate: Props['onNavigate']; onCheckout: () => void }) {
  const { items, removeFromCart, updateQuantity, couponCode, setCouponCode, discount } = useCart()
  const { products } = useProducts()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const savings = subtotal * discount
  const shipping = subtotal >= 699 ? 0 : 79
  const total = subtotal - savings + shipping
  const suggested = products.filter(p => !items.find(i => i.product.id === p.id)).slice(0, 4)
  console.log('CART_RENDER_ITEM_COUNT', { count: items.length })

  const applyCoupon = () => {
    setCouponCode(couponInput)
    if (!['HERBAL10','NATURAL20','FIRSTBUY15','WELLNESS25'].includes(couponInput.toUpperCase())) {
      setCouponError('Invalid coupon code')
    } else {
      setCouponError('')
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <ShoppingBag size={56} className="text-cream-300 mx-auto mb-6" />
        <h2 className="font-serif text-2xl font-bold text-brown-700 mb-3">Your cart is empty</h2>
        <p className="text-brown-400 mb-8">Discover our premium herbal soap collection and start your natural skincare journey.</p>
        <button onClick={() => onNavigate('shop')} className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl">
          Shop Now <ArrowRight size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      {/* Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-xl font-bold text-brown-800">Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h2>
        </div>
        {items.map(item => {
          const discount = item.product.originalPrice
            ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
            : 0
          return (
            <div key={item.product.id} className="bg-white rounded-2xl border border-cream-200 p-4 flex gap-4 hover:border-sage-200 transition-colors">
              <button onClick={() => onNavigate('product', item.product.id)} className="shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-2xl"
                />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <button onClick={() => onNavigate('product', item.product.id)} className="text-left">
                      <h3 className="font-serif font-bold text-brown-800 hover:text-sage-600 transition-colors">{item.product.name}</h3>
                    </button>
                    <p className="text-xs text-brown-400 mt-0.5">{item.product.weight} · {item.product.category}</p>
                    {discount > 0 && (
                      <span className="text-xs badge-new px-2 py-0.5 rounded-full font-bold mt-1 inline-block">-{discount}%</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-brown-300 hover:text-red-400 transition-colors p-1 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-0 border border-cream-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-brown-500 hover:bg-cream-100 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-brown-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-brown-500 hover:bg-cream-100 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brown-800">₹{item.product.price * item.quantity}</div>
                    {item.product.originalPrice && (
                      <div className="text-xs text-brown-400 line-through">₹{item.product.originalPrice * item.quantity}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div>
        <div className="bg-white rounded-2xl border border-cream-200 p-6 sticky top-24">
          <h3 className="font-serif font-bold text-brown-800 text-lg mb-5">Order Summary</h3>

          {/* Coupon */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-brown-500 mb-2 block">Coupon Code</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" />
                <input
                  type="text"
                  placeholder="e.g. FIRSTBUY15"
                  value={couponCode || couponInput}
                  onChange={e => { setCouponInput(e.target.value); setCouponError('') }}
                  disabled={!!couponCode && discount > 0}
                  className="w-full pl-9 pr-3 py-2.5 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-400 disabled:bg-cream-50 disabled:text-brown-400"
                />
              </div>
              {discount > 0 ? (
                <button onClick={() => { setCouponCode(''); setCouponInput('') }} className="px-3 py-2.5 bg-red-50 text-red-500 border border-red-200 rounded-2xl text-sm font-medium">
                  Remove
                </button>
              ) : (
                <button onClick={applyCoupon} className="px-3 py-2.5 btn-primary rounded-2xl text-sm">
                  Apply
                </button>
              )}
            </div>
            {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            {discount > 0 && (
              <p className="text-xs text-sage-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle size={11} /> {Math.round(discount * 100)}% discount applied!
              </p>
            )}
            <p className="text-xs text-brown-400 mt-1">Try: FIRSTBUY15, NATURAL20, WELLNESS25</p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 mb-5 pb-5 border-b border-cream-200">
            <div className="flex justify-between text-sm">
              <span className="text-brown-500">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="text-brown-700">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-sage-600 font-medium">Coupon Discount</span>
                <span className="text-sage-600 font-medium">−₹{Math.round(savings)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-brown-500">Shipping</span>
              <span className={shipping === 0 ? 'text-sage-600 font-medium' : 'text-brown-700'}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-brown-400">Add ₹{699 - subtotal} more for free shipping</p>
            )}
          </div>

          <div className="flex justify-between mb-6">
            <span className="font-bold text-brown-800 text-lg">Total</span>
            <span className="font-bold text-brown-800 text-xl">₹{total}</span>
          </div>

          <button onClick={onCheckout} className="w-full btn-gold py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 mb-3">
            Proceed to Checkout
            <ChevronRight size={16} />
          </button>
          <button onClick={() => onNavigate('shop')} className="w-full py-3 text-sm text-brown-500 hover:text-brown-700 transition-colors">
            Continue Shopping
          </button>

          <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-cream-200">
            {[Truck, RotateCcw, Shield].map((Icon, i) => (
              <div key={i} className="text-center">
                <Icon size={18} className="text-sage-400 mx-auto mb-1" />
                <p className="text-[9px] text-brown-400">{['Free Shipping', 'Easy Returns', 'Secure Pay'][i]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested products */}
      {suggested.length > 0 && (
        <div className="lg:col-span-3 mt-4">
          <h3 className="font-serif text-xl font-bold text-brown-800 mb-5">You Might Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggested.map(p => (
              <ProductCard key={p.id} product={p} onView={id => onNavigate('product', id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CheckoutForm({ onDone }: { onDone: () => void }) {
  const { items, totalPrice, clearCart } = useCart()
  const { products } = useProducts()
  const { authUser, loading: authLoading, ready: authReady } = useAuth()
  const [step, setStep] = useState<'shipping' | 'payment' | 'done'>('shipping')
  const [customerProfile, setCustomerProfile] = useState<Awaited<ReturnType<typeof getCustomerByAuthUserId>>>(null)
  const [addresses, setAddresses] = useState<CustomerAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string
    orderNumber: string
    orderDate: string
    totalAmount: number
    paymentMethod: string
    paymentStatus: string
    customerName: string
    shippingAddress: string
    items: Array<{
      productId: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }>
  } | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })
  const [addressDraft, setAddressDraft] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: true,
  })
  const inputCls = 'w-full px-4 py-3 bg-white border border-cream-300 rounded-2xl text-sm text-brown-700 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-400 transition-colors'

  useEffect(() => {
    if (!authUser) return

    const loadCustomerProfile = async () => {
      console.log('AUTH USER', authUser)
      const customer = await getCustomerByAuthUserId(authUser.id)
      console.log('CUSTOMER', customer)
      setCustomerProfile(customer)

      setShipping(prev => ({
        ...prev,
        name: customer?.first_name ? `${customer.first_name}${customer.last_name ? ` ${customer.last_name}` : ''}` : authUser.name,
        email: customer?.email ?? authUser.email,
        phone: customer?.phone ?? prev.phone,
        city: customer?.city ?? prev.city,
        state: customer?.state ?? prev.state,
        pincode: customer?.pincode ?? prev.pincode,
      }))

      setLoadingAddresses(true)
      const customerAddresses = customer ? await getCustomerAddresses(customer.id) : []
      setAddresses(customerAddresses)
      setLoadingAddresses(false)

      const defaultAddress = customerAddresses.find(item => item.is_default) ?? customerAddresses[0] ?? null
      setSelectedAddressId(defaultAddress?.id ?? null)
      if (defaultAddress) {
        setShipping({
          name: defaultAddress.full_name,
          email: customer?.email ?? authUser.email,
          phone: defaultAddress.phone,
          address: defaultAddress.address_line_1,
          city: defaultAddress.city,
          state: defaultAddress.state,
          pincode: defaultAddress.pincode,
          country: defaultAddress.country,
        })
      }
    }

    loadCustomerProfile()
  }, [authUser])

  const selectedAddress = useMemo(() => {
    return addresses.find(address => address.id === selectedAddressId) ?? null
  }, [addresses, selectedAddressId])

  const resetAddressDraft = () => {
    setAddressDraft({
      fullName: shipping.name,
      phone: shipping.phone,
      addressLine1: shipping.address,
      city: shipping.city,
      state: shipping.state,
      pincode: shipping.pincode,
      country: shipping.country,
      addressLine2: '',
      isDefault: true,
    })
  }

  const startNewAddress = () => {
    setEditingAddressId(null)
    resetAddressDraft()
    setShowAddressForm(true)
  }

  const startEditAddress = (address: CustomerAddress) => {
    setEditingAddressId(address.id)
    setAddressDraft({
      fullName: address.full_name,
      phone: address.phone,
      addressLine1: address.address_line_1,
      addressLine2: address.address_line_2 ?? '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.is_default,
    })
    setShowAddressForm(true)
  }

  const handleAddressSave = async () => {
    if (!customerProfile || !authUser) {
      setMessage('Please sign in before saving an address.')
      return
    }

    if (!supabase) {
      setMessage('Supabase is not configured.')
      return
    }

    const supabaseClient = supabase
    const { data: { session } } = await supabaseClient.auth.getSession()
    console.log('ACTIVE SESSION', session)
    console.log('ACTIVE CUSTOMER', customerProfile)

    if (!session) {
      setMessage('Please sign in before checkout.')
      return
    }

    const customerResult = await saveCustomerToDatabase({
      id: customerProfile.id,
      name: `${customerProfile.first_name ?? ''} ${customerProfile.last_name ?? ''}`.trim() || authUser?.name || customerProfile.email || 'Customer',
      email: customerProfile.email || authUser?.email || '',
      phone: customerProfile.phone || shipping.phone || '',
      city: customerProfile.city || shipping.city || '',
      state: customerProfile.state || shipping.state || '',
      pincode: customerProfile.pincode || shipping.pincode || '',
      status: 'active',
      authUserId: authUser?.id ?? customerProfile?.auth_user_id ?? null,
    })

    const customerId = customerResult.success ? customerResult.customer.id : customerProfile.id

    const result = await saveCustomerAddress({
      id: editingAddressId ?? undefined,
      customerId,
      fullName: addressDraft.fullName,
      phone: addressDraft.phone,
      addressLine1: addressDraft.addressLine1,
      addressLine2: addressDraft.addressLine2 || null,
      city: addressDraft.city,
      state: addressDraft.state,
      pincode: addressDraft.pincode,
      country: addressDraft.country,
      isDefault: addressDraft.isDefault,
      authUserId: authUser?.id ?? customerProfile?.auth_user_id ?? null,
    })

    if (!result.success) {
      setMessage(result.error ?? 'Unable to save address right now.')
      return
    }

    setShipping({
      name: result.address.full_name,
      email: shipping.email,
      phone: result.address.phone,
      address: result.address.address_line_1,
      city: result.address.city,
      state: result.address.state,
      pincode: result.address.pincode,
      country: result.address.country,
    })
    setSelectedAddressId(result.address.id)
    setShowAddressForm(false)
    setMessage('Address saved.')

    const refreshed = await getCustomerAddresses(customerProfile.id)
    setAddresses(refreshed)
    const defaultAddress = refreshed.find(item => item.is_default) ?? refreshed[0] ?? null
    setSelectedAddressId(defaultAddress?.id ?? null)
  }

  if (authLoading || !authReady) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-12 h-12 rounded-full border-4 border-sage-200 border-t-sage-500 animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-brown-700">Preparing your customer session…</p>
      </div>
    )
  }

  if (step === 'done') {
    const confirmationItems = completedOrder?.items ?? []
    const confirmationTotal = completedOrder?.totalAmount ?? Math.round(totalPrice)
    const confirmationAddress = parseConfirmationAddress(completedOrder?.shippingAddress)
    const addressLines = [
      confirmationAddress.fullName,
      confirmationAddress.phone,
      confirmationAddress.addressLine1,
      confirmationAddress.addressLine2,
      [confirmationAddress.city, confirmationAddress.state].filter(Boolean).join(', '),
      confirmationAddress.pincode,
      confirmationAddress.country,
    ].filter((value): value is string => Boolean(value))

    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-sage-300">
          <CheckCircle size={36} className="text-sage-500" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-brown-800 mb-3">Order Confirmed!</h2>
        <p className="text-brown-500 mb-2">Your order has been placed successfully.</p>
        <p className="text-brown-500 mb-8">A confirmation email has been sent to {shipping.email || 'your email'}.</p>
        <div className="bg-white rounded-2xl border border-cream-200 p-5 mb-8 text-left">
          <h3 className="font-semibold text-brown-800 mb-3">Order Details</h3>
          <div className="space-y-1 text-sm text-brown-600">
            <div className="flex justify-between gap-3"><span>Order Number</span><span className="text-right">{completedOrder?.orderNumber || '—'}</span></div>
            <div className="flex justify-between gap-3"><span>Order Date</span><span className="text-right">{completedOrder?.orderDate ? new Date(completedOrder.orderDate).toLocaleString() : '—'}</span></div>
            <div className="flex justify-between gap-3"><span>Customer</span><span className="text-right">{completedOrder?.customerName || shipping.name || '—'}</span></div>
            <div className="flex justify-between gap-3"><span>Payment Method</span><span className="text-right">{completedOrder?.paymentMethod || paymentMethod || '—'}</span></div>
            <div className="flex justify-between gap-3"><span>Payment Status</span><span className="text-right">{completedOrder?.paymentStatus || 'Pending'}</span></div>
            <div className="flex justify-between gap-3">
              <span>Shipping Address</span>
              <div className="min-w-0 max-w-[220px] text-right break-words whitespace-normal">
                {addressLines.length > 0 ? addressLines.map(line => <div key={line}>{line}</div>) : '—'}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cream-200">
            {confirmationItems.map((item, index) => {
              const productName = products.find(product => product.id === item.productId)?.name ?? item.productId
              const lineTotal = item.unitPrice * item.quantity
              return (
                <div key={`${item.productId ?? 'item'}-${index}`} className="flex justify-between gap-3 text-sm text-brown-600 mb-2">
                  <div className="min-w-0">
                    <div className="font-medium text-brown-700">{productName}</div>
                    <div className="text-xs text-brown-400">Qty: {item.quantity} · Unit: ₹{item.unitPrice}</div>
                  </div>
                  <span className="text-right">₹{lineTotal}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between font-bold text-brown-800 mt-3 pt-3 border-t border-cream-200">
            <span>Total</span>
            <span>₹{confirmationTotal}</span>
          </div>
        </div>
        <p className="text-xs text-brown-400 mb-6">Expected delivery: 3–5 business days</p>
        <button onClick={() => { clearCart(); onDone() }} className="btn-primary px-8 py-4 rounded-2xl">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-10">
        {['Shipping', 'Payment', 'Confirmation'].map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i === 0 && step === 'shipping' || i === 1 && step === 'payment' ? 'text-sage-600 font-semibold' : 'text-brown-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                (i === 0 && step !== 'shipping') ? 'bg-sage-500 text-cream-50' :
                (i === 0 && step === 'shipping') || (i === 1 && step === 'payment') ? 'bg-sage-500 text-cream-50' :
                'bg-cream-200 text-brown-500'
              }`}>
                {i + 1}
              </div>
              <span className="text-sm hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className="flex-1 mx-3 h-px bg-cream-300" />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {step === 'shipping' ? (
            <div>
              <h2 className="font-serif text-2xl font-bold text-brown-800 mb-6">Shipping Address</h2>
              <div className="p-4 bg-cream-50 border border-cream-200 rounded-2xl mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-sage-50 border border-sage-100 flex items-center justify-center">
                    <UserRound size={18} className="text-sage-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-brown-800">{authUser ? `Checkout as ${authUser.name}` : 'Signed-in checkout required'}</p>
                    <p className="text-xs text-brown-500">{authUser ? 'Your customer profile and saved addresses will be loaded automatically.' : 'Please sign in before placing an order.'}</p>
                  </div>
                </div>
              </div>

              {loadingAddresses ? (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4 text-sm text-brown-600">Loading saved addresses…</div>
              ) : addresses.length > 0 && !showAddressForm ? (
                <div className="space-y-3 mb-6">
                  {addresses.map(address => (
                    <label key={address.id} className="block rounded-2xl border border-cream-200 bg-white p-4 cursor-pointer hover:border-sage-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <input type="radio" name="saved-address" checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} className="accent-sage-500 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-brown-800">{address.full_name}</p>
                          <p className="text-sm text-brown-500">{address.address_line_1}, {address.city}, {address.state} - {address.pincode}</p>
                          <p className="text-xs text-brown-400 mt-1">{address.phone}</p>
                          {address.is_default && <span className="mt-2 inline-flex rounded-full bg-sage-50 px-2 py-1 text-[10px] font-semibold text-sage-700">Default address</span>}
                        </div>
                        <button type="button" onClick={() => startEditAddress(address)} className="text-sage-700 flex items-center gap-1 text-xs font-semibold">
                          <Pencil size={12} /> Edit
                        </button>
                      </div>
                    </label>
                  ))}

                  <button type="button" onClick={startNewAddress} className="w-full rounded-2xl border border-dashed border-sage-300 bg-sage-50 text-sm font-semibold text-sage-700 py-3 flex items-center justify-center gap-2">
                    <PlusCircle size={15} /> Add New Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Full Name</label>
                      <input value={addressDraft.fullName} onChange={e => setAddressDraft(d => ({ ...d, fullName: e.target.value }))} className={inputCls} placeholder="Priya Sharma" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Phone</label>
                      <input value={addressDraft.phone} onChange={e => setAddressDraft(d => ({ ...d, phone: e.target.value }))} className={inputCls} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Country</label>
                      <input value={addressDraft.country} onChange={e => setAddressDraft(d => ({ ...d, country: e.target.value }))} className={inputCls} placeholder="India" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Address Line 1</label>
                      <input value={addressDraft.addressLine1} onChange={e => setAddressDraft(d => ({ ...d, addressLine1: e.target.value }))} className={inputCls} placeholder="47 Koramangala, 4th Block" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Address Line 2</label>
                      <input value={addressDraft.addressLine2} onChange={e => setAddressDraft(d => ({ ...d, addressLine2: e.target.value }))} className={inputCls} placeholder="Near Forum Mall" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">City</label>
                      <input value={addressDraft.city} onChange={e => setAddressDraft(d => ({ ...d, city: e.target.value }))} className={inputCls} placeholder="Bangalore" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">State</label>
                      <input value={addressDraft.state} onChange={e => setAddressDraft(d => ({ ...d, state: e.target.value }))} className={inputCls} placeholder="Karnataka" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Pincode</label>
                      <input value={addressDraft.pincode} onChange={e => setAddressDraft(d => ({ ...d, pincode: e.target.value }))} className={inputCls} placeholder="560034" />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input id="default-address" type="checkbox" checked={addressDraft.isDefault} onChange={e => setAddressDraft(d => ({ ...d, isDefault: e.target.checked }))} className="accent-sage-500" />
                      <label htmlFor="default-address" className="text-sm text-brown-700">Set as default address</label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={handleAddressSave} className="flex-1 btn-primary py-3 rounded-2xl font-semibold">
                      Save Address
                    </button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 border border-cream-300 py-3 rounded-2xl text-sm font-semibold text-brown-700 hover:bg-cream-100">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {message && <p className="text-sm text-sage-700 mt-4">{message}</p>}

              <button
                onClick={() => {
                  if (selectedAddress) {
                    setShipping(prev => ({
                      ...prev,
                      name: selectedAddress.full_name,
                      phone: selectedAddress.phone,
                      address: selectedAddress.address_line_1,
                      city: selectedAddress.city,
                      state: selectedAddress.state,
                      pincode: selectedAddress.pincode,
                      country: selectedAddress.country,
                    }))
                  }
                  setStep('payment')
                }}
                className="w-full btn-primary py-4 rounded-2xl font-semibold mt-6"
              >
                Continue to Payment
              </button>
            </div>
          ) : (
            <div>
              <h2 className="font-serif text-2xl font-bold text-brown-800 mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'upi', label: 'UPI', desc: 'PhonePe, Google Pay, Paytm & more' },
                  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { id: 'netbanking', label: 'Net Banking', desc: 'All major Indian banks' },
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Available for orders up to ₹5,000' },
                ].map(method => (
                  <label key={method.id} className="flex items-center gap-4 p-4 bg-white border border-cream-200 rounded-2xl cursor-pointer hover:border-sage-300 transition-colors">
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="accent-sage-500" />
                    <div>
                      <p className="font-medium text-brown-800 text-sm">{method.label}</p>
                      <p className="text-xs text-brown-400">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-4 bg-sage-50 border border-sage-100 rounded-2xl flex items-center gap-3 mb-6">
                <Shield size={16} className="text-sage-500 shrink-0" />
                <p className="text-xs text-sage-700">Your payment is secured by 256-bit SSL encryption. We never store card details.</p>
              </div>

              {message && <p className="text-sm text-sage-700 mb-4">{message}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep('shipping')} className="flex-1 py-3.5 rounded-2xl border border-cream-300 text-sm font-medium text-brown-600 hover:bg-cream-100 transition-colors">
                  Back
                </button>
                <button
                  onClick={async () => {
                    setSubmitting(true)
                    setMessage('')
                    if (!supabase) {
                      setMessage('Supabase is not configured.')
                      setSubmitting(false)
                      return
                    }

                    const supabaseClient = supabase
                    const { data: { session } } = await supabaseClient.auth.getSession()
                    console.log('ACTIVE SESSION', session)
                    console.log('ACTIVE CUSTOMER', customerProfile)

                    if (!session || !customerProfile) {
                      setMessage('Please sign in before checkout.')
                      setSubmitting(false)
                      return
                    }

                    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`
                    const orderUuid = crypto.randomUUID()
                    const customerName = shipping.name || authUser?.name || customerProfile.first_name || 'Customer'
                    console.log('CHECKOUT_CUSTOMER_IDS', { authUserId: authUser?.id ?? null, customerProfileId: customerProfile?.id ?? null })
                    const customerEmail = (shipping.email || authUser?.email || customerProfile.email || '').toLowerCase()
                    console.log('ORDER CUSTOMER ID', customerProfile.id)
                    const customerResult = await saveCustomerToDatabase({
                      id: customerProfile.id,
                      name: customerName,
                      email: customerEmail,
                      phone: shipping.phone,
                      city: shipping.city,
                      state: shipping.state,
                      pincode: shipping.pincode,
                      status: 'active',
                      authUserId: authUser?.id ?? customerProfile?.auth_user_id ?? null,
                    })
                    const customerId = customerResult.success ? customerResult.customer.id : customerProfile.id
                    const createdAt = new Date().toISOString()
                    const expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
                    const databaseOrderResult = await createOrder({
                      id: orderUuid,
                      orderNumber: orderId,
                      customerId,
                      orderDate: createdAt,
                      expectedDelivery,
                      paymentMethod,
                      shippingAddress: JSON.stringify({
                        fullName: customerName,
                        phone: shipping.phone,
                        addressLine1: shipping.address,
                        city: shipping.city,
                        state: shipping.state,
                        pincode: shipping.pincode,
                        country: shipping.country,
                      }),
                      totalAmount: Math.round(totalPrice),
                      items: items.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        unitPrice: item.product.price,
                        totalPrice: item.product.price * item.quantity,
                      })),
                    })

                    const notificationResult = databaseOrderResult.success
                      ? await createNotification({
                        title: 'New Customer Order',
                        message: `Order ${orderId} has been placed by ${customerName}`,
                        type: 'order',
                        notificationType: 'new_order',
                        relatedEntityType: 'order',
                        relatedEntityId: orderUuid,
                        isRead: false,
                      })
                      : { success: true as const }

                    if (databaseOrderResult.success) {
                      const normalizedOrderItems = (databaseOrderResult.items ?? []).map((item: { product_id?: string; productId?: string; quantity?: number; unit_price?: number; unitPrice?: number; total_price?: number; totalPrice?: number }, index: number) => ({
                        productId: item.product_id ?? item.productId ?? `item-${index}`,
                        quantity: item.quantity ?? 0,
                        unitPrice: item.unit_price ?? item.unitPrice ?? 0,
                        totalPrice: item.total_price ?? item.totalPrice ?? 0,
                      }))

                      const completedOrderDetails = {
                        orderId: orderUuid,
                        orderNumber: orderId,
                        orderDate: createdAt,
                        totalAmount: Math.round(totalPrice),
                        paymentMethod,
                        paymentStatus: 'Pending',
                        customerName,
                        shippingAddress: JSON.stringify({
                          fullName: customerName,
                          phone: shipping.phone,
                          addressLine1: shipping.address,
                          city: shipping.city,
                          state: shipping.state,
                          pincode: shipping.pincode,
                          country: shipping.country,
                        }),
                        items: normalizedOrderItems.length > 0 ? normalizedOrderItems : items.map(item => ({
                          productId: item.product.id,
                          quantity: item.quantity,
                          unitPrice: item.product.price,
                          totalPrice: item.product.price * item.quantity,
                        })),
                      }

                      console.log('CONFIRMATION_ADDRESS_OBJECT', completedOrderDetails.shippingAddress)
                      console.log('CONFIRMATION_ITEMS', completedOrderDetails.items)
                      console.log('CONFIRMATION_ITEM_COUNT', completedOrderDetails.items.length)
                      setCompletedOrder(completedOrderDetails)
                      console.log('ORDER_CONFIRMATION_DATA', completedOrderDetails)
                      await clearCart()
                      setMessage(notificationResult.success ? 'Order saved successfully.' : 'Order saved, but notification could not be created.')
                      setStep('done')
                    } else {
                      setMessage(databaseOrderResult.error ?? customerResult.error ?? 'Could not save the order right now.')
                    }
                    setSubmitting(false)
                  }}
                  disabled={submitting}
                  className="flex-2 btn-gold py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-70"
                >
                  {submitting ? 'Saving Order…' : `Place Order — ₹${Math.round(totalPrice)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-cream-200 p-5">
            <h3 className="font-semibold text-brown-800 mb-4 flex items-center gap-2">
              <Leaf size={15} className="text-sage-500" />
              Your Order
            </h3>
            <div className="space-y-3 mb-4 pb-4 border-b border-cream-200">
              {items.map(i => (
                <div key={i.product.id} className="flex gap-3">
                  <img src={i.product.image} alt={i.product.name} className="w-12 h-12 object-cover rounded-2xl" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brown-800 line-clamp-2">{i.product.name}</p>
                    <p className="text-xs text-brown-400">Qty: {i.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-brown-800">₹{i.product.price * i.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-brown-800 text-lg">
              <span>Total</span>
              <span>₹{Math.round(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Cart({ onNavigate }: Props) {
  const [checkingOut, setCheckingOut] = useState(false)

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-sage-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-cream-50">
            {checkingOut ? 'Secure Checkout' : 'Shopping Cart'}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {checkingOut ? (
          <CheckoutForm onDone={() => { setCheckingOut(false); onNavigate('home') }} />
        ) : (
          <CartView onNavigate={onNavigate} onCheckout={() => setCheckingOut(true)} />
        )}
      </div>
    </div>
  )
}
