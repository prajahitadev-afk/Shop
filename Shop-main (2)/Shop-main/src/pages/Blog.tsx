type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout'
type Props = { onNavigate: (page: Page) => void }

export default function Blog({ onNavigate }: Props) {
  void onNavigate
  return null
}

// import { useState } from 'react'
// import { Clock, Tag, ArrowRight, Search, User } from 'lucide-react'

// type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'contact' | 'cart' | 'checkout'
// type Props = { onNavigate: (page: Page) => void }

// const posts = [
//   {
//     id: 'neem-skin-benefits',
//     title: 'The Ancient Power of Neem: 10 Proven Benefits for Modern Skin',
//     excerpt: 'For over 4,000 years, neem has been Ayurveda\'s answer to virtually every skin concern. Discover the science behind this remarkable tree\'s dermatological properties.',
//     image: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=800&h=500&fit=crop&auto=format',
//     author: 'Kavitha Nair',
//     authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&auto=format',
//     date: 'March 12, 2025',
//     readTime: '7 min read',
//     category: 'Ingredient Education',
//     tags: ['Neem', 'Acne', 'Ayurveda', 'Natural Skincare'],
//     featured: true,
//   },
//   {
//     id: 'morning-skincare-routine',
//     title: 'The Perfect Herbal Morning Skincare Routine for Every Skin Type',
//     excerpt: 'Build a morning ritual that works with your skin\'s natural rhythm. Our herbalist-designed routines use targeted natural soaps to address specific concerns.',
//     image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=500&fit=crop&auto=format',
//     author: 'Dr. Arjun Sharma',
//     authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&auto=format',
//     date: 'February 28, 2025',
//     readTime: '9 min read',
//     category: 'Skincare Routines',
//     tags: ['Morning Routine', 'Skincare', 'Natural Beauty'],
//     featured: true,
//   },
//   {
//     id: 'turmeric-brightening',
//     title: 'Turmeric and Skin Brightening: What the Science Actually Says',
//     excerpt: 'Beyond the hype, what does peer-reviewed research tell us about curcumin\'s effects on melanin production, inflammation, and skin luminosity?',
//     image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&h=500&fit=crop&auto=format',
//     author: 'Dr. Arjun Sharma',
//     authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&auto=format',
//     date: 'February 14, 2025',
//     readTime: '11 min read',
//     category: 'Science & Research',
//     tags: ['Turmeric', 'Brightening', 'Pigmentation', 'Science'],
//   },
//   {
//     id: 'cold-process-soap',
//     title: 'What is Cold Process Soap and Why Does It Matter?',
//     excerpt: 'Understanding the difference between cold-process handmade soap and commercial bars reveals why your skin might be reacting to "soap" that isn\'t really soap at all.',
//     image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=500&fit=crop&auto=format',
//     author: 'Vikram Anand',
//     authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&auto=format',
//     date: 'January 30, 2025',
//     readTime: '6 min read',
//     category: 'Craft & Process',
//     tags: ['Cold Process', 'Soapmaking', 'Natural'],
//   },
//   {
//     id: 'sensitive-skin-guide',
//     title: 'The Complete Guide to Natural Skincare for Sensitive Skin',
//     excerpt: 'Sensitive skin doesn\'t have to mean limited options. Discover the gentle botanical formulas and routines that nourish without triggering reactions.',
//     image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&h=500&fit=crop&auto=format',
//     author: 'Kavitha Nair',
//     authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&auto=format',
//     date: 'January 18, 2025',
//     readTime: '13 min read',
//     category: 'Skin Concerns',
//     tags: ['Sensitive Skin', 'Eczema', 'Gentle Skincare', 'Lavender'],
//   },
//   {
//     id: 'eco-packaging',
//     title: 'Our Zero-Waste Packaging Journey: What We\'ve Learned',
//     excerpt: 'Replacing all plastic packaging with sustainable alternatives wasn\'t simple. Meenakshi Pillai shares the challenges, breakthroughs, and what\'s next.',
//     image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=500&fit=crop&auto=format',
//     author: 'Meenakshi Pillai',
//     authorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&auto=format',
//     date: 'December 22, 2024',
//     readTime: '8 min read',
//     category: 'Sustainability',
//     tags: ['Eco-Friendly', 'Sustainability', 'Zero Waste', 'Packaging'],
//   },
// ]

