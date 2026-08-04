import { useEffect, useState } from 'react'
import { getTestimonials } from '../services/testimonialService'
import type { Testimonial } from '../types/testimonial'

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getTestimonials().then(data => {
      if (active) setTestimonials(data)
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return { testimonials, loading }
}
