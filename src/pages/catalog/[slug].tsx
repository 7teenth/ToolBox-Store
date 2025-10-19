import React, { useEffect, useState, useCallback } from "react";
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
  image_url?: string | null;
}

interface ToolType {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

const IMAGE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/categories/";

const SubcategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [toolTypes, setToolTypes] = useState<ToolType[]>([]);
  const [loading, setLoading] = useState(false);

  // Получаем подкатегорию и категорию
  const fetchSubcategory = useCallback(async (slug: string) => {
    try {
      const { data: sub } = await supabase
        .from("subcategories")
        .select("id,name,slug,category_id,image_url")
        .eq("slug", slug)
        .single();

      if (!sub) return;

      setSubcategory(sub);

      const { data: cat } = await supabase
        .from("categories")
        .select("id,name,image_url")
        .eq("id", sub.category_id)
        .single();

      if (cat) setCategory(cat);
    } catch (e) {
      console.error("Error fetching subcategory:", e);
    }
  }, []);

  // Получаем Tool Types по подкатегории
  const fetchToolTypes = useCallback(async () => {
    if (!subcategory) return;
    setLoading(true);
    try {
      const { data: tts } = await supabase
        .from("tool_types")
        .select("id,name,slug,image_url")
        .eq("subcategory_id", subcategory.id)
        .order("name");

      setToolTypes(tts || []);
    } catch (e) {
      console.error("Error fetching tool types:", e);
      setToolTypes([]);
    } finally {
      setLoading(false);
    }
  }, [subcategory]);

  useEffect(() => {
    if (slug) fetchSubcategory(slug as string);
  }, [slug, fetchSubcategory]);

  useEffect(() => {
    if (subcategory) fetchToolTypes();
  }, [subcategory, fetchToolTypes]);

  const getCategoryImageUrl = (url?: string | null) =>
    url
      ? IMAGE_BASE_URL + url.split("/").pop()
      : IMAGE_BASE_URL + "default.jpg";

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
        {/* Шапка подкатегории */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={getCategoryImageUrl(
              subcategory.image_url ?? category.image_url
            )}
            alt={subcategory.name}
            className="w-16 h-16 object-cover rounded-xl border"
          />
          <h1 className="text-3xl font-bold text-gray-900">
            {subcategory.name}
          </h1>
        </div>

        {/* Сетка Tool Types */}
        {loading ? (
          <div className="text-center text-gray-600 py-12">
            Завантаження типів інструментів...
          </div>
        ) : toolTypes.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            Типів інструментів не знайдено
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {toolTypes.map((tt) => (
              <div
                key={tt.id}
                onClick={() => router.push(`/catalog/tool-type/${tt.slug}`)}
                className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={tt.image_url ?? "/placeholder-tooltype.jpg"}
                  alt={tt.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center font-medium">{tt.name}</div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default SubcategoryPage;
