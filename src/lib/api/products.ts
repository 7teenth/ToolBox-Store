import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types/product';

/**
 * Получить все товары из таблицы `products`
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('[fetchProducts] Supabase error:', error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Получить один товар по ID
 */
export async function fetchProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
  console.error(`[fetchProductById] Supabase error:`, error.message);
  console.log("ID товара:", id);
  return null;
}

  return data;
}