import NeemImg from '../imports/ing/neem.jpeg';
import AloeVeraImg from '../imports/ing/AloeVera.jpeg';
import RoseImg from '../imports/ing/Rose.jpeg';
import SandalwoodImg from '../imports/ing/Sandalwood.jpeg';
import ActivatedCharcoalImg from '../imports/ing/ActivatedCharcoal.jpeg';
import CoffeeImg from '../imports/ing/Coffee.jpeg';
import RicePowderImg from '../imports/ing/RicePowder.jpeg';
import MultaniMittiImg from '../imports/ing/MultaniMitti.jpeg';
import OatsImg from '../imports/ing/Oats.jpeg';
import OrangePeelImg from '../imports/ing/Orange Peel.jpeg';
import BeetrootImg from '../imports/ing/Beetroot.jpeg';
import GoatMilkImg from '../imports/ing/GoatMilk.jpeg';
import RedWineImg from '../imports/ing/RedWine.jpeg';
import SheaButterImg from '../imports/ing/SheaButter.jpeg';
import UbtanImg from '../imports/ing/Ubtan.jpeg';
import VitaminEImg from '../imports/ing/VitaminE.jpeg';
import TurmericImg from '../imports/ing/Turmeric.jpeg';
import LavenderImg from '../imports/ing/Lavender.jpeg';
import LemonPeelImg from '../imports/ing/LemonPeel.jpeg';

export type Ingredient = {
  id: string
  name: string
  scientificName: string
  origin: string
  image: string
  color: string
  benefits: string[]
  skinTypes: string[]
  description: string
  historicalUse: string
  keyProperty: string
}

