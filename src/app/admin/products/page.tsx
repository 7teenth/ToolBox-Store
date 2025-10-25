import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/Layout";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface Product {
  id: string;
  name: string;
  price: number;
  brand?: string | null;
  rating: number;
  image_url?: string | null;
  category_name: string;
  subcategory_name: string;
  tool_type_name: string;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">🧰 Товари</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <PlusIcon className="h-5 w-5" />
          Додати товар
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Назва</th>
              <th className="px-4 py-3 text-left">Категорія</th>
              <th className="px-4 py-3 text-left">Підкатегорія</th>
              <th className="px-4 py-3 text-left">Тип</th>
              <th className="px-4 py-3 text-left">Ціна</th>
              <th className="px-4 py-3 text-left">Рейтинг</th>
              <th className="px-4 py-3 text-left">Фото</th>
              <th className="px-4 py-3 text-left">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  Завантаження...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  Товарів не знайдено.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.category_name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {p.subcategory_name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {p.tool_type_name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">${p.price}</td>
                  <td className="px-4 py-3 text-gray-700">{p.rating}</td>
                  <td className="px-4 py-3">
                    {/* {getImageUrl(p.image_url) ? (
                      <img
                        src={getImageUrl(p.image_url)!}
                        alt={p.name}
                        className="h-12 w-12 object-cover rounded border border-gray-300 shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )} */}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      Редагувати
                    </Link>
                    <button
                      className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Видалити
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};