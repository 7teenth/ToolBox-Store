import { GetServerSideProps } from "next";
import Head from "next/head";
import { supabase } from "../../lib/supabaseClient";
import { Product } from "../../types/product";
import { Layout } from "../../components/Layout";
import { ProductCard } from "../../components/ProductCard";
import Link from "next/link";

interface CatalogPageProps {
  categoryName: string;
  products: Product[];
  currentPage: number;
  totalPages: number;
  slug: string;
}

export default function CatalogPage({
  categoryName,
  products,
  currentPage,
  totalPages,
  slug,
}: CatalogPageProps) {
  return (
    <Layout>
      <Head>
        <title>{categoryName} – ToolBox Store</title>
      </Head>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{categoryName}</h1>

        {products.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10">
              {currentPage > 1 && (
                <Link
                  href={`/catalog/${slug}?page=${currentPage - 1}`}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ← Назад
                </Link>
              )}
              <span className="px-4 py-2 text-sm font-medium">
                Сторінка {currentPage} з {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/catalog/${slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Вперед →
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">
              Немає товарів у цій категорії.
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Повернутись до каталогу
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;
  const page = parseInt((context.query.page as string) || "1", 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (categoryError || !category) {
    return { notFound: true };
  }

  const {
    data: products,
    error: productError,
    count,
  } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("category_id", category.id)
    .range(offset, offset + limit - 1);

  if (productError) {
    console.error("❌ Error fetching products:", productError.message);
  }

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return {
    props: {
      categoryName: category.name,
      products: products ?? [],
      currentPage: page,
      totalPages,
      slug,
    },
  };
};
