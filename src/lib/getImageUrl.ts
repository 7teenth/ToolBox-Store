export function getImageUrl(path: string): string {
  const cleaned = path.replace(/^\/+/, "");

  // если путь уже начинается с "assets/", оставляем как есть
  if (cleaned.startsWith("assets/")) {
    return `https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/${cleaned}`;
  }

  // если путь начинается с "logos/", "defaults/", "slides/" — добавляем "assets/"
  if (
    cleaned.startsWith("logos/") ||
    cleaned.startsWith("defaults/") ||
    cleaned.startsWith("slides/")
  ) {
    return `https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/${cleaned}`;
  }

  // иначе считаем, что это товар → добавляем "assets/products/"
  return `https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/products/${cleaned}`;
}