export function getImageUrl(path: string): string {
  const cleaned = path.replace(/^\/+/, "");

  if (cleaned.startsWith("assets/")) {
    return `https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/${cleaned}`;
  }

  if (
    cleaned.startsWith("logos/") ||
    cleaned.startsWith("defaults/") ||
    cleaned.startsWith("slides/") ||
    cleaned.startsWith("products/")
  ) {
    return `https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/${cleaned}`;
  }

  return `https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/products/${cleaned}`;
}