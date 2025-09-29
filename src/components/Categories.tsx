import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const map: Record<string, string> = {};
      await Promise.all(
        categories.map(async (cat) => {
          const imagePath =
            cat.image_url?.replace(/^\/+/, "") ||
            "defaults/default-category.png";
          const url = await getImageUrl(imagePath);
          map[cat.id] =
            url || (await getImageUrl("defaults/default-category.png"));
        })
      );
      setImageMap(map);
    };
    fetchImages();
  }, [categories]);

  return (
    <section className="categories-section mt-12 mb-12 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Категорії</h2>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog/${cat.slug || cat.id}`}
            className="category-card bg-white p-4 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-transform cursor-pointer flex flex-col items-center"
          >
            <img
              src={
                imageMap[cat.id] || getImageUrl("defaults/default-category.png")
              }
              alt={cat.name}
              onError={(e) => {
                e.currentTarget.src = getImageUrl(
                  "defaults/default-category.png"
                );
              }}
              className="w-full h-32 object-cover rounded mb-2 transition-opacity duration-300"
            />
            <h3 className="text-lg font-semibold text-center">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};
