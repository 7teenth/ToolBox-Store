export function getImageUrl(path: string): string {
  if (!path) return "";

  // Если это уже полный URL, возвращаем как есть
  if (path.startsWith("http")) return path;

  // Прибираємо зайві слеші на початку та подвійні дефіси
  const cleaned = path.replace(/^\/+/, "").replace(/--+/g, "-");
  const base =
    "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets";

  let finalUrl = "";

  if (
    cleaned.startsWith("categories/") ||
    cleaned.startsWith("defaults/") ||
    cleaned.startsWith("logos/") ||
    cleaned.startsWith("slides/")
  ) {
    // системні папки
    finalUrl = `${base}/${cleaned}`;
  } else if (cleaned.startsWith("products/")) {
    // якщо вже є products — не додаємо знову
    finalUrl = `${base}/${cleaned}`;
  } else {
    // звичайний продукт
    finalUrl = `${base}/products/${cleaned}`;
  }

  // прибираємо випадкові подвійні слеші чи дефіси
  finalUrl = finalUrl.replace(/([^:])\/{2,}/g, "$1/").replace(/--+/g, "-");

  return finalUrl;
}
