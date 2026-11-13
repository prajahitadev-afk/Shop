import { useState, useEffect } from 'react'
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, User, Phone, Leaf, Sparkles, ArrowRight } from 'lucide-react'
import prajahitaLogo from '../imports/PRAJAHITA_LOGO.jpeg'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import type { AuthUser } from '../lib/auth'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout' | 'login' | 'signup' | 'orders'

type Props = {
  currentPage: Page
  onNavigate: (page: Page, id?: string, shopSearch?: string) => void
  user?: AuthUser | null
  onLogout?: () => void
}

const navItems = [
  { label: 'Shop', page: 'shop' as Page, hasDropdown: true, dropdown: ['All Products', 'Best Sellers', 'New Arrivals', 'Gift Sets'] },
  { label: 'Ingredients', page: 'ingredients' as Page },
  //{ label: 'About Us', page: 'about' as Page },
  //{ label: 'Blog', page: 'blog' as Page },
  { label: 'Contact', page: 'contact' as Page },
]

const pagePaths: Partial<Record<Page, string>> = {
  home: '/', shop: '/shop', ingredients: '/ingredients', contact: '/contact', cart: '/cart',
}

export default function Navbar({ currentPage, onNavigate, user, onLogout }: Props) {
  const { totalItems, wishlist } = useCart()
  const { products } = useProducts()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showWishlistPanel, setShowWishlistPanel] = useState(false)
  const [showAccountPanel, setShowAccountPanel] = useState(false)
  const accountWelcomeTitle = user ? `Welcome back, ${user.name}` : 'Welcome to Prajahita'
  const accountWelcomeDescription = user
    ? 'Your account is ready for orders and favorites.'
    : 'Sign in to save addresses, favorites, and orders.'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isHome = currentPage === 'home'

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#1e3a0e] text-cream-100 text-xs py-2 px-4 text-center flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <Leaf size={11} className="text-gold-400" />
          Free shipping on orders above ₹699
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          <Phone size={11} className="text-gold-400" />
          +91 91826 26287
        </span>
        <span className="hidden md:block">Use code <strong className="text-gold-400">FIRSTBUY15</strong> for 15% off your first order</span>
      </div>

      {/* Main navbar */}
      <nav aria-label="Main" className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'glass shadow-[0_2px_24px_rgba(45,80,22,0.10)]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a
              href="/"
              onClick={e => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                e.preventDefault()
                onNavigate('home')
              }}
              aria-label="Prajahita home"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0 bg-white">
                <img src={prajahitaLogo} alt="" className="w-20px h-20px object-contain size-30px" />
              </div>
              <div className="leading-none">
                <div className={`font-serif font-bold text-xl tracking-tight`} style={{ color: 'rgb(94, 69, 0)' }}>
                  PRAJAHITA
                </div>
                <div className={`text-[9px] font-medium tracking-[0.2em] uppercase ${
                  scrolled || !isHome ? 'text-gold-500' : 'text-gold-300'
                }`}>
                  HOMEMADE Soaps
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <div
                  key={item.page}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.page)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={pagePaths[item.page] ?? '/'}
                    onClick={e => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                      e.preventDefault()
                      onNavigate(item.page)
                    }}
                    aria-current={currentPage === item.page ? 'page' : undefined}
                    className={`nav-link flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === item.page
                        ? scrolled || !isHome ? 'text-sage-600' : 'text-gold-300'
                        : scrolled || !isHome ? 'text-brown-700 hover:text-sage-600' : 'text-cream-100 hover:text-gold-300'
                    } ${currentPage === item.page ? 'active' : ''}`}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown size={13} className="opacity-60" aria-hidden="true" />}
                  </a>
                  {item.hasDropdown && activeDropdown === item.page && (
                    <div className="absolute top-full left-0 mt-1 w-52 glass rounded-2xl shadow-xl py-2 border border-cream-200/60">
                      {item.dropdown?.map(sub => (
                        <button
                          key={sub}
                          onClick={() => { onNavigate('shop'); setActiveDropdown(null) }}
                          className="w-full text-left px-4 py-2.5 text-sm text-brown-700 hover:text-sage-600 hover:bg-cream-100/60 transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-2xl transition-colors ${
                  scrolled || !isHome
                    ? 'text-brown-600 hover:text-sage-600 hover:bg-cream-100'
                    : 'text-cream-100 hover:text-gold-300 hover:bg-white/10'
                }`}
                aria-label="Search"
                aria-expanded={searchOpen}
              >
                <Search size={19} aria-hidden="true" />
              </button>

              <button
                onClick={() => setShowWishlistPanel(true)}
                className={`relative p-2.5 rounded-2xl transition-colors ${
                  scrolled || !isHome
                    ? 'text-brown-600 hover:text-sage-600 hover:bg-cream-100'
                    : 'text-cream-100 hover:text-gold-300 hover:bg-white/10'
                }`}
                aria-label={wishlist.length > 0 ? `Wishlist, ${wishlist.length} saved` : 'Wishlist'}
              >
                <Heart size={19} aria-hidden="true" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-gold-400 text-brown-900 text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate('cart')}
                className={`relative p-2.5 rounded-2xl transition-colors ${
                  scrolled || !isHome
                    ? 'text-brown-600 hover:text-sage-600 hover:bg-cream-100'
                    : 'text-cream-100 hover:text-gold-300 hover:bg-white/10'
                }`}
                aria-label={totalItems > 0 ? `Cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}` : 'Cart'}
              >
                <ShoppingBag size={19} aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-sage-500 text-cream-50 text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowAccountPanel(true)}
                className={`hidden sm:flex p-2.5 rounded-2xl transition-colors ${
                  scrolled || !isHome
                    ? 'text-brown-600 hover:text-sage-600 hover:bg-cream-100'
                    : 'text-cream-100 hover:text-gold-300 hover:bg-white/10'
                }`}
                aria-label="Account"
              >
                <User size={19} aria-hidden="true" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2.5 rounded-2xl transition-colors ${
                  scrolled || !isHome
                    ? 'text-brown-700 hover:bg-cream-100'
                    : 'text-cream-100 hover:bg-white/10'
                }`}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <form
              role="search"
              className="pb-4"
              onSubmit={e => {
                e.preventDefault()
                const query = searchQuery.trim()
                if (!query) return
                setSearchOpen(false)
                onNavigate('shop', undefined, query)
              }}
            >
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" aria-hidden="true" />
                <input
                  autoFocus
                  type="search"
                  aria-label="Search soaps, ingredients or skin concerns"
                  placeholder="Search soaps, ingredients or skin concerns"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur border border-cream-300 rounded-2xl text-sm text-brown-800 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400"
                />
              </div>
            </form>
          )}
        </div>

        {/* Wishlist panel */}
        {showWishlistPanel && (
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-brown-900/40 p-3 pt-4 sm:p-4 sm:pt-6 backdrop-blur-[2px]"
            onKeyDown={e => e.key === 'Escape' && setShowWishlistPanel(false)}
          >
            <div role="dialog" aria-modal="true" aria-label="Your favorites" className="w-full max-w-md rounded-[28px] border border-cream-200 bg-white shadow-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-gold-500 font-semibold">Saved items</p>
                  <h3 className="font-serif text-xl font-bold text-brown-800">Your favorites</h3>
                </div>
                <button autoFocus onClick={() => setShowWishlistPanel(false)} aria-label="Close favorites" className="p-2 text-brown-500 hover:text-brown-700">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {wishlist.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {wishlist.slice(0, 4).map(id => {
                    const product = products.find(item => item.id === id)
                    if (!product) return null

                    return (
                      <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-cream-200 bg-cream-50 px-3 py-3">
                        <img src={product.image} alt={product.name} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brown-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-brown-500">{product.category}</p>
                        </div>
                        <button onClick={() => { setShowWishlistPanel(false); onNavigate('product', product.id) }} className="text-xs font-medium text-sage-600 hover:text-sage-700">
                          View
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-6 text-center">
                  <Heart size={24} className="mx-auto mb-3 text-gold-500" />
                  <p className="text-sm font-semibold text-brown-800">No favorites yet</p>
                  <p className="text-xs text-brown-500 mt-1">Tap the heart on any soap to save it here.</p>
                </div>
              )}

              <button onClick={() => { setShowWishlistPanel(false); onNavigate('shop') }} className="w-full mt-4 btn-primary py-3 rounded-2xl font-semibold flex items-center justify-center gap-2">
                Browse soaps <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Account panel */}
        {showAccountPanel && (
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-brown-900/40 p-3 pt-4 sm:p-4 sm:pt-6 backdrop-blur-[2px]"
            onKeyDown={e => e.key === 'Escape' && setShowAccountPanel(false)}
          >
            <div role="dialog" aria-modal="true" aria-label="Account" className="w-full max-w-md rounded-[28px] border border-cream-200 bg-white shadow-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-gold-500 font-semibold">Account</p>
                  <h3 className="font-serif text-xl font-bold text-brown-800">Sign in or create account</h3>
                </div>
                <button autoFocus onClick={() => setShowAccountPanel(false)} aria-label="Close account panel" className="p-2 text-brown-500 hover:text-brown-700">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {user ? (
                <button
                  onClick={() => { setShowAccountPanel(false); onNavigate('orders') }}
                  className="w-full rounded-2xl border border-cream-200 bg-cream-50 p-4 mb-4 text-left hover:border-sage-300 hover:bg-sage-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-sage-50 border border-sage-100 flex items-center justify-center">
                      <User size={18} className="text-sage-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brown-800">{user.name}</p>
                      <p className="text-xs text-brown-500">View your orders, addresses, and account details</p>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-sage-50 border border-sage-100 flex items-center justify-center">
                      <User size={18} className="text-sage-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brown-800">{accountWelcomeTitle}</p>
                      <p className="text-xs text-brown-500">{accountWelcomeDescription}</p>
                    </div>
                  </div>
                </div>
              )}

              {user ? (
                <button
                  onClick={() => { setShowAccountPanel(false); onLogout?.() }}
                  className="w-full border border-cream-300 text-brown-700 py-3 rounded-2xl font-semibold hover:bg-cream-100 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setShowAccountPanel(false); onNavigate('login') }}
                    className="w-full btn-primary py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 mb-3"
                  >
                    <Sparkles size={15} />
                    Sign In
                  </button>
                  <button
                    onClick={() => { setShowAccountPanel(false); onNavigate('signup') }}
                    className="w-full border border-cream-300 text-brown-700 py-3 rounded-2xl font-semibold hover:bg-cream-100 transition-colors"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden glass border-t border-cream-200/60">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.page}
                  onClick={() => { onNavigate(item.page); setMobileOpen(false) }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                    currentPage === item.page
                      ? 'bg-sage-50 text-sage-600'
                      : 'text-brown-700 hover:bg-cream-100 hover:text-sage-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-cream-200">
                <button
                  onClick={() => { setMobileOpen(false); onNavigate(user ? 'orders' : 'login') }}
                  className="w-full btn-primary px-4 py-3 rounded-2xl text-sm"
                >
                  {user ? 'Account' : 'Sign In / Create Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
