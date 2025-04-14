
export type Category = 
  | 'electronics'
  | 'clothing'
  | 'accessories'
  | 'home'
  | 'beauty'
  | 'jewelry';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Filter {
  category?: Category | null;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
}
