import { useState, useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
//import About from './pages/About'
import Ingredients from './pages/Ingredients'
//import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import AuthPage from './pages/AuthPage'
import OrdersPage from './pages/OrdersPage'
import { logoutUser, type AuthUser } from './lib/auth'
import { useAuth, AuthProvider } from './context/AuthContext'
import { ArrowUp, MessageCircle, X } from 'lucide-react'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout' | 'login' | 'signup' | 'orders'

type NavState = {
  page: Page
  productId?: string
  shopSearch?: string
  shopSkinType?: string
}

const defaultProductId = 'neem-turmeric-glow'

function getNavFromPath(pathname: string): NavState {
  const path = pathname.split('?')[0].split('#')[0] || '/'
  const segments = path.split('/').filter(Boolean)

  if (segments[0] === 'product' && segments[1]) {
    return { page: 'product', productId: decodeURIComponent(segments[1]) }
  }

  if (path === '/shop') return { page: 'shop' }
  if (path === '/about') return { page: 'about' }
  if (path === '/ingredients') return { page: 'ingredients' }
  //if (path === '/blog') return { page: 'blog' }
  if (path === '/contact') return { page: 'contact' }
  if (path === '/cart') return { page: 'cart' }
  if (path === '/checkout') return { page: 'checkout' }
  if (path === '/login') return { page: 'login' }
  if (path === '/signup') return { page: 'signup' }
  if (path === '/orders') return { page: 'orders' }

  return { page: 'home' }
}

function getPathFromNav(nav: NavState) {
  switch (nav.page) {
    case 'shop': return '/shop'
    case 'product': return `/product/${encodeURIComponent(nav.productId ?? defaultProductId)}`
    case 'about': return '/about'
    case 'ingredients': return '/ingredients'
    case 'blog': return '/blog'
    case 'contact': return '/contact'
    case 'cart': return '/cart'
    case 'checkout': return '/checkout'
    case 'login': return '/login'
    case 'signup': return '/signup'
    case 'orders': return '/orders'
    default: return '/'
  }
}

function AppContent() {
  const { authUser, loading, ready, setAuthUser } = useAuth()
  const [nav, setNav] = useState<NavState>(() => {
    if (typeof window === 'undefined') return { page: 'home' }
    return getNavFromPath(window.location.pathname)
  })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: "Hi! I'm Vana, your herbal skincare assistant 🌿 What's your skin concern today?" },
  ])
  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    const pageTitles: Record<Page, string> = {
      home: 'Prajahita | Handmade Herbal Soaps',
      shop: 'Shop | Prajahita',
      product: 'Product | Prajahita',
      about: 'About Us | Prajahita',
      ingredients: 'Ingredients | Prajahita',
      blog: 'Blog | Prajahita',
      contact: 'Contact | Prajahita',
      cart: 'Cart | Prajahita',
      checkout: 'Checkout | Prajahita',
      login: 'Sign In | Prajahita',
      signup: 'Create Account | Prajahita',
      orders: 'My Orders | Prajahita',
    }

    document.title = pageTitles[nav.page]
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [nav.page])

  useEffect(() => {
    const path = getPathFromNav(nav)
    const currentPath = window.location.pathname

    if (currentPath !== path) {
      window.history.pushState({}, '', path)
    }
  }, [nav])

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400)
    const onPopState = () => setNav(getNavFromPath(window.location.pathname))

    window.addEventListener('scroll', handler)
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const navigate = (page: Page, id?: string, shopSearch?: string, shopSkinType?: string) => {
    setNav({ page, productId: id, shopSearch, shopSkinType })
  }

  const handleAuth = (user: AuthUser) => {
    setAuthUser(user)
  }

  if (loading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-sage-200 border-t-sage-500 animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-brown-700">Initializing secure checkout…</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logoutUser()
    setAuthUser(null)
    navigate('home')
  }

  const chatResponses: Record<string, string> = {
    acne: "For acne-prone skin, I recommend our Neem & Turmeric Glow Bar and Aloe Vera & Tea Tree Clear Bar. Both are formulated to fight bacteria while being gentle on skin.",
    dry: "For dry skin, try our Rose & Honey Luxury Bar or the Olive & Coconut Moisture Surge. They're packed with natural emollients.",
    oily: "For oily skin, our Activated Charcoal Detox Bar and Multani Mitti Clay Purifier are bestsellers — they absorb excess sebum without stripping.",
    sensitive: "Our Lavender & Oats Calm Bar is specially formulated for sensitive skin. It's also safe for children and eczema-prone skin.",
    brightening: "Our Goat Milk Brightening Bar and Neem & Turmeric Glow Bar are perfect for brightening dull complexions.",
    default: "I'd love to help! Tell me your main skin concern — acne, dryness, oiliness, sensitivity, or brightening — and I'll recommend the perfect soap for you.",
  }

  const handleChat = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.toLowerCase()
    const key = Object.keys(chatResponses).find(k => userMsg.includes(k)) ?? 'default'
    setChatMessages(m => [
      ...m,
      { role: 'user', text: chatInput },
      { role: 'bot', text: chatResponses[key] },
    ])
    setChatInput('')
  }

  const renderPage = () => {
    switch (nav.page) {
      case 'home': return <Home onNavigate={navigate} />
      case 'shop': return <Shop onNavigate={navigate} initialSearch={nav.shopSearch ?? ''} initialSkinType={nav.shopSkinType ?? ''} />
      case 'product': return <ProductDetail productId={nav.productId ?? 'neem-turmeric-glow'} onNavigate={navigate} />
      //case 'about': return <About onNavigate={navigate} />
      case 'ingredients': return <Ingredients onNavigate={navigate} />
      //case 'blog': return <Blog onNavigate={navigate} />
      case 'contact': return <Contact />
      case 'cart': return <Cart onNavigate={navigate} />
      case 'checkout': return <Cart onNavigate={navigate} />
      case 'login': return <AuthPage mode="login" onClose={() => navigate(authUser ? 'orders' : 'home')} onAuth={user => { handleAuth(user); navigate('orders') }} />
      case 'signup': return <AuthPage mode="signup" onClose={() => navigate(authUser ? 'orders' : 'home')} onAuth={user => { handleAuth(user); navigate('orders') }} />
      case 'orders': return <OrdersPage user={authUser} onNavigate={navigate} />
      default: return <Home onNavigate={navigate} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Navbar currentPage={nav.page} onNavigate={navigate} user={authUser} onLogout={handleLogout} />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer onNavigate={navigate} />

      {/* Scroll-to-top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-24 right-5 w-11 h-11 btn-primary rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 z-40 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>

      {/* Chat Widget */}
      <div className="fixed bottom-5 right-5 z-50">
        {chatOpen ? (
          <div className="w-80 bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col" style={{ height: '420px' }}>
            <div className="bg-sage-500 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-sage-400 rounded-2xl flex items-center justify-center">
                  <span className="text-lg">🌿</span>
                </div>
                <div>
                  <p className="font-semibold text-cream-50 text-sm">Vana — Skin Assistant</p>
                  <p className="text-[10px] text-sage-200">Usually replies instantly</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-sage-200 hover:text-cream-50 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-sage-500 text-cream-50 rounded-br-sm'
                      : 'bg-cream-100 text-brown-700 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4">
              <div className="flex gap-2 mb-2">
                {['Acne', 'Dry skin', 'Sensitive'].map(q => (
                  <button
                    key={q}
                    onClick={() => { setChatInput(q.toLowerCase()); }}
                    className="text-[10px] px-2.5 py-1 bg-cream-100 text-brown-600 rounded-full hover:bg-sage-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about your skin..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  className="flex-1 px-3 py-2.5 bg-cream-50 border border-cream-300 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-400"
                />
                <button onClick={handleChat} className="btn-primary px-3 py-2.5 rounded-2xl text-xs">
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-sage-500 hover:bg-sage-600 rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-105"
            aria-label="Chat with us"
          >
            <MessageCircle size={22} className="text-cream-50" />
          </button>
        )}
      </div>
    </div>
  )
}
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}
