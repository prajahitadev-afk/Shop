import { Leaf, Award, Heart, Globe, Users, Sprout, CheckCircle, ArrowRight } from 'lucide-react'

type Page = 'home' | 'shop' | 'product' | 'about' | 'ingredients' | 'blog' | 'contact' | 'cart' | 'checkout'
type Props = { onNavigate: (page: Page) => void }

const timeline = [
  { year: '2018', title: 'The Beginning', desc: 'Founded in a small Bangalore kitchen by Kavitha Nair, a botanist with a passion for Ayurvedic skincare. First 50 bars sold at a local farmers market.' },
  { year: '2019', title: 'First Formulas', desc: 'Developed the signature Neem & Turmeric formula after 6 months of research. Partnered with organic farmers in Tamil Nadu for ingredient sourcing.' },
  { year: '2020', title: 'Online Launch', desc: 'Launched prajahita.in with 12 products. Received our first GMP certification. Expanded team to 8 artisan soapmakers.' },
  { year: '2021', title: 'Recognition', desc: 'Won the "Best Natural Skincare Brand" at India Beauty Awards. Crossed 10,000 customers. Launched the Sensitive Skin and Children\'s Collection.' },
  { year: '2022', title: 'Scaling Impact', desc: 'Partnered with 23 organic farms across India. Launched zero-waste packaging initiative. Reached 25,000 customers across India.' },
  { year: '2023', title: 'Certifications', desc: 'Achieved ECOCERT and Cruelty-Free International certification. Expanded to men\'s and anti-aging collections. Opened our first physical studio.' },
  { year: '2024', title: 'Community', desc: 'Over 50,000 happy customers. Launched the Skin Type Quiz and personalized recommendation engine. Introduced corporate gifting program.' },
  { year: '2025', title: 'Today', desc: 'A thriving community of natural skincare enthusiasts. 48 formulas, 20+ botanical ingredients, and an unwavering commitment to nature-first skincare.' },
]
/*
const team = [
  { name: 'Kavitha Nair', role: 'Founder & Chief Formulator', bio: 'Botanist with 15 years of Ayurvedic research experience. Studied herbal medicine at the Institute of Ayurveda, Trivandrum.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&auto=format' },
  { name: 'Dr. Arjun Sharma', role: 'Head of Research & Development', bio: 'Dermatologist and skin biologist. Oversees clinical testing protocols and ingredient safety evaluations.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&auto=format' },
  { name: 'Meenakshi Pillai', role: 'Head of Sustainability', bio: 'Environmental scientist committed to zero-waste manufacturing, responsible ingredient sourcing, and ecological packaging.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format' },
  { name: 'Vikram Anand', role: 'Master Soapmaker', bio: '20 years of cold-process soapmaking experience. Trained traditional artisans and developed our signature soap-making methodology.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format' },
]
*/
const values = [
  { icon: Leaf, title: 'Nature First', desc: 'Every ingredient decision begins with nature. We use only what the earth provides, without synthetic shortcuts.' },
  { icon: Heart, title: 'Crafted with Care', desc: 'Small batch, handmade production ensures every bar receives the attention and quality it deserves.' },
  { icon: Globe, title: 'Planet Conscious', desc: 'From biodegradable packaging to carbon-neutral shipping, every choice considers our environmental impact.' },
  { icon: Users, title: 'Community Impact', desc: 'We partner directly with 23 organic farms, supporting farmer livelihoods and sustainable agricultural practices.' },
  { icon: Award, title: 'Quality Assured', desc: 'GMP certified facility, dermatologist-tested formulas, and rigorous batch testing before every product ships.' },
  { icon: Sprout, title: 'Rooted in Tradition', desc: 'Our formulas draw from 5,000 years of Ayurvedic wisdom, scientifically validated for modern skin concerns.' },
]

