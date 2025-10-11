import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category_name?: string | null;
  tool_type_id: string | null;
  tool_type_name?: string | null;
}

const SubcategoriesAdmin = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from("subcategories")
      .select(
        `
        id,
        name,
        slug,
        category:categories(name),
        tool_type:tool_types(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    const formatted = data.map((sc: any) => ({
      id: sc.id,
      name: sc.name,
      slug: sc.slug,
      category_id: sc.category_id,
      category_name: sc.category?.name || "-",
      tool_type_id: sc.tool_type_id,
      tool_type_name: sc.tool_type?.name || "-",
    }));

    setSubcategories(formatted);
  };

  const deleteSubcategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    await supabase.from("subcategories").delete().eq("id", id);
    fetchSubcategories();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Subcategories</h1>
      <Link
        href="/admin/subcategories/new"
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Subcategory
      </Link>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Slug</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Tool Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((sc) => (
            <tr key={sc.id}>
              <td className="border p-2">{sc.name}</td>
              <td className="border p-2">{sc.slug}</td>
              <td className="border p-2">{sc.category_name}</td>
              <td className="border p-2">{sc.tool_type_name}</td>
              <td className="border p-2 flex gap-2">
                <Link
                  href={`/admin/subcategories/${sc.id}`}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteSubcategory(sc.id)}
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

export default SubcategoriesAdmin;
