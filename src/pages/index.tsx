import { GetServerSideProps } from "next";
import { supabase } from "../lib/supabaseClient";
import { Product } from "../types/product";
import { ProductCard } from "../components/ProductCard";
import { Layout } from "../components/Layout";
import { Carousel } from "../components/carousel";
import { Categories, Category } from "../components/Categories"; // <- импорт типа Category
import { Reviews } from "../components/Reviews";

interface HomeProps {
  popularProducts: Product[];
  categories: Category[]; // <- добавили категории
}

export default function Home({ popularProducts, categories }: HomeProps) {
  return (
    <Layout>
      <Carousel />
      <section className="popular-section mt-12 mb-12 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Популярные товары
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} isPopular />
          ))}
        </div>
      </section>
      <Categories categories={categories} />
      <style jsx>{`
        .popular-section {
          max-width: 1200px;
          margin: 0 auto;
        }
        h2 {
          color: #111;
        }
      `}</style>
      <Reviews
        reviews={[
          {
            id: 1,
            userName: "Иван",
            rating: 5,
            comment: "Отличный товар!",
            date: "2025-09-26",
          },
          {
            id: 2,
            userName: "Мария",
            rating: 4,
            comment: "Все понравилось, быстро доставили.",
            date: "2025-09-25",
          },
          {
            id: 3,
            userName: "Алексей",
            rating: 5,
            comment: "Рекомендую!",
            date: "2025-09-24",
          },
        ]}
      />
      ;
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: popularProducts } = await supabase
    .from("products")
    .select("*")
    .order("sales", { ascending: false })
    .limit(5);

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*");

  // Преобразуем поля категорий
  const formattedCategories = (categories || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image_url, // <- поле image_url из БД
    slug: cat.slug || "", // если есть slug
  }));

  console.log("Categories:", formattedCategories, "Error:", error);

  return {
    props: {
      popularProducts: popularProducts || [],
      categories: formattedCategories,
    },
  };
};
