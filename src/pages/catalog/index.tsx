import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Category } from "@/types/category";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

const CatalogIndex = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .then(({ data }) => {
        setCategories(data ?? []);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Каталог</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog/${cat.id}`}
              className="p-6 border rounded-xl hover:shadow-lg transition flex flex-col items-center justify-center text-center bg-white group"
            >
              <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CatalogIndex;
