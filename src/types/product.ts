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
  subcategory_id?: string; // ✅ уже есть
  power_type?: string; // ✅ добавь это поле
  tool_types?: {
    name: string;
    id?: string; // ✅ если ты фильтруешь по id
  };
  features?: Record<string, string | number>;
  specs?: { key: string; value: string }[];
}