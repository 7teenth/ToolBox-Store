import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export default function CatalogIndexPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<
    Record<string, Subcategory[]>
  >({});
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = (id: string) => {
    setOpenCategory((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Каталог категорій
        </h1>

        {loading ? (
          <div className="text-center text-gray-600 py-12">Завантаження...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            Категорії не знайдено
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition relative"
              >
                <img
                  alt={cat.name}
                  className="w-full h-40 object-cover cursor-pointer"
                  onClick={() => router.push(`/catalog/category/${cat.slug}`)}
                />
                <div className="p-4 flex items-center justify-between">
                  <span className="font-medium">{cat.name}</span>
                  <button
                    onClick={() => toggleDropdown(cat.id)}
                    className="text-gray-500 hover:text-black transition"
                  >
                    {openCategory === cat.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>

                {openCategory === cat.id && subcategories[cat.id] && (
                  <div className="bg-gray-50 border-t px-4 py-2">
                    {subcategories[cat.id].map((sub) => (
                      <div
                        key={sub.id}
                        className="py-1 text-sm text-gray-700 hover:text-black cursor-pointer"
                        onClick={() =>
                          router.push(`/catalog/subcategory/${sub.slug}`)
                        }
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};