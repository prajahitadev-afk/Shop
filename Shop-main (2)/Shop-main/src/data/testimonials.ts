export type Testimonial = {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  review: string
  product: string
  date: string
  verified: boolean
  skinType: string
  helpfulVotes: number
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
    rating: 5,
    review: 'I\'ve struggled with acne for 8 years and tried every product imaginable. The Neem & Turmeric bar cleared my skin in just 3 weeks. My dermatologist was shocked. The ingredients are genuinely high-quality — you can smell the difference from the first use.',
    product: 'Neem & Turmeric Glow Bar',
    date: 'January 15, 2025',
    verified: true,
    skinType: 'Oily, Acne-Prone',
    helpfulVotes: 247,
  },
  {
    id: 't2',
    name: 'Rahul Mehta',
    location: 'Bangalore, Karnataka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    rating: 5,
    review: 'As someone who\'s always skeptical of skincare products, I was genuinely surprised. The Activated Charcoal bar has completely eliminated the blackheads on my nose that I\'ve had since my teens. The lather is incredible and the fresh mint scent lasts all day.',
    product: 'Activated Charcoal Detox Bar',
    date: 'February 3, 2025',
    verified: true,
    skinType: 'Oily, Combination',
    helpfulVotes: 189,
  },
  {
    id: 't3',
    name: 'Meena Krishnamurthy',
    location: 'Chennai, Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
    rating: 5,
    review: 'I bought the Little Botanist set for my daughter who has eczema. Within 2 weeks of using the Lavender & Oats bar, her skin flare-ups reduced by 80%. I\'m so grateful. As a mother, knowing these ingredients are genuinely natural and safe brings me immense peace of mind.',
    product: 'Lavender & Oats Calm Bar',
    date: 'December 28, 2024',
    verified: true,
    skinType: 'Sensitive, Eczema',
    helpfulVotes: 312,
  },
  {
    id: 't4',
    name: 'Anjali Nair',
    location: 'Kochi, Kerala',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format',
    rating: 5,
    review: 'The Rose & Honey bar has become my absolute daily indulgence. My skin went from tight and flaky to incredibly soft within a week. The fragrance is like a spa experience every single morning. Worth every rupee — I\'ve now converted my entire family.',
    product: 'Rose & Honey Luxury Bar',
    date: 'March 10, 2025',
    verified: true,
    skinType: 'Dry',
    helpfulVotes: 156,
  },
  {
    id: 't5',
    name: 'Vikram Joshi',
    location: 'Pune, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
    rating: 4,
    review: 'The Coffee & Lemongrass bar is genuinely the best exfoliating soap I\'ve ever used. The scent is absolutely energizing — I look forward to my morning shower now. After 2 months, my skin texture has noticeably improved and I\'ve lost the grey dullness I had.',
    product: 'Coffee & Lemongrass Energy Bar',
    date: 'February 18, 2025',
    verified: true,
    skinType: 'Normal, Dull',
    helpfulVotes: 98,
  },
  {
    id: 't6',
    name: 'Deepika Reddy',
    location: 'Hyderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format',
    rating: 5,
    review: 'I\'m 52 and the Sandalwood Age Renewal bar has genuinely made a difference to my skin. The fine lines around my mouth have softened and my skin feels plumper. The sandalwood scent is extraordinary — luxurious, warm, and calming. This is now my forever soap.',
    product: 'Sandalwood Age Renewal Bar',
    date: 'January 28, 2025',
    verified: true,
    skinType: 'Mature, Dry',
    helpfulVotes: 203,
  },
]
