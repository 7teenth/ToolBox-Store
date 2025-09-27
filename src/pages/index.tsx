import { GetServerSideProps } from "next";
import { supabase } from "../lib/supabaseClient";
import { Product } from "../types/product";
import { ProductCard } from "../components/ProductCard";
import { Layout } from "../components/Layout";
import { Carousel } from "../components/carousel";
import { Categories, Category } from "../components/Categories";
import { Reviews } from "../components/Reviews";

interface HomeProps {
  popularProducts: Product[];
  categories: Category[];
}

export default function Home({ popularProducts, categories }: HomeProps) {
  return (
    <Layout>
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

      <Reviews
        reviews={[
          {
            id: 1,
            userName: "Іван",
            rating: 5,
            comment: "Чудовий товар!",
            date: "2025-09-26",
          },
          {
            id: 2,
            userName: "Марія",
            rating: 4,
            comment: "Все сподобалося, швидко доставили.",
            date: "2025-09-25",
          },
          {
            id: 3,
            userName: "Олексій",
            rating: 5,
            comment: "Рекомендую!",
            date: "2025-09-24",
          },
        ]}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: popularProducts, error: productError } = await supabase
    .from("products")
    .select("*, tool_types(name)")
    .limit(5);

  if (productError) {
    console.error("❌ Error fetching products:", productError.message);
  }

  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("*");

  if (categoryError) {
    console.error("❌ Error fetching categories:", categoryError.message);
  }

  const formattedCategories = (categories || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    image_url: cat.image_url,
    slug: cat.slug || "",
  }));

  return {
    props: {
      popularProducts: popularProducts ?? [],
      categories: formattedCategories,
    },
  };
};
