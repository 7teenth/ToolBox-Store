import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";

interface ToolType {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category_name?: string | null;
  image_url?: string | null;
}

const ToolTypesAdmin = () => {
  const [toolTypes, setToolTypes] = useState<ToolType[]>([]);

  useEffect(() => {
    fetchToolTypes();
  }, []);

  const fetchToolTypes = async () => {
    const { data, error } = await supabase
      .from("tool_types")
      .select(
        `
        id,
        name,
        slug,
        image_url,
        category:categories(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    const formatted = data.map((tt: any) => ({
      id: tt.id,
      name: tt.name,
      slug: tt.slug,
      image_url: tt.image_url,
      category_id: tt.category_id,
      category_name: tt.category?.name || "-",
    }));

    setToolTypes(formatted);
  };

  const deleteToolType = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool type?")) return;
    await supabase.from("tool_types").delete().eq("id", id);
    fetchToolTypes();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Tool Types</h1>
      <Link
        href="/admin/tool_types/new"
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Tool Type
      </Link>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Slug</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {toolTypes.map((tt) => (
            <tr key={tt.id}>
              <td className="border p-2">{tt.name}</td>
              <td className="border p-2">{tt.slug}</td>
              <td className="border p-2">{tt.category_name}</td>
              <td className="border p-2">
                {tt.image_url ? (
                  <img
                    src={tt.image_url}
                    alt={tt.name}
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="border p-2 flex gap-2">
                <Link
                  href={`/admin/tool_types/${tt.id}`}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteToolType(tt.id)}
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

export default ToolTypesAdmin;
