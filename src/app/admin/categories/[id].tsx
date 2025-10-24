import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/admin/Layout";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function CategoryForm() {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  return (
    <AdminAuthWrapper>
      <AdminLayout>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
            {id === "new" ? "➕ Додати категорію" : "✏️ Редагувати категорію"}
          </h1>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-2xl flex flex-col gap-8 border border-blue-200">
            {/* Назва */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Назва
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Наприклад: Електроінструменти"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="elektroinstrumenty"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            {/* Зображення */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Зображення
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-gray-300 shadow hover:shadow-lg transition-all text-indigo-700 font-medium hover:bg-indigo-50">
                  <ArrowUpTrayIcon className="h-6 w-6" />
                  Завантажити
                  <input
                    type="file"
                    className="hidden"
                  />
                </label>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Попередній перегляд"
                    className="w-28 h-28 rounded-xl border border-gray-300 object-cover shadow-md transition-all"
                  />
                )}
              </div>
            </div>

            {/* Кнопка збереження */}
            <button
              disabled={loading}
              className={`w-full py-3 rounded-2xl text-white font-bold text-lg transition-all ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-2xl"
              }`}
            >
              {loading
                ? "Збереження..."
                : id === "new"
                ? "Додати категорію"
                : "Зберегти зміни"}
            </button>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
};