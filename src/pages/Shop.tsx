import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, Search, Grid3X3, LayoutList, X, ChevronDown, ChevronUp, Star } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from "../hooks/useProducts";
import { getIngredients, getProductsByIngredient } from '../services/ingredientService'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout'

type Props = {
  onNavigate: (page: Page, id?: string, shopSearch?: string) => void
  initialSearch?: string
}

type SortKey = 'featured' | 'bestselling' | 'newest' | 'price-asc' | 'price-desc' | 'rating'

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-cream-200 pb-5 mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-brown-700 mb-3"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  )
}

export default function Shop({ onNavigate, initialSearch = '' }: Props) {
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState('All')
  const [skinType, setSkinType] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('featured')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [ingredientProductIds, setIngredientProductIds] = useState<string[]>([])
  const PER_PAGE = 12
  const { products, loading } = useProducts()

  const availableCategories = useMemo(() => {
    const values = products
      .flatMap((product) => [product.category, product.collection])
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim())

    return ['All', ...Array.from(new Set(values))]
  }, [products])

  const availableSkinTypes = useMemo(() => {
    const values = products
      .flatMap((product) => product.skinType ?? [])
      .map((value) => value.trim())
      .filter(Boolean)

    return Array.from(new Set(values))
  }, [products])

  const maxPrice = useMemo(() => {
    const prices = products
      .map((product) => Number(product.price ?? 0))
      .filter((value) => Number.isFinite(value))

    return prices.length > 0 ? Math.max(...prices) : 1500
  }, [products])

  const hasStockData = useMemo(() => products.some((product) => typeof product.inStock === 'boolean'), [products])
  const priceUpperBound = Math.max(maxPrice, 1500)

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([0, priceUpperBound])
    }
  }, [products.length, priceUpperBound])

  useEffect(() => {
    setPage(1)
  }, [search, category, skinType, priceRange, minRating, inStockOnly, sort, ingredientProductIds])

  useEffect(() => {
    let isMounted = true

    const resolveIngredientProducts = async () => {
      const trimmedSearch = initialSearch.trim()
      if (!trimmedSearch) {
        if (isMounted) setIngredientProductIds([])
        return
      }

      const ingredients = await getIngredients()
      const matchedIngredient = ingredients.find(ingredient => ingredient.name.toLowerCase() === trimmedSearch.toLowerCase())

      if (!matchedIngredient) {
        if (isMounted) setIngredientProductIds([])
        return
      }

      const relatedProducts = await getProductsByIngredient(matchedIngredient.id)
      if (isMounted) setIngredientProductIds(relatedProducts.map(product => product.id))
    }

    void resolveIngredientProducts()

    return () => {
      isMounted = false
    }
  }, [initialSearch])

  const filtered = useMemo(() => {
    let result = [...products]

    if (ingredientProductIds.length > 0) {
      result = result.filter(product => ingredientProductIds.includes(product.id))
    } else if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => {
        const ingredients = Array.isArray(p.ingredients) ? p.ingredients : []
        const categoryText = (p.category ?? '').toLowerCase()
        const collectionText = (p.collection ?? '').toLowerCase()
        const descriptionText = (p.description ?? '').toLowerCase()
        const name = (p.name ?? '').toLowerCase()

        return name.includes(q)
          || descriptionText.includes(q)
          || ingredients.some((i: string) => i.toLowerCase().includes(q))
          || categoryText.includes(q)
          || collectionText.includes(q)
      })
    }

    if (category !== 'All') {
      result = result.filter((p) => {
        const productCategory = (p.category ?? '').trim().toLowerCase()
        const productCollection = (p.collection ?? '').trim().toLowerCase()
        const selectedCategory = category.trim().toLowerCase()

        return productCategory === selectedCategory || productCollection === selectedCategory
      })
    }

    if (skinType.length > 0) {
      result = result.filter((p) =>
        skinType.some((selectedType) =>
          p.skinType.some((productSkinType) =>
            productSkinType.trim().toLowerCase() === selectedType.trim().toLowerCase()
          )
        )
      )
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating)
    }

    if (inStockOnly && hasStockData) {
      result = result.filter(p => p.inStock === true)
    }

    switch (sort) {
      case 'bestselling':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'newest':
        result.sort((a, b) => (a.badge === 'new' ? -1 : b.badge === 'new' ? 1 : 0))
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    return result
  }, [products, search, category, skinType, priceRange, minRating, inStockOnly, sort, ingredientProductIds, hasStockData])

  const paginated = filtered.slice(0, page * PER_PAGE)
  const hasMore = filtered.length > page * PER_PAGE

  const toggleSkinType = (type: string) => {
    setSkinType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  const activeFilters = [
    category !== 'All' && category,
    ...skinType,
    priceRange[0] > 0 || priceRange[1] < priceUpperBound ? `₹${priceRange[0]}–₹${priceRange[1]}` : null,
    minRating > 0 ? `${minRating}+ Stars` : null,
    hasStockData && inStockOnly ? 'In Stock' : null,
  ].filter(Boolean) as string[]

  const Sidebar = () => (
    <div className="space-y-1">
      <FilterSection title="Category">
        <div className="space-y-1.5">
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                category === cat
                  ? 'bg-sage-50 text-sage-700 font-medium'
                  : 'text-brown-600 hover:bg-cream-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="px-1">
          <div className="flex justify-between text-sm text-brown-600 mb-3">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceUpperBound}</span>
          </div>
          <input
            type="range"
            min={0}
            max={priceUpperBound}
            step={50}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="range-slider w-full"
          />
          <div className="flex gap-2 mt-3">
            {[0, 200, 400, 600].map(p => (
              <button
                key={p}
                onClick={() => setPriceRange([p, priceUpperBound])}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                  priceRange[0] === p ? 'border-sage-400 bg-sage-50 text-sage-700' : 'border-cream-300 text-brown-500'
                }`}
              >
                ₹{p}+
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Skin Type">
        <div className="flex flex-wrap gap-2">
          {availableSkinTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleSkinType(type)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                skinType.includes(type)
                  ? 'bg-sage-500 text-cream-50 border-sage-500'
                  : 'bg-white text-brown-600 border-cream-300 hover:border-sage-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          {[4, 4.5, 4.8].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`flex items-center gap-2 w-full text-sm px-3 py-2 rounded-lg transition-colors ${
                minRating === r ? 'bg-sage-50 text-sage-700' : 'text-brown-600 hover:bg-cream-100'
              }`}
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={11} className={i <= r ? 'star-filled fill-current' : 'star-empty'} />
                ))}
              </div>
              <span>{r}+ Stars</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={false}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-sage-500"
          />
          <span className="text-sm text-brown-600">In Stock Only</span>
        </label>
      </FilterSection>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="text-4xl mb-3">🌿</div>
          <p className="text-brown-700 font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-sage-500 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 mb-2">Our Collection</h1>
          <p className="text-sage-200 text-sm sm:text-base">Discover {products.length} premium herbal soap formulas</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full sm:flex-1 sm:min-w-64 sm:max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
            <input
              type="text"
              placeholder="Search soaps, ingredients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-300 rounded-2xl text-sm text-brown-700 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-cream-300 rounded-2xl text-sm text-brown-700 focus:outline-none focus:ring-2 focus:ring-sage-400/30 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="bestselling">Best Selling</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View toggle */}
            <div className="flex bg-white border border-cream-300 rounded-2xl overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-sage-500 text-cream-50' : 'text-brown-500 hover:bg-cream-100'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2.5 transition-colors ${view === 'list' ? 'bg-sage-500 text-cream-50' : 'text-brown-500 hover:bg-cream-100'}`}
              >
                <LayoutList size={16} />
              </button>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-cream-300 rounded-2xl text-sm text-brown-700 w-full sm:w-auto"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 bg-sage-500 text-cream-50 text-xs rounded-full flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {search && (
          <div className="mb-4 text-sm text-sage-700 bg-sage-50 border border-sage-200 rounded-xl px-3 py-2">
            Showing products matching “{search}”.
          </div>
        )}

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-xs text-brown-500 font-medium">Active filters:</span>
            {activeFilters.map(f => (
              <span key={f} className="flex items-center gap-1.5 text-xs bg-sage-50 text-sage-700 border border-sage-200 px-3 py-1 rounded-full">
                {f}
                <button onClick={() => {
                  if (f === category) setCategory('All')
                  else if (skinType.includes(f)) setSkinType(prev => prev.filter(t => t !== f))
                  else if (f.includes('₹')) setPriceRange([0, priceUpperBound])
                  else if (f.includes('Stars')) setMinRating(0)
                  else if (f === 'In Stock') setInStockOnly(false)
                }}>
                  <X size={11} />
                </button>
              </span>
            ))}
            <button
              onClick={() => { setCategory('All'); setSkinType([]); setPriceRange([0, priceUpperBound]); setMinRating(0); setInStockOnly(false) }}
              className="text-xs text-brown-400 hover:text-brown-600 underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-5 border border-cream-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-brown-800 flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Filters
                </h2>
                {activeFilters.length > 0 && (
                  <button
                    onClick={() => { setCategory('All'); setSkinType([]); setPriceRange([0, priceUpperBound]); setMinRating(0); setInStockOnly(false) }}
                    className="text-xs text-sage-600 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <Sidebar />
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1 min-w-0">
            <p className="text-sm text-brown-500 mb-5">
              Showing <strong className="text-brown-800">{filtered.length}</strong> products
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="font-serif text-xl text-brown-700 mb-2">No products found</h3>
                <p className="text-brown-400">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <>
                <div className={`grid gap-5 ${
                  view === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {paginated.map(product => (
                    view === 'grid' ? (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onView={id => onNavigate('product', id)}
                      />
                    ) : (
                      <div key={product.id} className="bg-white rounded-2xl border border-cream-200 overflow-hidden flex gap-5 p-4 hover:border-sage-200 hover:shadow-md transition-all">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-28 h-28 object-cover rounded-2xl flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-bold text-brown-800 text-lg">{product.name}</h3>
                          <p className="text-sm text-brown-500 mt-1 line-clamp-2">{product.tagline}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} size={12} className={i <= Math.round(product.rating) ? 'star-filled fill-current' : 'star-empty'} />
                              ))}
                            </div>
                            <span className="text-xs text-brown-400">({product.reviewCount})</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between flex-shrink-0">
                          <div className="text-right">
                            <div className="font-bold text-brown-800">₹{product.price}</div>
                            {product.originalPrice && (
                              <div className="text-xs text-brown-400 line-through">₹{product.originalPrice}</div>
                            )}
                          </div>
                          <button
                            onClick={() => onNavigate('product', product.id)}
                            className="btn-primary px-4 py-2 rounded-2xl text-xs"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setPage(p => p + 1)}
                      className="btn-primary px-10 py-3.5 rounded-2xl text-sm"
                    >
                      Load More Products ({filtered.length - paginated.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-brown-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-brown-800">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-brown-500 hover:text-brown-700">
                <X size={18} />
              </button>
            </div>
            <Sidebar />
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-full btn-primary py-3 rounded-2xl mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
