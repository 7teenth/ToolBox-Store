import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";
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

// 🔧 Базовий URL Supabase Storage
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
      console.error("Помилка завантаження категорій:", error.message);
      return;
    }
    setCategories(data || []);
  };

  const getImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    let normalized = url.startsWith("/") ? url.slice(1) : url;

    if (normalized.startsWith("assets/categories/")) {
      return `${SUPABASE_BASE_URL}/${normalized}`;
    }

    normalized = normalized.replace(
      /^categories\/categories\//,
      "assets/categories/"
    );

    normalized = normalized.replace(/^categories\//, "assets/categories/");

    if (!normalized.startsWith("assets/categories/")) {
      normalized = `assets/categories/${normalized}`;
    }

    return `${SUPABASE_BASE_URL}/${normalized}`;
  };

  // 🗑️ Видалення категорії + фото
  const deleteCategory = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю категорію?")) return;

    // 1️⃣ Отримуємо шлях до зображення
    const { data: category } = await supabase
      .from("categories")
      .select("image_url")
      .eq("id", id)
      .single();

    if (category?.image_url) {
      try {
        let path = category.image_url;
        if (!path.startsWith("assets/")) {
          path = `assets/categories/${path.replace(/^categories\//, "")}`;
        }

        const { error: deleteError } = await supabase.storage
          .from("products")
          .remove([path]);

        if (deleteError) {
          console.warn("⚠️ Помилка видалення файлу:", deleteError.message);
        }
      } catch (err) {
        console.error("⚠️ Не вдалося видалити фото:", err);
      }
    }

    // 2️⃣ Видаляємо саму категорію
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      alert("Помилка при видаленні категорії: " + error.message);
    } else {
      fetchCategories();
    }
  };

  return (
    <AdminAuthWrapper>
      <AdminLayout>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800">
            📁 Категорії
          </h1>
          <Link
            href="/admin/categories/new"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition w-full md:w-auto"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Додати категорію</span>
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Зображення</th>
                <th className="px-4 py-3 text-left">Назва</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 align-middle">
                    {getImageUrl(cat.image_url) ? (
                      <img
                        src={getImageUrl(cat.image_url)!}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded-md border hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                        Без зображення
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 align-middle">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 align-middle">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2 h-full">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Редагувати
                      </Link>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Категорій не знайдено.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
};

export default CategoriesAdmin;
