import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";

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
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <Link
        href="/admin/products/new"
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Product
      </Link>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Subcategory</th>
            <th className="border p-2">Tool Type</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Sales</th>
            <th className="border p-2">Views</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.category_name}</td>
              <td className="border p-2">{p.subcategory_name}</td>
              <td className="border p-2">{p.tool_type_name}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2">{p.sales}</td>
              <td className="border p-2">{p.views}</td>
              <td className="border p-2">{p.rating}</td>
              <td className="border p-2">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="border p-2 flex gap-2">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default ProductsAdmin;
