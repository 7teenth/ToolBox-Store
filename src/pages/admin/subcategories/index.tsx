import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category_name?: string | null;
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
        category:categories(name)
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Subcategories</h1>
          <Link
            href="/admin/subcategories/new"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
          >
            <PlusIcon className="h-5 w-5" />
            Add Subcategory
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((sc) => (
            <div
              key={sc.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transform-gpu hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {sc.name}
                </h2>
                <p className="text-sm text-gray-500 mb-1">
                  Slug: <span className="font-mono">{sc.slug}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Category: {sc.category_name}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/subcategories/${sc.id}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-xl transition"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={() => deleteSubcategory(sc.id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubcategoriesAdmin;
