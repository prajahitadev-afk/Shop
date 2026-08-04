import neem from '../imports/neem soap.jpeg'
import oats from '../imports/oots_soap.jpeg'
import coffee from '../imports/coffee detan bar.jpeg'
import sandal from '../imports/sandel wood.jpeg'

export type Product = {
  id: string
  name: string
  tagline: string
  description: string
  usage: string
  precautions: string

  image: string
  images: string[]

  price: number
  originalPrice?: number

  rating: number
  reviewCount: number

  weight: string

  category: string

  badge?: 'bestseller' | 'new' | 'limited' | 'organic'

  skinType: string[]
  ingredients: string[]
  benefits: string[]
}
export const products: Product[] = [
  {
id:'1',
name:'Neem Herbal Soap',
tagline:'Purifies and protects skin',
description:'A handmade neem soap that deeply cleanses while keeping skin healthy.',
usage:'Apply on wet skin, lather and rinse.',
precautions:'Avoid contact with eyes.',
image:neem,
images:[neem],
price:149,
originalPrice:199,
rating:4.8,
reviewCount:120,
weight:'100 g',
category:'Herbal',
badge:'bestseller',
skinType:['Oily','Acne'],
ingredients:['Neem','Coconut Oil'],
benefits:[
'Controls acne',
'Reduces bacteria',
'Natural cleansing'
]
},

{
id:'2',
name:'Oats Milk Soap',
tagline:'Soft and moisturising',
description:'Perfect for dry skin.',
usage:'Use daily.',
precautions:'Store in a dry place.',
image:oats,
images:[oats],
price:169,
originalPrice:199,
rating:4.9,
reviewCount:160,
weight:'100 g',
category:'Moisturizing',
badge:'new',
skinType:['Dry','Sensitive'],
ingredients:['Oats','Milk'],
benefits:[
'Moisturises',
'Soft skin',
'Gentle exfoliation'
]
},

]
export const collections = [

  {
id:'1',
name:'Acne Care',
count:2,
image:neem,
icon:'🌿'
},
{
id:'2',
name:'Glow',
count:2,
image:coffee,
icon:'✨'
},
{
id:'3',
name:'Moisturising',
count:2,
image:oats,
icon:'💧'
},
{
id:'4',
name:'Luxury',
count:2,
image:sandal,
icon:'🌸'
}
]
