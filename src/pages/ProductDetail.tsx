import { useEffect, useMemo, useState } from 'react'
import { Star, Heart, ShoppingBag, Share2, ChevronDown, ChevronUp, CheckCircle, Plus, Minus, ArrowLeft, ArrowRight, Leaf, ZoomIn } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { supabase } from '../lib/supabase'
import { usePageMeta, SITE_NAME } from '../lib/seo'
import { getProductIngredientNames, getRelatedProductIds } from '../services/ingredientService'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout'

type Props = {
  productId: string
  onNavigate: (page: Page, id?: string) => void
}

type ReviewRow = {
  id?: string
  rating?: number | string | null
  review_text?: string | null
  review?: string | null
  comment?: string | null
  name?: string | null
  customer_name?: string | null
  created_at?: string | null
  verified?: boolean | null
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-cream-200">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="font-semibold text-brown-800">{title}</span>
        {open ? <ChevronUp size={16} className="text-brown-400" /> : <ChevronDown size={16} className="text-brown-400" />}
      </button>
      {open && (
        <div className="pb-4 text-sm text-brown-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ProductDetail({ productId, onNavigate }: Props) {
  const { products, loading } = useProducts()
  const product = useMemo(() => products.find(p => p.id === productId) ?? products[0] ?? null, [products, productId])
  const { addToCart, toggleWishlist, isWishlisted } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description')
  const [zoomed, setZoomed] = useState(false)
  const [ingredientNames, setIngredientNames] = useState<string[]>([])
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [shippingPolicy, setShippingPolicy] = useState<string | null>(null)
  const [returnPolicy, setReturnPolicy] = useState<string | null>(null)
  const [related, setRelated] = useState<typeof products>([])

  const productImages = product?.images ?? []
  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  usePageMeta({
    title: product ? `${product.name} | ${SITE_NAME}` : `Product | ${SITE_NAME}`,
    description: product ? `${product.tagline}. ${product.description}`.slice(0, 160) : undefined,
    jsonLd: product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images?.length ? product.images : product.image ? [product.image] : undefined,
          brand: { '@type': 'Brand', name: SITE_NAME },
          ...(product.reviewCount > 0
            ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount } }
            : {}),
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: product.price,
            availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          },
        }
      : null,
  })

  useEffect(() => {
    if (!product?.id) {
      setIngredientNames([])
      return
    }

    let isMounted = true

    const loadIngredients = async () => {
      const names = await getProductIngredientNames(product.id)
      if (isMounted) {
        setIngredientNames(names)
      }
    }

    void loadIngredients()

    return () => {
      isMounted = false
    }
  }, [product?.id])

  useEffect(() => {
    if (!product?.id || !supabase) {
      setReviews([])
      return
    }

    const client = supabase
    if (!client) {
      setReviews([])
      return
    }

    let isMounted = true

    const loadReviews = async () => {
      const reviewTables = ['reviews', 'product_reviews']

      for (const table of reviewTables) {
        const { data, error } = await client
          .from(table)
          .select('*')
          .eq('product_id', product.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (!error && Array.isArray(data)) {
          if (isMounted) {
            setReviews((data as ReviewRow[]) ?? [])
          }
          return
        }
      }

      if (isMounted) {
        setReviews([])
      }
    }

    void loadReviews()

    return () => {
      isMounted = false
    }
  }, [product?.id])

  useEffect(() => {
    if (!supabase) {
      setShippingPolicy(null)
      setReturnPolicy(null)
      return
    }

    const client = supabase
    if (!client) {
      setShippingPolicy(null)
      setReturnPolicy(null)
      return
    }

    let isMounted = true

    const loadPolicies = async () => {
      const tables = ['settings', 'site_settings', 'app_settings']

      for (const table of tables) {
        const { data, error } = await client
          .from(table)
          .select('shipping_policy, return_policy, shipping, returns')
          .limit(1)

        if (!error && Array.isArray(data) && data.length > 0) {
          const first = data[0] as Record<string, unknown>
          const shipping = typeof first.shipping_policy === 'string'
            ? first.shipping_policy
            : typeof first.shipping === 'string'
              ? first.shipping
              : null
          const returns = typeof first.return_policy === 'string'
            ? first.return_policy
            : typeof first.returns === 'string'
              ? first.returns
              : null

          if (isMounted) {
            setShippingPolicy(shipping)
            setReturnPolicy(returns)
          }
          return
        }
      }

      if (isMounted) {
        setShippingPolicy(null)
        setReturnPolicy(null)
      }
    }

    void loadPolicies()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!product || products.length === 0) {
      setRelated([])
      return
    }

    let isMounted = true

    const loadRelated = async () => {
      const { skinTypeIds } = await getRelatedProductIds(product.id)
      const currentSkinTypeIdSet = new Set(skinTypeIds)
      const scoredProducts = await Promise.all(
        products
          .filter((candidate) => candidate.id !== product.id)
          .map(async (candidate) => {
            const candidateIngredientNames = await getProductIngredientNames(candidate.id)
            const candidateSkinTypeData = await getRelatedProductIds(candidate.id)
            const sharedIngredients = candidateIngredientNames.filter((name) => new Set(ingredientNames).has(name)).length
            const sameCollection = candidate.collection === product.collection
            const sameSkinTypes = (candidateSkinTypeData.skinTypeIds ?? []).filter((id) => currentSkinTypeIdSet.has(id)).length
            const sameCategory = candidate.category === product.category

            return {
              candidate,
              score: Number(sharedIngredients > 0) * 1000 + Number(sameCollection) * 100 + Number(sameSkinTypes > 0) * 10 + Number(sameCategory),
              sharedIngredients,
            }
          })
      )

      const ranked = scoredProducts
        .sort((a, b) => {
          if (b.sharedIngredients !== a.sharedIngredients) return b.sharedIngredients - a.sharedIngredients
          return b.score - a.score
        })
        .map((entry) => entry.candidate)
        .slice(0, 4)

      if (isMounted) {
        setRelated(ranked)
      }
    }

    void loadRelated()

    return () => {
      isMounted = false
    }
  }, [product, products, ingredientNames])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const reviewCount = reviews.length > 0 ? reviews.length : product?.reviewCount ?? 0
  const averageRating = reviews.length > 0
    ? Number((reviews.reduce((sum, review) => sum + Number(review.rating ?? 0), 0) / reviews.length).toFixed(1))
    : Number(product?.rating ?? 0)
  const ratingDistribution = useMemo(() => {
    if (reviews.length === 0) {
      return [] as Array<{ stars: number; count: number }>
    }

    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((review) => Number(review.rating ?? 0) === stars).length,
    }))
  }, [reviews])

  if (loading && products.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-brown-400">
            <button onClick={() => onNavigate('home')} className="hover:text-sage-600 transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('shop')} className="hover:text-sage-600 transition-colors">Shop</button>
            <span>/</span>
            <span className="text-brown-700 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-cream-100 cursor-zoom-in group"
              onClick={() => setZoomed(!zoomed)}
            >
              <img
                src={product.images[activeImage] ?? product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100 group-hover:scale-105'}`}
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="glass w-9 h-9 rounded-2xl flex items-center justify-center">
                  <ZoomIn size={16} className="text-brown-700" />
                </div>
              </div>
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className={`badge-${product.badge} text-xs font-bold px-3 py-1.5 rounded-full`}>
                    {product.badge === 'bestseller' ? 'Best Seller' : product.badge === 'new' ? 'New Arrival' : product.badge === 'limited' ? 'Limited' : 'Organic'}
                  </span>
                </div>
              )}
              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveImage(i => (i - 1 + product.images.length) % product.images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 glass w-9 h-9 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowLeft size={15} className="text-brown-700" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveImage(i => (i + 1) % product.images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 glass w-9 h-9 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight size={15} className="text-brown-700" />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-3">
              {productImages.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-sage-400' : 'border-cream-200 hover:border-cream-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-sage-600 tracking-widest uppercase">{product.category}</span>
              <span className="text-brown-300">·</span>
              <span className="text-xs text-brown-400">{product.weight}</span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-800 mb-2">{product.name}</h1>
            <p className="text-brown-500 text-lg mb-5">{product.tagline}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} className={i <= Math.round(product.rating) ? 'star-filled fill-current' : 'star-empty'} />
                ))}
              </div>
              <span className="font-bold text-brown-800">{product.rating}</span>
              <button className="text-sm text-sage-600 underline">{reviewCount.toLocaleString()} reviews</button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-bold text-3xl text-brown-800">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-brown-400 line-through">₹{product.originalPrice}</span>
                  <span className="badge-new text-xs font-bold px-2.5 py-1 rounded-full">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Skin types */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-2">Ideal For</p>
              <div className="flex flex-wrap gap-2">
                {product.skinType.map((st: string) => (
                  <span key={st} className="text-xs px-3 py-1.5 bg-sage-50 text-sage-700 border border-sage-100 rounded-full font-medium">
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Key benefits */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-2">Key Benefits</p>
              <div className="grid grid-cols-1 gap-1.5">
                {product.benefits.map((benefit: string) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-brown-700">
                    <CheckCircle size={14} className="text-sage-500 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0 border border-cream-300 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-brown-600 hover:bg-cream-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold text-brown-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-brown-600 hover:bg-cream-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  added
                    ? 'bg-sage-500 text-cream-50 shadow-lg'
                    : 'btn-primary'
                }`}
              >
                {added ? (
                  <><CheckCircle size={16} /> Added to Cart!</>
                ) : (
                  <><ShoppingBag size={16} /> Add to Cart — ₹{product.price * quantity}</>
                )}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-colors ${
                  isWishlisted(product.id)
                    ? 'bg-gold-50 border-gold-300 text-gold-500'
                    : 'border-cream-300 text-brown-500 hover:border-gold-300 hover:text-gold-500'
                }`}
              >
                <Heart size={16} className={isWishlisted(product.id) ? 'fill-current' : ''} />
              </button>
            </div>

            <button
              onClick={() => { addToCart(product, quantity); onNavigate('checkout') }}
              className="w-full btn-gold py-3 rounded-2xl font-semibold text-sm mb-6"
            >
              Buy Now
            </button>

            {/* Ingredients preview */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Leaf size={14} className="text-sage-500" />
                <span className="text-xs font-semibold text-brown-600">Key Ingredients:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ingredientNames.length > 0 ? ingredientNames.map((ing: string) => (
                  <span key={ing} className="text-xs px-2 py-0.5 bg-white border border-cream-300 text-brown-500 rounded-full">
                    {ing}
                  </span>
                )) : null}
              </div>
            </div>

            <button className="flex items-center gap-2 text-xs text-brown-400 hover:text-brown-600 mt-4 transition-colors">
              <Share2 size={13} />
              Share this product
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="border-b border-cream-200 flex gap-0">
            {[
              { key: 'description', label: 'Description & Usage' },
              { key: 'ingredients', label: 'Full Ingredients' },
              { key: 'reviews', label: `Reviews (${reviewCount.toLocaleString()})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-sage-500 text-sage-700'
                    : 'border-transparent text-brown-500 hover:text-brown-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-brown-800 mb-3">About This Product</h3>
                  <p className="text-brown-600 leading-relaxed">{product.description}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AccordionItem title="How to Use">
                    <p>{product.usage}</p>
                  </AccordionItem>
                  <AccordionItem title="Precautions & Storage">
                    <p>{product.precautions}</p>
                  </AccordionItem>
                  {shippingPolicy || returnPolicy ? (
                    <AccordionItem title="Shipping & Returns">
                      {shippingPolicy && <p className="mb-2">{shippingPolicy}</p>}
                      {returnPolicy && <p>{returnPolicy}</p>}
                    </AccordionItem>
                  ) : null}
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="max-w-3xl">
                <h3 className="font-serif text-xl font-bold text-brown-800 mb-4">Full Ingredient List</h3>
                <div className="grid gap-3 mb-6">
                  {ingredientNames.length > 0 ? ingredientNames.map((ing: string) => (
                    <div key={ing} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-cream-200">
                      <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center flex-shrink-0">
                        <Leaf size={14} className="text-sage-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-brown-800 text-sm">{ing}</p>
                      </div>
                    </div>
                  )) : null}
                </div>
                {ingredientNames.length > 0 ? (
                  <p className="text-xs text-brown-400 italic">
                    Full INCI: {ingredientNames.join(', ')}
                  </p>
                ) : null}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl">
                {/* Rating summary */}
                <div className="flex gap-8 mb-8 p-6 bg-white rounded-2xl border border-cream-200">
                  <div className="text-center">
                    <div className="font-serif text-5xl font-bold text-brown-800 mb-1">{averageRating}</div>
                    <div className="flex justify-center gap-0.5 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} className={i <= Math.round(averageRating) ? 'star-filled fill-current' : 'star-empty'} />
                      ))}
                    </div>
                    <p className="text-xs text-brown-400">{reviewCount.toLocaleString()} reviews</p>
                  </div>
                  {ratingDistribution.length > 0 ? (
                    <div className="flex-1">
                      {ratingDistribution.map(({ stars, count }) => {
                        const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0
                        return (
                          <div key={stars} className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs text-brown-500 w-4">{stars}</span>
                            <Star size={10} className="star-filled fill-current" />
                            <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gold-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-brown-400 w-8">{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, i) => {
                      const rating = Number(review.rating ?? 0)
                      const text = review.review_text ?? review.review ?? review.comment ?? ''
                      const name = review.name ?? review.customer_name ?? 'Customer'
                      const date = review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently added'
                      return (
                        <div key={review.id ?? i} className="p-5 bg-white rounded-2xl border border-cream-200">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-brown-800 text-sm">{name}</span>
                                {review.verified ? (
                                  <span className="flex items-center gap-1 text-[10px] text-sage-600">
                                    <CheckCircle size={10} />Verified
                                  </span>
                                ) : null}
                              </div>
                              <div className="flex gap-0.5 mt-0.5">
                                {[1,2,3,4,5].map(i => (
                                  <Star key={i} size={11} className={i <= rating ? 'star-filled fill-current' : 'star-empty'} />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-brown-400">{date}</span>
                          </div>
                          {text ? <p className="text-sm text-brown-600">{text}</p> : null}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-5 bg-white rounded-2xl border border-cream-200 text-sm text-brown-600">
                    Reviews are not available from the database yet for this product.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-brown-800 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <ProductCard key={p.id} product={p} onView={id => onNavigate('product', id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
