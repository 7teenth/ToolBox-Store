import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
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
  stock: number;
  sales: number;
  views: number;
  rating: number;
  image_url?: string | null;
  category_name?: string;
  subcategory_name?: string;
  tool_type_name?: string;
}

const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        price,
        brand,
        stock,
        sales,
        views,
        rating,
        image_url,
        category:categories(name),
        subcategory:subcategories(name),
        tool_type:tool_types(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const formatted = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      brand: p.brand,
      stock: p.stock,
      sales: p.sales,
      views: p.views,
      rating: p.rating,
      image_url: p.image_url,
      category_name: p.category?.name || "-",
      subcategory_name: p.subcategory?.name || "-",
      tool_type_name: p.tool_type?.name || "-",
    }));

    setProducts(formatted);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">🧰 Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Subcategory</th>
              <th className="px-4 py-3 text-left">Tool Type</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Sales</th>
              <th className="px-4 py-3 text-left">Views</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-gray-700">{p.category_name}</td>
                <td className="px-4 py-3 text-gray-700">
                  {p.subcategory_name}
                </td>
                <td className="px-4 py-3 text-gray-700">{p.tool_type_name}</td>
                <td className="px-4 py-3 text-gray-700">${p.price}</td>
                <td className="px-4 py-3 text-gray-700">{p.stock}</td>
                <td className="px-4 py-3 text-gray-700">{p.sales}</td>
                <td className="px-4 py-3 text-gray-700">{p.views}</td>
                <td className="px-4 py-3 text-gray-700">{p.rating}</td>
                <td className="px-4 py-3">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-12 w-12 object-cover rounded border border-gray-300 shadow-sm"
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ProductsAdmin;
