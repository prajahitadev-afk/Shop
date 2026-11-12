import { supabase } from '../lib/supabase'
import type { Testimonial } from '../types/testimonial'

const fallbackTestimonials: Testimonial[] = []

export async function getTestimonials() {
  if (!supabase) return fallbackTestimonials

  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })

  if (error) {
    return fallbackTestimonials
  }

  return (data ?? []) as Testimonial[]
}
