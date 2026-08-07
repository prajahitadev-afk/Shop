import { useState, useEffect, useRef, useMemo } from 'react'
import { ArrowRight, Star, Shield, Leaf, Droplets, Award, Heart, Recycle, CheckCircle, ChevronRight, ChevronLeft, Quote, Package, Truck, Play } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useIngredients } from '../hooks/useIngredients'
import { useTestimonials } from '../hooks/useTestimonials'
import { useSkinTypes } from '../hooks/useSkinTypes'
import prajahitaLogo from '../imports/PRAJAHITA_LOGO.jpeg'
import backimgone from '../imports/backimgone.jpeg'
import oats from '../imports/product_pics/oats.jpeg'
import neem from '../imports/product_pics/neem.jpeg'
import coff from '../imports/product_pics/coff.jpeg' 
//  import Shop from './Shop'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | /*'blog' |*/ 'contact' | 'cart' | 'checkout'

type Props = {
  onNavigate: (page: Page, id?: string) => void
}

const whyUsItems = [
  { icon: Leaf, title: '100% Natural Ingredients', desc: 'Every ingredient is sourced from nature — no synthetic chemicals, no harmful additives.' },
  { icon: Heart, title: 'Handmade with Care', desc: 'Each bar is crafted in small batches by skilled artisans who pour intention into every creation.' },
  { icon: Shield, title: 'Cruelty-Free', desc: 'We never test on animals. Our formulations are ethical from ingredient to packaging.' },
  { icon: Award, title: 'Dermatologist Tested', desc: 'All products undergo rigorous dermatological testing to ensure safety for every skin type.' },
  { icon: Recycle, title: 'Eco-Friendly Packaging', desc: 'Plastic-free, recyclable packaging that honors the planet as much as your skin.' },
  { icon: Droplets, title: 'Sulfate & Paraben Free', desc: 'Pure formulations free from the harsh chemicals found in conventional soaps.' },
]

