import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  image_url?: string | null;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

const IMAGE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets/categories/";

const Catalog: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoverDropdown, setHoverDropdown] = useState<string | null>(null);
  const [clickDropdown, setClickDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoriesWithSubcategories();
  }, []);

  const fetchCategoriesWithSubcategories = async () => {
    const { data: cats } = await supabase
      .from("categories")
      .select("id,name,image_url")
      .order("name");

    if (!cats) return;

    const { data: subs } = await supabase
      .from("subcategories")
      .select("id,name,slug,category_id");

    const formatted: Category[] = cats.map((cat) => ({
      ...cat,
      subcategories:
        subs
          ?.filter((sub) => sub.category_id === cat.id)
          .map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
          })) || [],
    }));

    setCategories(formatted);
  };

  const toggleClickDropdown = (catId: string) => {
    setClickDropdown(clickDropdown === catId ? null : catId);
  };

  const getCategoryImageUrl = (url?: string | null) => {
    if (!url) return IMAGE_BASE_URL + "default.jpg";
    const fileName = url.split("/").pop(); // удаляем лишнюю папку
    return IMAGE_BASE_URL + fileName;
  };

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          Каталог
        </h1>

        <div className="flex flex-col gap-6">
          {categories.map((cat) => {
            const isOpen = clickDropdown === cat.id || hoverDropdown === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl shadow-lg overflow-visible transition-all duration-300 cursor-pointer hover:shadow-2xl"
                onMouseEnter={() => {
                  if (!clickDropdown) setHoverDropdown(cat.id);
                }}
                onMouseLeave={() => {
                  if (!clickDropdown) setHoverDropdown(null);
                }}
              >
                {/* Карточка кликабельная */}
                <div
                  className="flex items-center justify-between p-6"
                  onClick={() => {
                    window.location.href = `/catalog/category/${cat.id}`; // открываем страницу категории со всеми подкатегориями
                  }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getCategoryImageUrl(cat.image_url)}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded-xl border"
                    />
                    <h2 className="text-xl font-semibold text-gray-800">
                      {cat.name}
                    </h2>
                  </div>

                  {cat.subcategories.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleClickDropdown(cat.id);
                      }}
                      className={`p-1 rounded-full hover:bg-gray-200 transition-transform ${
                        clickDropdown === cat.id ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                </div>

                {/* Плавный дропдаун с подкатегориями */}
                <AnimatePresence>
                  {isOpen && cat.subcategories.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="bg-gray-50 flex flex-col border-t overflow-hidden"
                    >
                      {cat.subcategories.map((sub) => (
                        <a
                          key={sub.id}
                          href={`/catalog/${sub.slug}`} // открываем страницу конкретной подкатегории
                          className="px-6 py-3 hover:bg-indigo-100 transition"
                        >
                          {sub.name}
                        </a>
                      ))}
                      <a
                        href={`/catalog/category/${cat.id}`}
                        className="px-6 py-3 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
                      >
                        Переглянути всі підкатегорії
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Catalog;
