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
  category_id: string;
}

const IMAGE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/categories/";

const SubcategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchSubcategory(slug as string);
  }, [slug]);

  const fetchSubcategory = async (slug: string) => {
    // Получаем подкатегорию по slug
    const { data: subs } = await supabase
      .from("subcategories")
      .select("id,name,slug,category_id")
      .eq("slug", slug)
      .single();

    if (!subs) return;
    setSubcategory(subs);

    // Получаем категорию
    const { data: cat } = await supabase
      .from("categories")
      .select("id,name,image_url")
      .eq("id", subs.category_id)
      .single();

    if (cat) setCategory(cat);
  };

  const getCategoryImageUrl = (url?: string | null) => {
    if (!url) return IMAGE_BASE_URL + "default.jpg";
    const fileName = url.split("/").pop();
    return IMAGE_BASE_URL + fileName;
  };

  if (!subcategory || !category)
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-600">
          <p>Завантаження підкатегорії...</p>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={getCategoryImageUrl(category.image_url)}
            alt={category.name}
            className="w-16 h-16 object-cover rounded-xl border"
          />
          <h1 className="text-3xl font-bold text-gray-900">
            {subcategory.name}
          </h1>
        </div>

        <p className="text-gray-700 mb-4">
          Категорія: <strong>{category.name}</strong>
        </p>

        {/* Тут можно отобразить товары или дополнительную информацию по подкатегории */}
        <div className="border rounded-xl p-6 bg-gray-50 text-gray-800">
          Інформація по підкатегорії "{subcategory.name}" буде відображена тут.
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SubcategoryPage;
