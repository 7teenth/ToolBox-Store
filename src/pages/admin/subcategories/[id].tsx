import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { CheckIcon } from "@heroicons/react/24/outline";

// 🔠 Генерация slug с латиницей
const generateSlug = (text: string) => {
  if (!text) return "";
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    ґ: "g",
    д: "d",
    е: "e",
    є: "e",
    ж: "zh",
    з: "z",
    и: "i",
    і: "i",
    ї: "i",
    й: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ю: "yu",
    я: "ya",
    ь: "",
    "'": "",
    " ": "-",
    "—": "-",
    ".": "",
    ",": "",
    ":": "",
    ";": "",
  };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] || ch)
    .join("")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const SubcategoryForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id && id !== "new") fetchSubcategory();
  }, [id]);

  const fetchCategories = async () => {
    const { data: cats } = await supabase.from("categories").select("id, name");
    setCategories(cats || []);
  };

  const fetchSubcategory = async () => {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error(error);
      return;
    }
    setName(data.name);
    setSlug(data.slug);
    setCategoryId(data.category_id);
  };

  const saveSubcategory = async () => {
    if (!name.trim() || !slug.trim() || !categoryId) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const payload = { name, slug, category_id: categoryId };

    if (id === "new") {
      await supabase.from("subcategories").insert(payload);
    } else {
      await supabase.from("subcategories").update(payload).eq("id", id);
    }

    setLoading(false);
    router.push("/admin/subcategories");
  };

  return (
    <AdminLayout>
      <div className="max-w-md mx-auto mt-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
          {id === "new" ? "➕ Add Subcategory" : "✏️ Edit Subcategory"}
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const newName = e.target.value;
                setName(newName);
                setSlug(generateSlug(newName));
              }}
              placeholder="e.g. Drills"
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:shadow-md w-full"
            />
          </div>

          {/* Slug (реальное отображение) */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Slug (auto)</label>
            <div className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 font-mono shadow-inner break-words">
              {slug || "slug-will-appear-here"}
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Category</label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:shadow-md w-full"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Save button */}
          <button
            onClick={saveSubcategory}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-2xl transition shadow-lg transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <CheckIcon className="h-5 w-5" />
            {loading
              ? "Saving..."
              : id === "new"
              ? "Add Subcategory"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubcategoryForm;