// const certifications = ['USDA Organic', 'Cruelty-Free', 'Vegan Society', 'GMP Certified', 'ISO 22716', 'ECOCERT']
/*
const instagramPosts = [
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1547484929-7b78e1322339?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1583228741574-5f3b3c63c8ca?w=300&h=300&fit=crop&auto=format',
]
*/
function CounterStat({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true
        const duration = 1800
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * end))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-4xl md:text-5xl font-bold text-cream-50 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-forest-200 font-medium">{label}</div>
    </div>
  )
}

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const { testimonials, loading } = useTestimonials()
  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent(c => (c + 1) % testimonials.length)
  const t = testimonials[current]

  if (loading) {
    return <div className="text-center text-sm text-brown-600">Loading reviews…</div>
  }

  if (!t) {
    return null
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-200">
        <Quote size={40} className="text-gold-300 mb-6" />
        <p className="font-serif text-xl md:text-2xl text-bark-800 leading-relaxed italic mb-8">
          "{t.review}"
        </p>
        <div className="flex items-center gap-4">
          <img
            src={t.image_url || prajahitaLogo}
            alt={t.customer_name}
            className="w-14 h-14 rounded-full object-cover border-2 border-gold-300"
          />
          <div>
            <div className="font-semibold text-bark-800">{t.customer_name}</div>
            <div className="text-sm text-bark-400">{t.designation}</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[...Array(Math.max(1, Math.round(t.rating)))].map((_, i) => (
                  <Star key={i} size={12} className="star-filled fill-current" />
                ))}
              </div>
              {t.status === 'active' && (
                <span className="flex items-center gap-1 text-[10px] text-forest-600 font-medium">
                  <CheckCircle size={10} />
                  Verified Purchase
                </span>
              )}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-bark-400 mb-1">Verified customer</div>
            <div className="text-xs text-bark-300">{new Date(t.created_at).toLocaleDateString('en-IN')}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={prev} className="w-10 h-10 rounded-full bg-white border border-cream-300 flex items-center justify-center text-bark-600 hover:bg-forest-50 hover:border-forest-300 transition-colors shadow-sm">
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-2 bg-forest-500' : 'w-2 h-2 bg-cream-300'}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 rounded-full bg-white border border-cream-300 flex items-center justify-center text-bark-600 hover:bg-forest-50 hover:border-forest-300 transition-colors shadow-sm">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default function Home({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'new' | 'loved' | 'limited'>('bestsellers')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { products } = useProducts()
  const { ingredients } = useIngredients()
  const { skinTypes } = useSkinTypes()

  const collectionIcons: Record<string, string> = {
    'Acne Care': '🌿',
    'Dry Skin': '💧',
    'Oily Skin': '✨',
    'Sensitive Skin': '🌸',
  }

  const collections = useMemo(() => {
    return skinTypes.map(type => ({
      id: type.id,
      name: type.name,
      count: type.productCount ?? products.filter(p => Array.isArray(p.skinType) && p.skinType.includes(type.name)).length,
      image: type.image || (products.find(p => Array.isArray(p.skinType) && p.skinType.includes(type.name))?.image ?? prajahitaLogo),
      icon: collectionIcons[type.name] ?? '🌿',
    }))
  }, [skinTypes, products])
  
  const tabFilters = useMemo(() => ({
    bestsellers: products.filter(p => p.badge === 'bestseller'),
    new: products.filter(p => p.badge === 'new'),
    loved: products.filter(p => p.rating >= 4.9),
    limited: products.filter(p => p.badge === 'limited'),
  }), [products])

  const displayProducts = useMemo(() => tabFilters[activeTab].slice(0, 4), [tabFilters, activeTab])
  const spotlightIngredients = useMemo(() => ingredients.slice(0, 10), [ingredients])
  const featuredProduct = useMemo(() => {
    return products.find(p => p.badge === 'bestseller' || p.rating >= 4.8) ?? products[0]
  }, [products])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-bg leaf-pattern">
        {/* Botanical decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-80">
            <img
              src={backimgone}
              alt=""
              className="w-full h-full object-cover mix-blend-luminosity"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-600/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-20 w-60 h-60 bg-gold-400/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="h-px w-8 bg-gold-600" />
              <span className="text-base sm:text-[20px] font-semibold tracking-[0.2em] uppercase text-gold-1000 block">
                Premium Handcrafted Soaps
              </span>
            </div>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-4 sm:mb-6" style={{ color: 'rgb(55, 33, 0)' }}>
              <span className="block text-gold-1000">Homemade Soaps</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal italic">for Healthy Skin</span>
            </h1>
            <p className="text-base sm:text-lg md:text-[20px] leading-relaxed mb-8 sm:mb-10 max-w-xl" style={{ color: 'rgb(22, 66, 0)' }}>
              <b>100% natural, handmade, and cruelty-free. Each bar is crafted with Ayurvedic herbs, cold-process tradition, and love for both your skin and our planet.</b>
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto btn-gold px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-2 shadow-xl"
              >
                Shop Now
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto btn-outline px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-2"
              >
                <Play size={16} />
                Our Story
              </button>
            </div>
{/* 
            Social proof 
            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-2">
                {['photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d', 'photo-1534528741775-53994a69daeb', 'photo-1531746020798-e6953c6e8e04'].map((id, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&auto=format`}
                    alt="Customer"
                    className="w-9 h-9 rounded-full border-2 border-forest-500 object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} className="star-filled fill-current" style={{color:'rgba(254, 183, 77, )'}}/>)}
                  <span className="text-sm font-bold text-cream-200 ml-1 style={{color:'rgb(2, 2, 2)'}}">4.6</span>
                </div>
                <p className="text-xs text-forest-200 style={{color:'rgb(40, 100, 0)'}}">Loved by 100+ happy customers</p>
              </div>
            </div>   */}
          </div>
        </div>

        {/* Hero product floating card */}
        <div className="absolute right-6 bottom-12 hidden xl:block animate-float">
          <div className="glass rounded-2xl p-4 w-56 shadow-2xl">
            <img
              onClick={() => onNavigate('shop', featuredProduct?.id )}
              src={featuredProduct?.image ?? prajahitaLogo}
              alt={featuredProduct?.name ?? 'Featured product'}
              className="w-full h-28 object-cover rounded-xl mb-3"
            />
            <div className="text-xs font-semibold text-forest-700 mb-0.5">{featuredProduct?.badge === 'bestseller' ? 'Best Seller' : 'Featured'}</div>
            <div className="font-serif font-bold text-bark-800 text-sm">{featuredProduct?.name ?? 'Featured Product'}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-bark-800">₹{featuredProduct?.price ?? 0}</span>
              <div className="flex items-center gap-0.5">
                <Star size={10} className="star-filled fill-current" />
                <span className="text-xs font-medium text-bark-600">{featuredProduct?.rating.toFixed(1) ?? '0.0'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-cream-200/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-cream-200/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Service promises */}
      <section className="bg-forest-600 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {[
              { icon: Truck, text: 'Free Delivery above ₹699' },
              { icon: Shield, text: '100% Authentic Products' },
              { icon: Package, text: 'Eco-Friendly Packaging' },
            ].map(item => (
              <div key={item.text} className="flex items-center justify-center gap-2.5">
                <item.icon size={20} className="text-gold-300 flex-shrink-0" />
                <span className="text-sm font-medium text-cream-100">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-3xl sm:text-4xl font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3 block">Our Products</span>
            <h4 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-bark-800 mb-4">
              Crafted for Your Skin
            </h4>
            <p className="text-bark-500 text-base sm:text-lg max-w-2xl mx-auto">
              Cold-processed using premium herbs. No sulphates. No parabens. Just nature goodness.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
            {[
              { key: 'bestsellers', label: 'Best Sellers' },
              { key: 'new', label: 'New Arrivals' },
              { key: 'loved', label: 'Most Loved' },
              { key: 'limited', label: 'Limited Edition' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-forest-500 text-cream-50 shadow-md'
                    : 'bg-white text-bark-600 border border-cream-300 hover:border-forest-300 hover:text-forest-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onView={id => onNavigate('product', id)}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('shop')}
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm"
            >
              View All Products
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="py-16 bg-forest-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <CounterStat end={100} suffix="+" label="Happy Customers" />
            <CounterStat end={48} suffix="+" label="Herbal Formulas" />
            <CounterStat end={26} label="weeks of Craftsmanship" />
            <CounterStat end={20} suffix="+" label="Natural Ingredients" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20" style={{ backgroundColor: 'rgb(247, 229, 194)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">Why PRAJAHITA</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-bark-800 mb-6 leading-tight">
                The Standard of
                <span className="text-gradient-forest block">Natural Skincare</span>
              </h2>
              <p className="text-bark-500 text-base sm:text-lg leading-relaxed mb-8">
                We believe healthy skin comes from nature, not a laboratory. Every decision we make — from ingredient sourcing to packaging — reflects our commitment to purity, sustainability, and efficacy.
              </p>
              <div className="my-12 overflow-x-auto rounded-xl border border-amber-100 shadow-sm">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="border-b border-amber-100 bg-amber-50/50">
                    <th className="py-4 px-6 text-lg font-bold text-gray-800">Feature Comparison</th>
                    <th className="py-4 px-6 text-lg font-bold text-amber-600 text-center w-1/3">Regular Soap</th>
                    <th className="py-4 px-6 text-lg font-bold text-amber-700 text-center w-1/3 bg-amber-100/50">Prajahita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 text-sm md:text-base">
                  {/* Row 1 */}
                  <tr className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-gray-700">Ingredients & Scent</td>
                    <td className="py-3.5 px-6 text-amber-700 text-center font-medium ">
                      <span className="inline-block mr-1 ">✕</span> Artificial Fragrance
                    </td>
                    <td className="py-3.5 px-6 text-amber-800 text-center font-semibold bg-amber-50/30">
                      <span className="inline-block mr-1 text-green-600">✓</span> Herbal Ingredients
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-gray-700">Chemical Composition</td>
                    <td className="py-3.5 px-6 text-amber-700 text-center font-medium">
                      <span className="inline-block mr-1">✕</span> Harsh Chemicals
                    </td>
                    <td className="py-3.5 px-6 text-amber-800 text-center font-semibold bg-amber-50/30">
                      <span className="inline-block mr-1 text-green-600">✓</span> Skin Nourishing
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-gray-700">Crafting Process</td>
                    <td className="py-3.5 px-6 text-amber-700 text-center font-medium">
                      <span className="inline-block mr-1">✕</span> Mass Produced
                    </td>
                    <td className="py-3.5 px-6 text-amber-800 text-center font-semibold bg-amber-50/30">
                      <span className="inline-block mr-1 text-green-600">✓</span> Handmade & Cold Processed
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-gray-700">Environmental Impact</td>
                    <td className="py-3.5 px-6 text-amber-700 text-center font-medium">
                      <span className="inline-block mr-1">✕</span> Short Lasting / Plastic Packaging
                    </td>
                    <td className="py-3.5 px-6 text-amber-800 text-center font-semibold bg-amber-50/30">
                      <span className="inline-block mr-1 text-green-600">✓</span> Eco-Friendly
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
                onClick={() => onNavigate('about')}
                className="mt-8 flex items-center gap-2 text-forest-600 font-semibold hover:text-forest-500 transition-colors">
                Learn more about our values
                <ArrowRight size={16} />
            </button>
          </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-12 items-center">
              {/* Step 1: First image - Base position */}
              <div className="overflow-hidden rounded-3xl shadow-sm">
                <img
                  src={oats}
                  alt="Oats soap"
                  className="object-cover w-full h-64 md:h-80 hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Step 2: Second image - Lifted up (Creates the middle rung) */}
              <div className="overflow-hidden rounded-3xl shadow-sm md:-translate-y-6">
                <img
                  src={neem}
                  alt="Neem soap"
                  className="object-cover w-full h-64 md:h-80 hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Step 3: Third image - Lifted further up (Creates the top step) */}
              <div className="overflow-hidden rounded-3xl shadow-sm md:-translate-y-12">
                <img
                  src={coff}
                  alt="Coffee soap"
                  className="object-cover w-full h-64 md:h-80 hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            </div>
          {/* Additional benefits */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {whyUsItems.map(item => (
              <div key={item.title} className="text-center p-4 rounded-2xl bg-cream-50 border border-cream-200 hover:border-forest-200 hover:bg-forest-50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white border border-cream-200 flex items-center justify-center mx-auto mb-3 group-hover:bg-forest-50 group-hover:border-forest-200 transition-colors">
                  <item.icon size={18} className="text-forest-500" />
                </div>
                <p className="text-xs font-medium text-bark-600 leading-tight">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Ingredients Spotlight */}
      <section className="py-16 sm:py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-3xl sm:text-4xl font-serif tracking-[0.2em] uppercase text-gold-500 mb-3 block">The Botanicals</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-bark-800 mb-4">
              Power of Nature's Lab
            </h2>
            <p className="text-bark-500 text-base sm:text-lg max-w-2xl mx-auto">
              Each ingredient is carefully selected for its proven skincare properties, sourced ethically, and used in optimal concentrations.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {spotlightIngredients.map(ing => (
              <button
                key={ing.id}
                onClick={() => onNavigate('ingredients')}
                className="ingredient-card bg-white rounded-2xl overflow-hidden border border-cream-200 group text-left"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={ing.image}
                    alt={ing.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark-900/50 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] font-medium text-white/80 italic">{ing.scientificName}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-serif font-bold text-bark-800 text-sm mb-1">{ing.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {ing.benefits.slice(0, 2).map(b => (
                      <span key={b} className="text-[9px] px-1.5 py-0.5 bg-forest-50 text-forest-600 rounded-full">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('ingredients')}
              className="inline-flex items-center gap-2 text-forest-600 font-semibold hover:text-forest-500 transition-colors border border-forest-300 px-6 py-3 rounded-2xl hover:bg-forest-50"
            >
              Explore All Ingredients
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
      {/* Collections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">Collections</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-bark-800">Shop by Concern</h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="hidden md:flex items-center gap-2 text-forest-600 font-medium hover:text-forest-500 transition-colors"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-5">
            {collections.map(col => (
              <button
                key={col.id}
                onClick={() => onNavigate('shop')}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-cream-100"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bark-900/70 via-bark-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-lg mb-0.5">{col.icon}</div>
                  <h3 className="font-serif font-bold text-cream-50 text-sm leading-tight">{col.name}</h3>
                  <p className="text-xs text-cream-200/80 mt-0.5">{col.count} products</p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-400/60 rounded-2xl transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">Customer Stories</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-bark-800 mb-4">
              Real Results, Real People
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="star-filled fill-current" />)}
              </div>
              <span className="text-bark-600 font-medium">4.9/5 from 12,400+ verified reviews</span>
            </div>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Certifications */}
      {/*
      <section className="py-12 border-t border-cream-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold tracking-[0.25em] uppercase text-bark-400 mb-8">Certified & Trusted</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {certifications.map(cert => (
              <div key={cert} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream-50 border border-cream-200">
                <Sparkles size={14} className="text-gold-400" />
                <span className="text-sm font-semibold text-bark-600">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Instagram Feed */}{/*
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">@prajahita</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-bark-800">Follow Our Journey</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {instagramPosts.map((src, i) => (
              <div key={i} className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={src}
                  alt={`Instagram post ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-forest-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Newsletter CTA */}
      <section className="relative py-24 hero-bg overflow-hidden">
        <div className="absolute inset-0 leaf-pattern opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Leaf size={40} className="text-gold-400 mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream-50 mb-4">
            Start Your Natural Skincare Journey
          </h2>
          <p className="text-lg text-forest-200 mb-4">
            Subscribe and get <strong className="text-gold-400">10% off your first order</strong>, plus weekly skincare tips from our herbalists.
          </p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-3 text-gold-400 font-semibold text-lg">
              <CheckCircle size={24} />
              <span>Welcome to the Prajahita family! Check your inbox.</span>
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); setSubscribed(true) }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 bg-white/15 backdrop-blur border border-white/25 rounded-2xl text-cream-100 placeholder-forest-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              />
              <button type="submit" className="btn-gold px-7 py-4 rounded-2xl font-semibold text-sm whitespace-nowrap">
                Get 10% Off
              </button>
            </form>
          )}
          <p className="text-xs text-forest-300 mt-4">No spam, ever. Unsubscribe any time.</p>
        </div>
      </section>
    </div>
  )
}
