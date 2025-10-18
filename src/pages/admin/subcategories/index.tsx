import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category?: Category | null;
}

const SubcategoriesAdmin = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) fetchSubcategories();
  }, [categories]);

  const fetchCategories = async () => {
    const { data: cats } = await supabase.from("categories").select("id,name");
    setCategories(cats || []);
  };

  const fetchSubcategories = async () => {
    const { data: subs } = await supabase
      .from("subcategories")
      .select("id,name,slug,category_id")
      .order("created_at", { ascending: false });

    if (!subs) return;

    const formatted: Subcategory[] = subs.map((sc: any) => ({
      id: sc.id,
      name: sc.name,
      slug: sc.slug,
      category: categories.find((c) => c.id === sc.category_id) || null,
    }));

    setSubcategories(formatted);
  };

  const deleteSubcategory = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю підкатегорію?")) return;

    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (error) alert("Помилка при видаленні підкатегорії: " + error.message);
    else fetchSubcategories();
  };

  // Группировка подкатегорий по категориям
  const groupedSubcategories: Record<string, Subcategory[]> = {};
  subcategories.forEach((sc) => {
    const catName = sc.category?.name || "Без категорії";
    if (!groupedSubcategories[catName]) groupedSubcategories[catName] = [];
    groupedSubcategories[catName].push(sc);
  });

  return (
    <AdminAuthWrapper>
      <AdminLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible space-y-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Підкатегорії</h1>
            <Link
              href="/admin/subcategories/new"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
            >
              <PlusIcon className="h-5 w-5" />
              Додати підкатегорію
            </Link>
          </div>

          {Object.entries(groupedSubcategories).map(([catName, subs]) => (
            <div key={catName}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {catName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
                {subs.map((sc) => (
                  <div key={sc.id} className="relative overflow-visible">
                    <div
                      className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between
                                 hover:shadow-2xl transform-gpu hover:scale-105 transition-all duration-300
                                 will-change-transform"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {sc.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          Slug: <span className="font-mono">{sc.slug}</span>
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/admin/subcategories/${sc.id}`}
                          className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-xl transition"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Редагувати
                        </Link>
                        <button
                          onClick={() => deleteSubcategory(sc.id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Видалити
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
};

export default SubcategoriesAdmin;
