import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

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
export default function SubcategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [toolTypes, setToolTypes] = useState<ToolType[]>([]);
  const [loading, setLoading] = useState(false);

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
