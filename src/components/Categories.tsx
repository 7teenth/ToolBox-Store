import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "../lib/getImageUrl";
import { Subcategory } from "../types/subcategory";

export interface Category {
  id: string;
  name: string;
  image_url: string;
  slug?: string;
  subcategories?: Subcategory[];
}

interface CategoriesProps {
  categories: Category[];
}

export const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <section className="categories-section mt-12 mb-12 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Категорії</h2>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => {
          const imageSrc = getImageUrl(
            cat.image_url || "defaults/default-category.png"
          );

          return (
            <div
              key={cat.id}
              className="category-card bg-white p-4 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-transform cursor-pointer flex flex-col items-center"
            >
              <Link
                href={`/catalog/${cat.slug || cat.id}`}
                className="w-full flex flex-col items-center"
              >
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-cover rounded transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  {cat.name}
                </h3>
              </Link>

              {/* Подкатегории */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/catalog/${cat.slug || cat.id}/${sub.slug}`}
                      className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-full transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
