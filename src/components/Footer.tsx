import { Leaf, Share2, Rss, Video, AtSign, Mail, Phone, MapPin, ArrowRight, Shield, Recycle, Heart } from 'lucide-react'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout'

type Props = {
  onNavigate: (page: Page) => void
}

const trustBadges = [
  { icon: Shield, label: '100% Natural' },
  //{ icon: Award, label: 'GMP Certified' },
  { icon: Recycle, label: 'Eco-Friendly' },
  { icon: Heart, label: 'Cruelty-Free' },
]

const footerLinks = {
  shop: [
    { label: 'All Products', page: 'shop' as Page },
    //{ label: 'Best Sellers', page: 'shop' as Page },
    //{ label: 'New Arrivals', page: 'shop' as Page },
    //{ label: 'Gift Sets', page: 'shop' as Page },
    //{ label: 'Bundles', page: 'shop' as Page },
  ],
  company: [
    //{ label: 'About Us', page: 'about' as Page },
    //{ label: 'Our Story', page: 'about' as Page },
    { label: 'Ingredients', page: 'ingredients' as Page },
    //{ label: 'Blog', page: 'blog' as Page },
    { label: 'Contact', page: 'contact' as Page },
  ],
  support: [
    { label: 'FAQs', page: 'contact' as Page },
    // { label: 'Shipping Policy', page: 'contact' as Page },
    // { label: 'Returns & Refunds', page: 'contact' as Page },
    // { label: 'Track Order', page: 'contact' as Page },
    // { label: 'Privacy Policy', page: 'contact' as Page },
  ],
}

export default function Footer({ onNavigate }: Props) {
  return (
    <footer className="bg-brown-800 text-cream-200">
      {/* Trust badges */}
      <div className="border-b border-brown-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map(badge => (
              <div key={badge.label} className="flex items-center justify-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sage-600/40 flex items-center justify-center flex-shrink-0">
                  <badge.icon size={18} className="text-gold-400" />
                </div>
                <span className="text-sm font-medium text-cream-200">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-sage-500 to-sage-400 rounded-2xl flex items-center justify-center">
                <Leaf size={18} className="text-cream-50" />
              </div>
              <div>
                <div className="font-serif font-bold text-xl text-cream-50">Prajahita</div>
                <div className="text-[9px] tracking-[0.2em] uppercase text-gold-400">Herbal Soaps</div>
              </div>
            </div>
            <p className="text-sm text-brown-300 leading-relaxed mb-6 max-w-sm">
              Crafting premium handmade herbal soaps using nature's finest ingredients since 2018. Every bar is a promise of purity, sustainability, and transformative skincare.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 bg-brown-700 border border-brown-600 rounded-2xl text-sm text-cream-200 placeholder-brown-400 focus:outline-none focus:border-gold-400 transition-colors"
                />
                <button className="btn-gold px-4 py-2.5 rounded-2xl text-sm flex-shrink-0">
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-xs text-brown-400 mt-2">Get 10% off your first order + skincare tips</p>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[AtSign, Share2, Rss, Video].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-2xl bg-brown-700 hover:bg-sage-600 flex items-center justify-center transition-colors group"
                >
                  <Icon size={15} className="text-brown-300 group-hover:text-cream-50 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </p>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.page)}
                      className="text-sm text-brown-300 hover:text-cream-200 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-brown-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-6">
              <a href="mailto:hello@prajahita.in" className="flex items-center gap-2 text-sm text-brown-300 hover:text-cream-200 transition-colors">
                <Mail size={14} className="text-gold-400" />
                prajahitadev@gmail.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-brown-300 hover:text-cream-200 transition-colors">
                <Phone size={14} className="text-gold-400" />
                +91 91826 26287
              </a>
              <span className="flex items-center gap-2 text-sm text-brown-300">
                <MapPin size={14} className="text-gold-400" />
                Opposite degree college, Ichapuram, Andhra Pradesh,532312
              </span>
            </div>

            {/* <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=40&h=25&fit=crop&auto=format" alt="Secure payment" className="h-5 opacity-40" />
              <span className="text-xs text-brown-400">Secured payments by</span>
              <span className="text-xs font-semibold text-brown-300">Razorpay</span>
            </div> */}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brown-500">
            <p>© 2025 Prajahita Natural Soaps Pvt. Ltd. All rights reserved.</p>
            <p>Made with <span className="text-gold-500">♥</span> in India · Handcrafted with Nature's Finest</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
