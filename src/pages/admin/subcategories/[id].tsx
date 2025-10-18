import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";

// 🔠 Генерация slug
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
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id && id !== "new") fetchSubcategory();
  }, [id]);

  // 🔹 Загрузка списка категорий
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id,name")
      .order("name");
    setCategories(data || []);
  };

  // 🔹 Загрузка подкатегории
  const fetchSubcategory = async () => {
    const { data } = await supabase
      .from("subcategories")
      .select("id,name,slug,category_id")
      .eq("id", id)
      .single();

    if (data) {
      setName(data.name);
      setSlug(data.slug);
      setCategoryId(data.category_id);
    }
  };

  // 🔹 Сохранение подкатегории
  const saveSubcategory = async () => {
    if (!name.trim() || !slug.trim()) {
      alert("Название и slug обязательны");
      return;
    }

    setLoading(true);

    let uniqueSlug = slug;

    if (id === "new") {
      // 🔹 Генерация уникального slug
      let i = 1;
      while (true) {
        const { data } = await supabase
          .from("subcategories")
          .select("id")
          .eq("slug", uniqueSlug)
          .limit(1);
        if (!data || data.length === 0) break;
        uniqueSlug = `${slug}-${i}`;
        i++;
      }

      const { data, error } = await supabase
        .from("subcategories")
        .insert({ name, slug: uniqueSlug, category_id: categoryId })
        .select("id")
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
    } else {
      await supabase
        .from("subcategories")
        .update({ name, slug: uniqueSlug, category_id: categoryId })
        .eq("id", id);
    }

    setLoading(false);
    router.push("/admin/subcategories");
  };

  return (
    <AdminAuthWrapper>
      <AdminLayout>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
            {id === "new"
              ? "➕ Добавить подкатегорию"
              : "✏️ Редактировать подкатегорию"}
          </h1>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 border border-blue-200">
            {/* Название */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Название
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                placeholder="Например: Лазерный уровень"
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
                placeholder="laser-level"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            {/* Категория */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Категория
              </label>
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value || null)}
                className="w-full px-4 py-2 rounded border"
              >
                <option value="">– Без категории –</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Кнопка */}
            <button
              onClick={saveSubcategory}
              disabled={loading}
              className={`w-full py-3 rounded-2xl text-white font-bold text-lg transition-all ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-2xl"
              }`}
            >
              {loading
                ? "Сохранение..."
                : id === "new"
                ? "Добавить подкатегорию"
                : "Сохранить изменения"}
            </button>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
};

export default SubcategoryForm;
