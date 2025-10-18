import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

interface Category {
  id: string;
  name: string;
  image_url?: string | null;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

const IMAGE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/categories/";

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchCategoryWithSubcategories(id as string);
  }, [id]);

  const fetchCategoryWithSubcategories = async (categoryId: string) => {
    const { data: cat } = await supabase
      .from("categories")
      .select("id,name,image_url")
      .eq("id", categoryId)
      .single();

    if (!cat) return setCategory(null);
    setCategory(cat);

    const { data: subs } = await supabase
      .from("subcategories")
      .select("id,name,slug")
      .eq("category_id", categoryId)
      .order("name");

    setSubcategories(subs || []);
  };

  const getCategoryImageUrl = (url?: string | null) => {
    if (!url) return IMAGE_BASE_URL + "default.jpg";
    const fileName = url.split("/").pop();
    return IMAGE_BASE_URL + fileName;
  };

  if (!category)
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-600">
          <p>Завантаження категорії...</p>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-8">
          <img
            src={getCategoryImageUrl(category.image_url)}
            alt={category.name}
            className="w-16 h-16 object-cover rounded-xl border"
          />
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        </div>

        {subcategories.length === 0 ? (
          <p className="text-gray-700">У цій категорії немає підкатегорій.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subcategories.map((sub) => (
              <a
                key={sub.id}
                href={`/catalog/${sub.slug}`}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {sub.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  Переглянути підкатегорію
                </p>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CategoryPage;