// const categories = ['All', 'Ingredient Education', 'Skincare Routines', 'Science & Research', 'Craft & Process', 'Skin Concerns', 'Sustainability']

// export default function Blog({ onNavigate }: Props) {
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('All')
//   const [selected, setSelected] = useState<string | null>(null)

//   const selectedPost = posts.find(p => p.id === selected)

//   const filtered = posts.filter(p => {
//     const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
//     const matchCat = category === 'All' || p.category === category
//     return matchSearch && matchCat
//   })

//   if (selectedPost) {
//     return (
//       <div className="min-h-screen bg-cream-50">
//         <div className="relative h-80 overflow-hidden">
//           <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
//           <div className="absolute inset-0 bg-gradient-to-t from-brown-900/70 to-brown-900/20" />
//           <div className="absolute bottom-8 left-0 right-0">
//             <div className="max-w-3xl mx-auto px-4">
//               <span className="text-xs font-semibold text-gold-400 tracking-widest uppercase">{selectedPost.category}</span>
//               <h1 className="font-serif text-3xl md:text-4xl font-bold text-cream-50 mt-2 leading-tight">{selectedPost.title}</h1>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//           <div className="flex items-center gap-4 mb-8 pb-8 border-b border-cream-200">
//             <img src={selectedPost.authorImage} alt={selectedPost.author} className="w-12 h-12 rounded-full object-cover" />
//             <div>
//               <p className="font-semibold text-brown-800">{selectedPost.author}</p>
//               <div className="flex items-center gap-2 text-xs text-brown-400">
//                 <span>{selectedPost.date}</span>
//                 <span>·</span>
//                 <Clock size={11} />
//                 <span>{selectedPost.readTime}</span>
//               </div>
//             </div>
//             <button onClick={() => setSelected(null)} className="ml-auto text-sm text-sage-600 hover:underline flex items-center gap-1">
//               ← Back to Blog
//             </button>
//           </div>

//           <div className="prose prose-bark max-w-none">
//             <p className="text-lg text-brown-600 leading-relaxed mb-6">{selectedPost.excerpt}</p>
//             <p className="text-brown-600 leading-relaxed mb-6">
//               Natural skincare is at an inflection point. Consumers are increasingly aware that the synthetic ingredients that have dominated beauty formulations for decades come with real trade-offs — for skin health, for personal health, and for planetary health. The good news is that science is catching up with what traditional herbalists have known for millennia.
//             </p>
//             <h2 className="font-serif text-2xl font-bold text-brown-800 mb-4 mt-8">The Ayurvedic Foundation</h2>
//             <p className="text-brown-600 leading-relaxed mb-6">
//               Ayurveda, the 5,000-year-old Indian system of medicine, classified every plant, mineral, and animal substance by its properties and therapeutic applications. The skin was understood not just as a barrier but as an organ that both absorbs from and reflects the state of the body within. This holistic view produced some of the most sophisticated skincare protocols the world has ever known.
//             </p>
//             <h2 className="font-serif text-2xl font-bold text-brown-800 mb-4 mt-8">Modern Validation</h2>
//             <p className="text-brown-600 leading-relaxed mb-6">
//               Contemporary dermatological research has repeatedly validated the efficacy of Ayurvedic botanicals. PubMed, the world's most comprehensive database of peer-reviewed medical literature, contains hundreds of clinical studies confirming the anti-inflammatory, antimicrobial, and skin-protective properties of ingredients like neem, turmeric, and aloe vera.
//             </p>
//             <h2 className="font-serif text-2xl font-bold text-brown-800 mb-4 mt-8">Practical Application</h2>
//             <p className="text-brown-600 leading-relaxed">
//               The key to efficacy lies not just in the ingredient itself, but in how it's prepared and formulated. Cold-process soap-making preserves the bioactive compounds that heating would destroy. This is why our bars perform differently — and better — than products manufactured at high temperatures using synthetic actives.
//             </p>
//           </div>

