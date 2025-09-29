export interface Product {
  id: string; // ✅ вместо number
  name: string;
  description: string;
  short_description?: string;
  price: number;
  image_url: string;
  hover_image_url?: string;
  category: string;
  brand?: string;
  stock: number;
  views: number;
  sales: number;
  rating: number;
  weight?: number;
  power?: number;
  tool_types?: {
    name: string;
  };
  features?: Record<string, string | number>;

}