export default function About({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="relative py-24 hero-bg overflow-hidden">
        <div className="absolute inset-0 leaf-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-400 mb-4 block">Our Story</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream-50 mb-6 leading-tight">
              Born from Nature,
              <span className="text-gradient-gold block">Built on Trust</span>
            </h1>
            <p className="text-xl text-sage-200 leading-relaxed">
              Prajahita began not as a business, but as a personal quest — one botanist's search for a truly natural soap that wouldn't compromise on efficacy or ethics.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-sage-50 rounded-3xl p-10 border border-sage-100">
              <div className="w-12 h-12 rounded-2xl bg-sage-500 flex items-center justify-center mb-6">
                <Leaf size={22} className="text-cream-50" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brown-800 mb-4">Our Mission</h2>
              <p className="text-brown-600 leading-relaxed">
                To make premium natural skincare accessible to every Indian household — formulated without compromise, crafted with care, and delivered with an unwavering commitment to purity, sustainability, and measurable skin health outcomes.
              </p>
            </div>
            <div className="bg-gold-300/20 rounded-3xl p-10 border border-gold-300/40">
              <div className="w-12 h-12 rounded-2xl bg-gold-400 flex items-center justify-center mb-6">
                <Sprout size={22} className="text-brown-900" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brown-800 mb-4">Our Vision</h2>
              <p className="text-brown-600 leading-relaxed">
                A world where the global skincare industry returns to nature — where "clean beauty" isn't a marketing tagline but an industry standard. We're building that future, one handcrafted bar at a time.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">The Founding Story</span>
              <h2 className="font-serif text-4xl font-bold text-brown-800 mb-6">From Kitchen to Community</h2>
              <div className="space-y-4 text-brown-600 leading-relaxed">
                <p>In 2018, botanist Kavitha Nair was diagnosed with contact dermatitis — a skin reaction triggered by the very commercial soaps she'd been using for decades. Conventional soaps, she discovered, were loaded with synthetic surfactants, artificial fragrances, and preservatives her sensitized skin couldn't tolerate.</p>
                <p>Drawing on her 10-year background in botanical research and Ayurvedic medicine, Kavitha began formulating her own soaps in her Bangalore kitchen. The results were remarkable — not just for her skin, but for everyone who tried her early batches.</p>
                <p>Word spread. Friends asked for more. A local farmers market stall turned into an online store. What started as personal necessity became a movement: proving that you don't have to choose between what's good for your skin and what's good for the planet.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop&auto=format" alt="Soapmaking" className="rounded-2xl object-cover h-full" />
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1583228741574-5f3b3c63c8ca?w=400&h=250&fit=crop&auto=format" alt="Herbs" className="rounded-2xl object-cover h-36" />
                <img src="https://images.unsplash.com/photo-1547484929-7b78e1322339?w=400&h=250&fit=crop&auto=format" alt="Ingredients" className="rounded-2xl object-cover h-36" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">What We Stand For</span>
            <h2 className="font-serif text-4xl font-bold text-brown-800">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-cream-200 hover:border-sage-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-2xl bg-sage-50 flex items-center justify-center mb-4">
                  <v.icon size={18} className="text-sage-500" />
                </div>
                <h3 className="font-serif font-bold text-brown-800 mb-2">{v.title}</h3>
                <p className="text-sm text-brown-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">Our Journey</span>
            <h2 className="font-serif text-4xl font-bold text-brown-800">From Seed to Bloom</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sage-200 via-gold-300 to-sage-200" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} pl-12 md:pl-0`}>
                  <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-white border-2 border-sage-300 flex items-center justify-center -translate-x-0 md:-translate-x-1/2 z-10">
                    <div className="w-3 h-3 rounded-full bg-sage-400" />
                  </div>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-cream-50 rounded-2xl p-5 border border-cream-200">
                      <span className="text-xs font-bold text-gold-500 tracking-widest">{item.year}</span>
                      <h3 className="font-serif font-bold text-brown-800 mt-1 mb-2">{item.title}</h3>
                      <p className="text-sm text-brown-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}{/*
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">The People</span>
            <h2 className="font-serif text-4xl font-bold text-brown-800">Meet Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden border border-cream-200 group">
                <div className="h-56 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-brown-800">{member.name}</h3>
                  <p className="text-xs font-semibold text-sage-600 mb-2">{member.role}</p>
                  <p className="text-xs text-brown-500 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        */}
      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-brown-800 mb-10">Certified Standards We Meet</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {['USDA Organic', 'Cruelty-Free International', 'Vegan Society', 'GMP Certified', 'ISO 22716', 'ECOCERT', 'FDA Compliant'].map(cert => (
              <div key={cert} className="flex items-center gap-2 px-5 py-3 bg-sage-50 border border-sage-100 rounded-2xl">
                <CheckCircle size={16} className="text-sage-500" />
                <span className="font-semibold text-brown-700 text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-sage-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-cream-50 mb-4">Experience the Prajahita Difference</h2>
          <p className="text-sage-200 mb-8">Join 50,000+ customers who've made the switch to genuinely natural skincare.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold"
          >
            Shop Our Collection <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}
