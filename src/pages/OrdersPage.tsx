import { useEffect, useState } from 'react'
import { ArrowRight, Calendar, CreditCard, Package, ShieldCheck, Sparkles, UserCircle2 } from 'lucide-react'
import { loadAccountData, type AuthUser, type OrderSummary } from '../lib/auth'
import type { CustomerAddress } from '../services/addressService'

type Props = {
  user: AuthUser | null
  onNavigate: (page: 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout' | 'login' | 'signup' | 'orders', id?: string) => void
}

export default function OrdersPage({ user, onNavigate }: Props) {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [addresses, setAddresses] = useState<CustomerAddress[]>([])
  const [profileName, setProfileName] = useState(user?.name ?? 'friend')
  const [profileEmail, setProfileEmail] = useState(user?.email ?? 'No email saved')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile')
  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    loadAccountData(user).then(data => {
      if (!active) return
      setOrders(data.orders)
      setAddresses(data.addresses)
      setProfileName(data.profile.name)
      setProfileEmail(data.profile.email)
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, [user?.email, user?.name])

  return (
    <div className="min-h-screen bg-cream-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-cream-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-500">Customer account</p>
              <h1 className="font-serif text-3xl font-bold text-brown-800">Welcome back, {profileName}</h1>
              <p className="mt-2 max-w-2xl text-sm text-brown-600">
                Manage your profile, saved addresses, and order history from one place.
              </p>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="btn-primary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              Continue shopping
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-cream-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                { key: 'profile', label: 'My Profile' },
                { key: 'addresses', label: 'My Addresses' },
                { key: 'orders', label: 'My Orders' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'profile' | 'addresses' | 'orders')}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${activeTab === tab.key ? 'bg-sage-600 text-cream-50' : 'bg-cream-100 text-brown-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'profile' && (
              <div className="space-y-3 text-sm text-brown-600">
                <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                  <div className="flex items-center gap-2 text-brown-800 font-semibold">
                    <UserCircle2 size={16} className="text-sage-600" />
                    Customer details
                  </div>
                  <div className="mt-3 space-y-2">
                    <p><span className="font-semibold text-brown-800">Name:</span> {profileName}</p>
                    <p><span className="font-semibold text-brown-800">Email:</span> {profileEmail}</p>
                    <p><span className="font-semibold text-brown-800">Membership:</span> Premium skincare member</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-4 text-sm text-brown-600">No saved addresses yet. Use checkout to add one.</div>
                ) : addresses.map(address => (
                  <div key={address.id} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brown-800">{address.full_name}</p>
                        <p className="text-sm text-brown-600">{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ''}</p>
                        <p className="text-sm text-brown-600">{address.city}, {address.state} - {address.pincode}</p>
                        <p className="text-sm text-brown-600">{address.country}</p>
                        <p className="text-xs text-brown-400 mt-1">{address.phone}</p>
                      </div>
                      {address.is_default && <span className="rounded-full bg-sage-50 px-3 py-1 text-[10px] font-semibold text-sage-700">Default</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-3">
                {loading ? (
                  <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4 text-sm text-brown-600">Loading your order history…</div>
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-4 text-sm text-brown-600">No orders have been synced yet. Place an order to see it here.</div>
                ) : orders.map(order => (
                  <div key={order.id} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-sage-600" />
                          <span className="text-sm font-semibold text-brown-800">{order.orderNumber || order.id}</span>
                        </div>
                        <p className="mt-1 text-sm text-brown-600">{order.items.join(', ')}</p>
                      </div>
                      <div className="text-sm text-brown-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {order.date}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <CreditCard size={14} />
                          ₹{order.total}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sage-700 border border-sage-100">{order.status}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brown-700 border border-cream-200">Payment: {order.paymentStatus}</span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm font-semibold text-sage-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-cream-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-gold-500" />
                <h3 className="font-serif text-xl font-semibold text-brown-800">Order details</h3>
              </div>
              {selectedOrder ? (
                <div className="mt-4 space-y-3 text-sm text-brown-600">
                  <p><span className="font-semibold text-brown-800">Order:</span> {selectedOrder.orderNumber || selectedOrder.id}</p>
                  <p><span className="font-semibold text-brown-800">Date:</span> {selectedOrder.date}</p>
                  <p><span className="font-semibold text-brown-800">Amount:</span> ₹{selectedOrder.total}</p>
                  <p><span className="font-semibold text-brown-800">Status:</span> {selectedOrder.status}</p>
                  <p><span className="font-semibold text-brown-800">Payment:</span> {selectedOrder.paymentStatus}</p>
                  {selectedOrder.shippingAddress && <p><span className="font-semibold text-brown-800">Shipping:</span> {selectedOrder.shippingAddress}</p>}
                </div>
              ) : (
                <p className="mt-4 text-sm text-brown-500">Select an order to preview its shipping and payment details.</p>
              )}
            </div>

            <div className="rounded-[32px] border border-cream-200 bg-sage-600 p-6 text-cream-50 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <h3 className="font-serif text-xl font-semibold">Recommended for you</h3>
              </div>
              <p className="mt-3 text-sm text-sage-100">
                Based on your last order, we think you will love aloe vera and neem-based bars next.
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-sage-700"
              >
                Explore soaps
                <ArrowRight size={15} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
