export interface Product {
  id: string; // UUID или строка из Supabase
  name: string;
  description: string;
  short_description?: string;

  price: number;
  image_url?: string;
  hover_image_url?: string;

  category?: string; // название категории (может быть пустым при выборке)
  subcategory_id?: string | null; // связь с подкатегорией
  brand?: string;

  stock?: number;
  views?: number;
  sales?: number;
  rating?: number;

  // Общие физические характеристики (необязательные)
  weight?: number;

  // Для электроинструментов
  power?: number; // мощность (Вт или Н·м)
  power_type?: "watts" | "newton" | "volts"; // уточнение единиц мощности
  is_brushless?: boolean;
  chuck_diameter?: string;
  rpm?: number;
  speeds?: number;
  removable_chuck?: boolean;

  // Тип инструмента
  tool_types?: {
    id?: string;
    name?: string;
  };

  // Дополнительные характеристики в свободной форме
  features?: Record<string, string | number | boolean>;

  // Универсальные характеристики для разных категорий
  specs?: {
    key: string;
    value: string | number | boolean;
  }[];

  status: "В наявності" | "Не в наявності"; 
}
