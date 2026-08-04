import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, AtSign, MessageCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  { q: 'How long does a Prajahita soap bar typically last?', a: 'With proper care and storage on a dry soap dish, a 100g bar typically lasts 4–6 weeks with daily use. Keep your bar dry between uses by storing it on a well-draining soap dish.' },
  { q: 'Are your soaps safe for sensitive skin and children?', a: 'Yes. Our Lavender & Oats and Aloe Vera Gentle bars are specifically formulated for sensitive skin and children above 6 months. Always patch test first and consult a dermatologist for severe skin conditions.' },
  { q: 'Do you offer wholesale or bulk ordering?', a: 'Yes! We offer wholesale pricing for retailers, spas, hotels, and corporate gifting. Contact us at wholesale@prajahita.in or use the form below with "Wholesale Inquiry" as your subject.' },
  { q: 'What is your return policy?', a: 'We offer 30-day hassle-free returns for unused products in original packaging. For hygiene reasons, opened personal care products cannot be returned unless defective.' },
  { q: 'How do you ship and what are the delivery times?', a: 'We ship pan-India via Delhivery, Bluedart, and India Post. Standard delivery is 3–7 business days. Express delivery (1–3 days) is available in major cities. International shipping is available to select countries.' },
  { q: 'Are all your ingredients truly 100% natural?', a: 'Absolutely. Every ingredient is certified natural or organic. We publish full INCI ingredient lists on every product page and welcome any questions about specific ingredients.' },
]


function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-cream-200">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-4 text-left gap-4">
        <span className="font-medium text-brown-800 text-sm">{q}</span>
        {open ? <ChevronUp size={16} className="text-brown-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-brown-400 flex-shrink-0" />}
      </button>
      {open && <div className="pb-4 text-sm text-brown-600 leading-relaxed">{a}</div>}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputCls = 'w-full px-4 py-3 bg-white border border-cream-300 rounded-2xl text-sm text-brown-700 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-400 transition-colors'

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="py-16 hero-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-400 mb-3 block">Get in Touch</span>
          <h1 className="font-serif text-5xl font-bold text-cream-50 mb-3">We're Here to Help</h1>
          <p className="text-sage-200 text-lg">Questions, orders, wholesale, or just want to say hello — we'd love to hear from you.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brown-800 mb-6">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'prajahitadev@gmail.com', href: 'mailto:prajahitadev@gmail.com' },
                  { icon: Phone, label: 'Phone', value: '+91 91826 26287', href: 'tel:+919182626287' },
                  { icon: MessageCircle, label: 'WhatsApp', value: '+91 91826 26287', href: '#' },
                  { icon: MapPin, label: 'Address', value: 'Opposite degree college, Ichapuram, Andhra Pradesh,532312 ', href: '#' },
                  { icon: Clock, label: 'Business Hours', value: 'Mon–Sat: 9:00 AM – 6:00 PM IST', href: undefined },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-cream-200">
                    <div className="w-10 h-10 rounded-2xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-sage-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brown-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-brown-700 hover:text-sage-600 transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-sm text-brown-700">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="p-5 bg-white rounded-2xl border border-cream-200">
              <p className="font-semibold text-brown-800 mb-4">Follow Us</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { Icon: AtSign, label: '@prajahita', platform: 'Instagram', onclick: () => window.open('https://www.instagram.com/prajahitaherbal?igsh=d21lZmphdXZ0eXZo', '_blank') },
                //   { Icon: Share2, label: 'Prajahita', platform: 'Facebook', onclick: () => window.open('https://www.facebook.com/prajahita/', '_blank') },
                //   { Icon: Rss, label: '@prajahita', platform: 'Twitter', onclick: () => window.open('https://twitter.com/prajahita', '_blank') },
                //   { Icon: Video, label: 'Prajahita', platform: 'YouTube', onclick: () => window.open('https://www.youtube.com/prajahita', '_blank') },
                 ].map(({ Icon, label, platform, onclick }) => (
                  <button key={platform} className="flex items-center gap-2 p-3 bg-cream-50 rounded-2xl hover:bg-sage-50 hover:border-sage-200 border border-transparent transition-colors" onClick={onclick}>
                    <Icon size={16} className="text-sage-500" />
                    <div className="text-left">
                      <p className="text-[10px] text-brown-400">{platform}</p>
                      <p className="text-xs font-medium text-brown-700">{label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
{/*             
            <div className="rounded-2xl overflow-hidden border border-cream-200 bg-cream-100 h-48 relative">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop&auto=format"
                alt="Bangalore location map"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2">
                  <MapPin size={14} className="text-sage-600" />
                  <span className="text-sm font-medium text-brown-800">Koramangala, Bangalore</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-brown-800 mb-6">Send Us a Message</h2>

              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="text-sage-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-brown-800 mb-2">Message Received!</h3>
                  <p className="text-brown-500">We'll get back to you within 24 hours. Thank you for reaching out.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-sage-600 font-medium hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brown-500 mb-1.5">Subject *</label>
                      <select
                        required
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className={inputCls}
                      >
                        <option value="">Select a subject</option>
                        <option>Order Inquiry</option>
                        <option>Product Question</option>
                        <option>Return / Exchange</option>
                        <option>Wholesale Inquiry</option>
                        <option>Corporate Gifting</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brown-500 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary py-4 rounded-2xl font-semibold">
                    Send Message
                  </button>
                  <p className="text-xs text-brown-400 text-center">We typically respond within 24 hours on business days.</p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3 block">Quick Answers</span>
            <h2 className="font-serif text-4xl font-bold text-brown-800">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-cream-200">
            {faqs.map(faq => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
