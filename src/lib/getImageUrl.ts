export function getImageUrl(path: string): string {
  if (!path) return '';

  const cleaned = path.replace(/^\/+/, '');

  const base = 'https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets';

  if (
    cleaned.startsWith('categories/') ||
    cleaned.startsWith('defaults/') ||
    cleaned.startsWith('logos/') ||
    cleaned.startsWith('slides/')
  ) {
    return `${base}/${cleaned}`;
  }

  // Всё остальное считаем товаром
  return `${base}/products/${cleaned}`;
}