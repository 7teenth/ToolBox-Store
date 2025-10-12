import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

// 🔧 Базовый URL Supabase Storage
const SUPABASE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products";

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Ошибка загрузки категорий:", error.message);
      return;
    }
    setCategories(data || []);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  // ✅ Корректная генерация URL изображения
  const getImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    let normalized = url.startsWith("/") ? url.slice(1) : url;

    // если путь начинается с "assets/categories/", используем как есть
    if (normalized.startsWith("assets/categories/")) {
      return `${SUPABASE_BASE_URL}/${normalized}`;
    }

    // если путь содержит повтор "categories/categories/", исправляем
    normalized = normalized.replace(
      /^categories\/categories\//,
      "assets/categories/"
    );

    // если путь начинается с "categories/", заменяем на "assets/categories/"
    normalized = normalized.replace(/^categories\//, "assets/categories/");

    // если путь просто файл, добавляем "assets/categories/"
    if (!normalized.startsWith("assets/categories/")) {
      normalized = `assets/categories/${normalized}`;
    }

    return `${SUPABASE_BASE_URL}/${normalized}`;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">📁 Categories</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  {getImageUrl(cat.image_url) ? (
                    <img
                      src={getImageUrl(cat.image_url)!}
                      alt={cat.name}
                      className="w-12 h-12 object-cover rounded-md border hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {cat.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{cat.slug}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Link
                    href={`/admin/categories/${cat.id}`}
                    className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm transition"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default CategoriesAdmin;
