import { useState } from 'react'
import { Search, ArrowRight, Leaf } from 'lucide-react'
import { useIngredients } from '../hooks/useIngredients'
import { useSkinTypes } from '../hooks/useSkinTypes'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout'
type Props = { onNavigate: (page: Page, id?: string, shopSearch?: string) => void }

export default function Ingredients({ onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [skinFilter, setSkinFilter] = useState('All')
  const [selected, setSelected] = useState<string | null>(null)
  const { ingredients, loading } = useIngredients()
  const { skinTypes } = useSkinTypes()
  const skinTypeFilters = ['All', ...skinTypes.map(skinType => skinType.name)]

  const normalizedIngredients = ingredients

  const filtered = normalizedIngredients.filter(ing => {
    const matchSearch = !search ||
      ing.name.toLowerCase().includes(search.toLowerCase()) ||
      ing.benefits.some(b => b.toLowerCase().includes(search.toLowerCase()))
    const matchSkin = skinFilter === 'All' || ing.skinTypes.some(s => s.includes(skinFilter))
    return matchSearch && matchSkin
  })

  const selectedIng = normalizedIngredients.find(i => i.id === selected)

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="relative py-20 hero-bg overflow-hidden">
        <div className="absolute inset-0 leaf-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-400 mb-3 block">The Botanicals</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream-50 mb-4">
            Ingredients Library
          </h1>
          <p className="text-sage-200 text-xl max-w-2xl mx-auto">
            Every ingredient we use has a story, a science, and a purpose. Explore nature's most powerful skin-transforming botanicals.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
            <input
              type="text"
              placeholder="Search ingredients or benefits..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {skinTypeFilters.map(f => (
              <button
                key={f}
                onClick={() => setSkinFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  skinFilter === f
                    ? 'bg-sage-500 text-cream-50'
                    : 'bg-white text-brown-600 border border-cream-300 hover:border-sage-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {loading && <p className="text-sm text-brown-500 col-span-full">Loading ingredients…</p>}
              {!loading && filtered.map(ing => (
                <button
                  key={ing.id}
                  onClick={() => setSelected(selected === ing.id ? null : ing.id)}
                  className={`ingredient-card text-left rounded-2xl overflow-hidden border-2 transition-all ${
                    selected === ing.id
                      ? 'border-sage-400 shadow-xl'
                      : 'border-cream-200 bg-white hover:border-sage-200'
                  }`}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-[9px] text-white/70 italic">{ing.scientificName}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-serif font-bold text-brown-800 text-sm mb-2">{ing.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {ing.benefits.slice(0, 2).map(b => (
                        <span key={b} className="text-[9px] px-1.5 py-0.5 bg-sage-50 text-sage-600 rounded-full">{b}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-brown-400 mt-2 font-medium">{ing.origin}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {selectedIng && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-xl">
                <div className="relative h-56">
                  <img
                    src={selectedIng.image}
                    alt={selectedIng.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/70 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h2 className="font-serif font-bold text-2xl text-cream-50">{selectedIng.name}</h2>
                    <p className="text-sm italic text-cream-200/80">{selectedIng.scientificName}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf size={14} className="text-sage-500" />
                    <span className="text-xs font-semibold text-sage-600">{selectedIng.keyProperty}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-1">Origin</p>
                    <p className="text-sm text-brown-700">{selectedIng.origin}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-2">Benefits</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIng.benefits.map(b => (
                        <span key={b} className="text-xs px-2.5 py-1 bg-sage-50 text-sage-700 border border-sage-100 rounded-full">{b}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-1">Ideal Skin Types</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIng.skinTypes.map(s => (
                        <span key={s} className="text-xs px-2.5 py-1 bg-sage-100 text-sage-500 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-1">Historical Use</p>
                    <p className="text-xs text-brown-500 leading-relaxed italic">{selectedIng.historicalUse}</p>
                  </div>

                  <p className="text-sm text-brown-600 leading-relaxed border-t border-cream-200 pt-4">{selectedIng.description}</p>

                  <button
                    onClick={() => onNavigate('shop', undefined, selectedIng.name)}
                    className="w-full btn-primary py-3 rounded-2xl text-sm mt-4 flex items-center justify-center gap-2"
                  >
                    Shop Products with {selectedIng.name}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile ingredient detail */}
        {selectedIng && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-cream-200 max-h-[70vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-brown-800">{selectedIng.name}</h2>
                  <p className="text-sm italic text-brown-400">{selectedIng.scientificName}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-brown-400 hover:text-brown-700 p-1">✕</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedIng.benefits.map(b => (
                  <span key={b} className="text-xs px-2.5 py-1 bg-sage-50 text-sage-700 border border-sage-100 rounded-full">{b}</span>
                ))}
              </div>
              <p className="text-sm text-brown-600 leading-relaxed">{selectedIng.description}</p>
              <button
                onClick={() => { setSelected(null); onNavigate('shop', undefined, selectedIng.name) }}
                className="w-full btn-primary py-3 rounded-2xl text-sm mt-4"
              >
                Shop Products with {selectedIng.name}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
