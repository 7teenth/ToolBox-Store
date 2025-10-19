import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface ToolType {
  id: string;
  name: string;
  slug: string;
  subcategory_id: string;
  image_url?: string | null;
}

const IMAGE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/tool_types/";

const SubcategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [tools, setTools] = useState<ToolType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubcategory = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      // 1️⃣ Получаем подкатегорию
      const { data: sub, error: subErr } = await supabase
        .from("subcategories")
        .select("id,name,slug")
        .eq("slug", slug)
        .single();

      if (subErr) throw subErr;
      setSubcategory(sub);

      // 2️⃣ Получаем Tool Types этой подкатегории
      const { data: toolTypes, error: toolErr } = await supabase
        .from("tool_types")
        .select("id,name,slug,image_url,subcategory_id")
        .eq("subcategory_id", sub.id)
        .order("name");

      if (toolErr) throw toolErr;
      setTools(toolTypes || []);
    } catch (e) {
      console.error("Error fetching subcategory:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) fetchSubcategory(slug as string);
  }, [slug, fetchSubcategory]);

  const getImage = (url?: string | null) =>
    url ? IMAGE_BASE_URL + url.split("/").pop() : "/placeholder.jpg";

  if (!subcategory)
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
        <h1 className="text-3xl font-bold mb-8">{subcategory.name}</h1>

        {loading ? (
          <div className="text-center text-gray-600 py-12">Завантаження...</div>
        ) : tools.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Немає інструментів у цій підкатегорії
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition"
                onClick={() => router.push(`/catalog/tool-type/${tool.slug}`)}
              >
                <img
                  src={getImage(tool.image_url)}
                  alt={tool.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center font-medium text-lg hover:text-yellow-600 transition">
                  {tool.name}
                </div>
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