//           <div className="mt-8 flex flex-wrap gap-2">
//             {selectedPost.tags.map(tag => (
//               <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-sage-50 text-sage-700 border border-sage-100 rounded-full">
//                 <Tag size={10} />
//                 {tag}
//               </span>
//             ))}
//           </div>

//           <div className="mt-12 pt-8 border-t border-cream-200 text-center">
//             <p className="text-brown-600 mb-4">Ready to try natural herbal skincare for yourself?</p>
//             <button onClick={() => onNavigate('shop')} className="btn-primary px-8 py-3 rounded-2xl inline-flex items-center gap-2">
//               Shop Our Collection <ArrowRight size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-cream-50">
//       {/* Header */}
//       <section className="py-16 hero-bg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-400 mb-3 block">Knowledge Hub</span>
//           <h1 className="font-serif text-5xl font-bold text-cream-50 mb-3">The Prajahita Journal</h1>
//           <p className="text-sage-200 text-lg">Skincare science, herbal wisdom, and sustainable beauty</p>
//         </div>
//       </section>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Search & filter */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-10">
//           <div className="relative flex-1 max-w-sm">
//             <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
//             <input
//               type="text"
//               placeholder="Search articles..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400/30"
//             />
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {categories.map(c => (
//               <button
//                 key={c}
//                 onClick={() => setCategory(c)}
//                 className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
//                   category === c ? 'bg-sage-500 text-cream-50' : 'bg-white text-brown-600 border border-cream-300 hover:border-sage-300'
//                 }`}
//               >
//                 {c}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Featured */}
//         <div className="grid md:grid-cols-2 gap-6 mb-10">
//           {filtered.filter(p => p.featured).map(post => (
//             <button
//               key={post.id}
//               onClick={() => setSelected(post.id)}
//               className="group text-left rounded-3xl overflow-hidden border border-cream-200 bg-white hover:shadow-xl hover:border-sage-200 transition-all"
//             >
//               <div className="relative h-52 overflow-hidden">
//                 <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
//                 <div className="absolute top-4 left-4">
//                   <span className="badge-organic text-xs font-bold px-3 py-1 rounded-full">Featured</span>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <span className="text-xs font-semibold text-gold-500">{post.category}</span>
//                 <h2 className="font-serif text-xl font-bold text-brown-800 mt-1 mb-2 group-hover:text-sage-700 transition-colors">{post.title}</h2>
//                 <p className="text-sm text-brown-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
//                 <div className="flex items-center gap-3">
//                   <img src={post.authorImage} alt={post.author} className="w-8 h-8 rounded-full object-cover" />
//                   <div className="text-xs text-brown-400">
//                     <span className="font-medium text-brown-600">{post.author}</span> · {post.readTime}
//                   </div>
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* All posts */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {filtered.filter(p => !p.featured || category !== 'All').map(post => (
//             <button
//               key={post.id}
//               onClick={() => setSelected(post.id)}
//               className="group text-left rounded-2xl overflow-hidden border border-cream-200 bg-white hover:shadow-lg hover:border-sage-200 transition-all"
//             >
//               <div className="relative h-40 overflow-hidden">
//                 <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
//               </div>
//               <div className="p-4">
//                 <span className="text-[10px] font-semibold text-gold-500 uppercase tracking-wider">{post.category}</span>
//                 <h3 className="font-serif font-bold text-brown-800 mt-1 mb-2 text-sm group-hover:text-sage-700 transition-colors line-clamp-2">{post.title}</h3>
//                 <div className="flex items-center justify-between text-xs text-brown-400">
//                   <div className="flex items-center gap-1.5">
//                     <User size={11} />
//                     {post.author}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Clock size={11} />
//                     {post.readTime}
//                   </div>
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
