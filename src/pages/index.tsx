import { GetServerSideProps } from "next";
import Head from "next/head";
import { supabase } from "../lib/supabaseClient";
import { Product } from "../types/product";
import { Review } from "../types/review";
import { ProductCard } from "../components/ProductCard";
import { Layout } from "../components/Layout";
import { Carousel } from "../components/carousel";
import { Categories, Category } from "../components/Categories";
import { ReviewList } from "../components/ReviewList";

interface HomeProps {
  popularProducts: Product[];
  categories: Category[];
  featuredReviews: Review[];
}

export default function Home({
  popularProducts,
  categories,
  featuredReviews,
}: HomeProps) {
  return (
    <Layout>
      <Head>
        <title>ToolBox Store – Головна</title>
      </Head>

      <Carousel />

      <section className="popular-section mt-12 mb-12 bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-6 rounded-xl shadow-md max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Популярні товари
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} isPopular />
          ))}
        </div>
      </section>

      <Categories categories={categories} />

      {featuredReviews.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <h2 className="text-2xl font-bold text-center">Відгуки покупців</h2>
          <ReviewList reviews={featuredReviews} />
        </section>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: rawProducts, error: productError } = await supabase
    .from("products")
    .select(
      `
      *,
      tool_types(id, name),
      categories(name)
    `
    )
    .limit(5);

  if (productError)
    console.error("❌ Error fetching products:", productError.message);

  const popularProducts: Product[] = (rawProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    brand: p.brand || "",
    stock: p.stock ?? 0,
    description: p.description || "",
    short_description: p.short_description || "",
    image_url: p.image_url || "",
    hover_image_url: p.hover_image_url || "",
    category: p.categories?.name || "",
    subcategory_id: p.subcategory_id ?? undefined,
    views: p.views ?? 0,
    sales: p.sales ?? 0,
    rating: p.rating ?? 0,
    weight: p.weight ?? undefined,
    power: p.power_watts ?? undefined,
    power_type: p.power_type ? "watts" : undefined,
    is_brushless: p.power_type === "Безщітковий",
    chuck_diameter: p.chuck_diameter ?? undefined,
    rpm: p.rpm ?? undefined,
    speeds: p.speeds ?? undefined,
    removable_chuck: p.removable_chuck ?? undefined,
    tool_types: p.tool_types
      ? { id: p.tool_types.id, name: p.tool_types.name }
      : undefined,
    features: {},
    specs: [],
  }));

  // Форматируем категории
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("*");
  if (categoryError)
    console.error("❌ Error fetching categories:", categoryError.message);
  const formattedCategories: Category[] = (categories || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    image_url: cat.image_url,
    slug: cat.slug || "",
  }));

  // Формируем отзывы
  const { data: rawReviews, error: reviewError } = await supabase
    .from("reviews")
    .select("*")
    .gte("rating", 4);
  if (reviewError)
    console.error("❌ Error fetching reviews:", reviewError.message);
  const allReviews: Review[] = (rawReviews || []).map((r: any) => ({
    id: r.id,
    userName: r.user_name,
    rating: r.rating,
    comment: r.comment,
    date: r.date ?? new Date().toISOString(),
  }));

  const shuffled = allReviews.sort(() => 0.5 - Math.random());
  const featuredReviews = shuffled.slice(0, 3);

  // Заменяем undefined на null для сериализации Next.js
  const serializableProducts = popularProducts.map((p) => ({
    ...p,
    power: p.power ?? null,
    weight: p.weight ?? null,
    chuck_diameter: p.chuck_diameter ?? null,
    rpm: p.rpm ?? null,
    speeds: p.speeds ?? null,
    removable_chuck: p.removable_chuck ?? null,
    tool_types: p.tool_types ?? null,
    subcategory_id: p.subcategory_id ?? null,
  }));

  return {
    props: {
      popularProducts: serializableProducts,
      categories: formattedCategories,
      featuredReviews,
    },
  };
};
