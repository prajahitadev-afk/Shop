import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import type { Product } from '../types/product'

type Props = {
  product: Product
  onView: (id: string) => void
}

const badgeClasses = {
  bestseller: 'badge-bestseller',
  new: 'badge-new',
  limited: 'badge-limited',
  organic: 'badge-organic',
}

const badgeLabels = {
  bestseller: 'Best Seller',
  new: 'New Arrival',
  limited: 'Limited',
  organic: 'Organic',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? 'star-filled fill-current' : 'star-empty'}
        />
      ))}
    </div>
  )
}

export default function ProductCard({ product, onView }: Props) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart()
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleView = () => onView(product.id)

  return (
    <div
      className="product-card-hover bg-white rounded-2xl overflow-hidden border border-cream-200/80 group relative cursor-pointer"
      onClick={handleView}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleView()
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-cream-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`${badgeClasses[product.badge]} text-[10px] font-bold px-2.5 py-1 rounded-full`}>
              {badgeLabels[product.badge]}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-brown-700 text-cream-50 text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={e => {
              e.stopPropagation()
              toggleWishlist(product.id)
            }}
            className={`w-9 h-9 rounded-2xl shadow-lg flex items-center justify-center transition-all ${
              isWishlisted(product.id)
                ? 'bg-gold-400 text-brown-900'
                : 'bg-white/90 text-brown-600 hover:bg-gold-400 hover:text-brown-900'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart size={15} className={isWishlisted(product.id) ? 'fill-current' : ''} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              handleView()
            }}
            className="w-9 h-9 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center text-brown-600 hover:bg-sage-500 hover:text-white transition-all"
            aria-label="Quick view"
          >
            <Eye size={15} />
          </button>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={e => {
              e.stopPropagation()
              addToCart(product)
            }}
            className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag size={15} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-brown-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        <button
          onClick={e => {
            e.stopPropagation()
            handleView()
          }}
          className="block text-left w-full"
        >
          <h3 className="font-serif font-semibold text-brown-800 text-base leading-snug mb-1 group-hover:text-sage-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </button>

        <p className="text-xs text-brown-400 mb-3 line-clamp-2">{product.tagline}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.skinType.slice(0, 2).map(type => (
            <span key={type} className="text-[10px] px-2 py-0.5 bg-sage-50 text-sage-600 rounded-full border border-sage-100">
              {type}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-brown-800 text-lg">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-brown-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <span className="text-xs text-brown-400">{product.weight}</span>
        </div>
      </div>
    </div>
  )
}