export const ingredients = [
  {
    id: 'neem',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    origin: 'Indian Subcontinent',
    image: NeemImg,
    color: '#2E7D32',
    benefits: [
      'Antibacterial',
      'Anti-inflammatory',
      'Antifungal',
      'Helps reduce acne'
    ],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone'],
    description: 'A revered Ayurvedic medicinal tree known for naturally purifying and protecting the skin.',
    historicalUse: 'Used in Ayurveda for over 4,000 years to treat skin infections, wounds, and inflammatory conditions.',
    keyProperty: 'Natural antibacterial cleanser',
  },

  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientificName: 'Aloe vera',
    origin: 'Arabian Peninsula',
    image: AloeVeraImg,
    color: '#81C784',
    benefits: [
      'Deep hydration',
      'Soothes irritation',
      'Supports skin repair',
      'Cooling effect'
    ],
    skinTypes: ['Dry', 'Sensitive', 'Normal', 'Sun-Damaged'],
    description: 'A succulent plant rich in polysaccharides that helps soothe and moisturize skin.',
    historicalUse: 'Used by Ancient Egyptians, Greeks, and Indian medicine as the "plant of immortality" for burns and skin healing.',
    keyProperty: 'Intense skin hydration',
  },

  {
    id: 'rose',
    name: 'Rose',
    scientificName: 'Rosa damascena',
    origin: 'Middle East',
    image: RoseImg,
    color: '#E91E63',
    benefits: [
      'Hydrates skin',
      'Reduces redness',
      'Rich in antioxidants',
      'Balances skin'
    ],
    skinTypes: ['All Skin Types'],
    description: 'Rose petals contain natural antioxidants and soothing compounds that refresh the skin.',
    historicalUse: 'Used since ancient Persia and India in beauty rituals, perfumes, and herbal skincare.',
    keyProperty: 'Natural skin toner',
  },

  {
    id: 'sandalwood',
    name: 'Sandalwood',
    scientificName: 'Santalum album',
    origin: 'India',
    image: SandalwoodImg,
    color: '#C19A6B',
    benefits: [
      'Calms irritation',
      'Brightens complexion',
      'Reduces blemishes',
      'Cooling effect'
    ],
    skinTypes: ['Sensitive', 'Dry', 'Normal'],
    description: 'Premium aromatic wood prized for its cooling and complexion-enhancing properties.',
    historicalUse: 'A sacred Ayurvedic ingredient used in temples and skincare rituals for thousands of years.',
    keyProperty: 'Cooling anti-inflammatory',
  },

  {
    id: 'charcoal',
    name: 'Activated Charcoal',
    scientificName: 'Activated Carbon',
    origin: 'Modern cosmetic ingredient',
    image: ActivatedCharcoalImg,
    color: '#424242',
    benefits: [
      'Deep cleansing',
      'Removes impurities',
      'Absorbs excess oil',
      'Minimizes pores'
    ],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone'],
    description: 'Highly porous activated carbon that binds dirt, excess oil, and impurities.',
    historicalUse: 'Activated charcoal has been used in medicine for centuries for its powerful adsorption properties.',
    keyProperty: 'Powerful detoxifier',
  },

  {
    id: 'coffee',
    name: 'Coffee',
    scientificName: 'Coffea arabica',
    origin: 'Ethiopia',
    image: CoffeeImg,
    color: '#6F4E37',
    benefits: [
      'Natural exfoliation',
      'Rich in antioxidants',
      'Improves circulation',
      'Brightens dull skin'
    ],
    skinTypes: ['Normal', 'Combination', 'Oily'],
    description: 'Finely ground coffee naturally exfoliates while delivering antioxidant-rich compounds.',
    historicalUse: 'Coffee has been incorporated into modern skincare for exfoliation and antioxidant protection.',
    keyProperty: 'Antioxidant exfoliant',
  },

  {
    id: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    origin: 'East Asia',
    image: RicePowderImg,
    color: '#F5F5DC',
    benefits: [
      'Gentle exfoliation',
      'Brightens skin',
      'Softens texture',
      'Controls excess oil'
    ],
    skinTypes: ['All Skin Types'],
    description: 'Finely milled rice powder gently exfoliates while helping improve skin texture.',
    historicalUse: 'Rice powder has been used for centuries in Japanese, Korean, Chinese, and Ayurvedic beauty traditions.',
    keyProperty: 'Natural brightening exfoliant',
  },

  {
    id: 'multani-mitti',
    name: 'Multani Mitti',
    scientificName: 'Fuller\'s Earth',
    origin: 'South Asia',
    image: MultaniMittiImg,
    color: '#D2B48C',
    benefits: [
      'Absorbs excess oil',
      'Deep pore cleansing',
      'Detoxifies skin',
      'Reduces acne'
    ],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone'],
    description: 'A mineral-rich natural clay famous for oil control and deep cleansing.',
    historicalUse: 'Used in traditional Indian beauty rituals and Ayurvedic ubtans for centuries.',
    keyProperty: 'Oil-absorbing clay',
  },

  {
    id: 'oats',
    name: 'Oats',
    scientificName: 'Avena sativa',
    origin: 'Europe',
    image: OatsImg,
    color: '#D8C29D',
    benefits: [
      'Calms irritation',
      'Gentle exfoliation',
      'Moisturizes skin',
      'Strengthens skin barrier'
    ],
    skinTypes: ['Dry', 'Sensitive', 'Eczema-Prone'],
    description: 'Colloidal oats naturally soothe sensitive skin while supporting the moisture barrier.',
    historicalUse: 'Used in herbal skin remedies for centuries to relieve dryness and itching.',
    keyProperty: 'Skin-soothing moisturizer',
  },

  {
    id: 'orange-peel',
    name: 'Orange Peel',
    scientificName: 'Citrus sinensis',
    origin: 'China',
    image: OrangePeelImg,
    color: '#F57C00',
    benefits: [
      'Vitamin C rich',
      'Brightens complexion',
      'Reduces tanning',
      'Natural exfoliation'
    ],
    skinTypes: ['Normal', 'Oily', 'Combination'],
    description: 'Dried orange peel contains natural vitamin C and fruit acids for brighter skin.',
    historicalUse: 'Traditionally used in Ayurvedic and herbal skincare to improve complexion.',
    keyProperty: 'Vitamin C brightening',
  },

  {
    id: 'ubtan',
    name: 'Ubtan',
    scientificName: 'Traditional Ayurvedic Herbal Blend',
    origin: 'India',
    image: UbtanImg,
    color: '#C68642',
    benefits: [
      'Brightens skin',
      'Removes tan',
      'Gentle exfoliation',
      'Improves complexion'
    ],
    skinTypes: ['All Skin Types'],
    description: 'A traditional Ayurvedic blend of herbs, grains, and natural powders used for cleansing and glowing skin.',
    historicalUse: 'Used for centuries in Indian bridal ceremonies and Ayurvedic skincare.',
    keyProperty: 'Natural skin brightener',
  },
  {
    id: 'lemon-peel',
    name: 'Lemon Peel',
    scientificName: 'Citrus limon',
    origin: 'Asia',
    image: LemonPeelImg ,
    color: '#FDD835',
    benefits: [
      'Brightens complexion',
      'Rich in antioxidants',
      'Exfoliates',
      'Reduces excess oil'
    ],
    skinTypes: ['Oily', 'Combination'],
    description: 'Contains natural citric acid and vitamin C for brighter-looking skin.',
    historicalUse: 'Traditionally used in herbal remedies and natural skincare.',
    keyProperty: 'Natural brightener',
  },
  {
    id: 'beetroot',
    name: 'Beetroot',
    scientificName: 'Beta vulgaris',
    origin: 'Mediterranean Region',
    image: BeetrootImg,
    color: '#B71C1C',
    benefits: [
      'Rich in antioxidants',
      'Improves skin glow',
      'Hydrates',
      'Supports healthy complexion'
    ],
    skinTypes: ['All Skin Types'],
    description: 'Natural source of betalains and antioxidants that nourish the skin.',
    historicalUse: 'Used in traditional beauty remedies for a healthy glow.',
    keyProperty: 'Antioxidant-rich',
  },

  {
    id: 'shea-butter',
    name: 'Shea Butter',
    scientificName: 'Vitellaria paradoxa',
    origin: 'West Africa',
    image: SheaButterImg,
    color: '#F5DEB3',
    benefits: [
      'Deep moisturization',
      'Softens skin',
      'Supports skin barrier',
      'Rich in fatty acids'
    ],
    skinTypes: ['Dry', 'Sensitive', 'Normal'],
    description: 'Natural butter extracted from the nuts of the shea tree.',
    historicalUse: 'Used in African skincare traditions for centuries.',
    keyProperty: 'Intense moisturizer',
  },

  {
    id: 'goat-milk',
    name: 'Goat Milk',
    scientificName: 'Capra aegagrus hircus',
    origin: 'Middle East',
    image: GoatMilkImg,
    color: '#FFF8E1',
    benefits: [
      'Moisturizes',
      'Gentle cleansing',
      'Rich in lactic acid',
      'Softens skin'
    ],
    skinTypes: ['Dry', 'Sensitive', 'Mature'],
    description: 'Contains natural fats and lactic acid that help nourish the skin.',
    historicalUse: 'Famously used in beauty rituals dating back to Cleopatra.',
    keyProperty: 'Creamy nourishment',
  },

  {
    id: 'red-wine',
    name: 'Red Wine',
    scientificName: 'Vitis vinifera',
    origin: 'Mediterranean',
    image: RedWineImg,
    color: '#7B1E3A',
    benefits: [
      'Rich in antioxidants',
      'Supports skin elasticity',
      'Reduces signs of aging',
      'Brightens skin'
    ],
    skinTypes: ['Normal', 'Mature', 'Combination'],
    description: 'Derived from grapes and rich in polyphenols like resveratrol.',
    historicalUse: 'Wine extracts have long been used in European beauty traditions.',
    keyProperty: 'Resveratrol antioxidant',
  },
  {
  id: 'vitamin-e',
  name: 'Vitamin E',
  scientificName: 'Tocopherol',
  origin: 'Naturally found in vegetable oils, nuts, and seeds',
  image: VitaminEImg,
  color: '#F4C542',
  benefits: [
    'Powerful antioxidant',
    'Supports skin repair',
    'Helps retain moisture',
    'Protects skin barrier'
  ],
  skinTypes: ['All Skin Types'],
  description: 'A fat-soluble antioxidant that helps protect the skin from environmental damage and supports healthy skin.',
  historicalUse: 'Widely used in dermatology and cosmetics since the 20th century for skin conditioning.',
  keyProperty: 'Antioxidant protection',
},
{
  id: 'turmeric',
  name: 'Turmeric',
  scientificName: 'Curcuma longa',
  origin: 'India',
  image: TurmericImg,
  color: '#F4B400',
  benefits: [
    'Brightens complexion',
    'Reduces inflammation',
    'Antioxidant',
    'Helps reduce blemishes'
  ],
  skinTypes: ['Normal', 'Combination', 'Oily'],
  description: 'Golden Ayurvedic spice rich in curcumin with soothing and brightening properties.',
  historicalUse: 'Used in Ayurvedic beauty rituals for over 4,000 years.',
  keyProperty: 'Natural glow booster',
},
{
  id: 'lavender',
  name: 'Lavender',
  scientificName: 'Lavandula angustifolia',
  origin: 'Mediterranean',
  image: LavenderImg,
  color: '#8E7CC3',
  benefits: [
    'Calms skin',
    'Reduces redness',
    'Antioxidant',
    'Refreshing aroma'
  ],
  skinTypes: ['Sensitive', 'Normal', 'Combination'],
  description: 'Aromatic flowering herb valued for its soothing properties and relaxing scent.',
  historicalUse: 'Used since Roman times in baths and herbal medicine.',
  keyProperty: 'Calming botanical',
},

];