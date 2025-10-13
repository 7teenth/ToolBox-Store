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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tool Types</h1>
        <Link
          href="/admin/tool_types/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          + Add Tool Type
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-600 uppercase text-sm font-semibold">
                Name
              </th>
              <th className="p-3 text-left text-gray-600 uppercase text-sm font-semibold">
                Slug
              </th>
              <th className="p-3 text-left text-gray-600 uppercase text-sm font-semibold">
                Category
              </th>
              <th className="p-3 text-left text-gray-600 uppercase text-sm font-semibold">
                Image
              </th>
              <th className="p-3 text-left text-gray-600 uppercase text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {toolTypes.map((tt) => (
              <tr key={tt.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-gray-700">{tt.name}</td>
                <td className="p-3 text-gray-500 font-mono">{tt.slug}</td>
                <td className="p-3 text-gray-700">{tt.category_name}</td>
                <td className="p-3">
                  {tt.image_url ? (
                    <img
                      src={tt.image_url}
                      alt={tt.name}
                      className="h-12 w-12 object-cover rounded-lg border"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/tool_types/${tt.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow-sm transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteToolType(tt.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {toolTypes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No tool types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ToolTypesAdmin;
