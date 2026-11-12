import { Product } from "./product";
import { Category } from "./category";
import { ProductImage } from "./productImage";
import { Ingredient } from "./ingredient";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./orderItem";
import { Benefit } from "./benefit";
import { SkinType } from "./skinType";
import { Testimonial } from "./testimonial";

export interface ProductWithRelations extends Omit<Product, 'images' | 'ingredients' | 'benefits'> {
  categoryDetails?: Category;

  images?: ProductImage[];

  ingredients?: Ingredient[];

  benefits?: Benefit[];

  skinTypes?: SkinType[];
}

export interface OrderWithRelations extends Order {
  customer?: Customer;

  items?: OrderItem[];
}

export interface CustomerWithOrders extends Customer {
  orders?: Order[];
}

export interface ProductCardData {
  id: string;

  name: string;

  tagline: string;

  price: number;

  original_price: number;

  rating: number;

  badge: string;

  image_url: string;
}

export interface ProductDetailData
  extends ProductWithRelations {
  imageGallery?: ProductImage[];
}

export interface HomePageData {
  featuredProducts: ProductCardData[];

  testimonials: Testimonial[];
}

export interface ShopPageData {
  products: ProductCardData[];

  totalProducts: number;
}

export interface CartItem {
  productId: string;

  name: string;

  image: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;
}

export interface ApiResponse<T> {
  data: T | null;

  error: string | null;

  success: boolean;
}
