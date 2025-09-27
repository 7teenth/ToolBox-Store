import React from "react";
import Link from "next/link";

export interface Category {
  id: number;
  name: string;
  image_url: string; // чтобы совпадало с тем, что приходит из БД
  slug?: string; // для ссылки на категорию/подкатегории
}

interface CategoriesProps {
  categories: Category[];
}

export const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <section className="categories-section mt-12 mb-12 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Категории</h2>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.slug ? `/catalog/${cat.slug}` : "/catalog"}
            className="category-card bg-white p-4 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-transform cursor-pointer flex flex-col items-center"
          >
            <img
              src={
                cat.image_url
                  ? `/images/${cat.image_url.replace(/^\/+/, "")}`
                  : "/images/default-category.png"
              }
              alt={cat.name}
              className="w-full h-32 object-cover rounded mb-2"
            />

            <h3 className="text-lg font-semibold text-center">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};
