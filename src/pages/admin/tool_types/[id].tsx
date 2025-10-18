import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";
import { ArrowUpTrayIcon, CheckIcon } from "@heroicons/react/24/outline";

const SUPABASE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products";

// 🔹 Генерація slug
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

const getImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${SUPABASE_BASE_URL}/${path}`;
};

const ToolTypeForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Загрузка категорій і даних типу
  useEffect(() => {
    fetchCategories();
    if (id && id !== "new") fetchToolType();
  }, [id]);

  // Підвантаження підкатегорій при виборі категорії
  useEffect(() => {
    if (categoryId) fetchSubcategories(categoryId);
    else {
      setSubcategories([]);
      setSubcategoryId(null);
    }
  }, [categoryId]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name");
    setCategories(data || []);
  };

  const fetchSubcategories = async (catId: string) => {
    const { data } = await supabase
      .from("subcategories")
      .select("id, name")
      .eq("category_id", catId);
    setSubcategories(data || []);
  };

  const fetchToolType = async () => {
    const { data } = await supabase
      .from("tool_types")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setName(data.name);
      setSlug(data.slug);
      setCategoryId(data.category_id);
      setSubcategoryId(data.subcategory_id);
      setImageUrl(data.image_url);
      setPreviewUrl(getImageUrl(data.image_url));
    }
  };

  // Попередній перегляд зображення
  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(imageUrl ? getImageUrl(imageUrl) : null);
    }
  };

  // 🔹 Завантаження зображення в папку assets/tool_types
  const uploadToolTypeImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;

    const cleanName = generateSlug(imageFile.name.replace(/\.[^/.]+$/, ""));
    const fileExt = imageFile.name.split(".").pop();

    // Важливо: путь начинается с assets/tool_types
    const bucketPath = `assets/tool_types/${Date.now()}_${cleanName}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(bucketPath, imageFile, { upsert: true });

    if (error) {
      console.error("Помилка завантаження файлу:", error.message);
      return null;
    }

    return bucketPath;
  };

  // Перевірка унікальності slug
  const checkSlugUnique = async (slugToCheck: string) => {
    const { data } = await supabase
      .from("tool_types")
      .select("id")
      .eq("slug", slugToCheck)
      .limit(1)
      .single();
    if (data && data.id !== id) return false;
    return true;
  };

  const saveToolType = async () => {
    if (!name.trim() || !slug.trim() || !categoryId || !subcategoryId) {
      alert("Заповніть всі обов'язкові поля!");
      return;
    }
    setLoading(true);

    const uploadedPath = imageFile ? await uploadToolTypeImage() : imageUrl;

    const slugUnique = await checkSlugUnique(slug);
    if (!slugUnique) {
      alert("Slug вже існує!");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      slug,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      image_url: uploadedPath,
    };

    try {
      if (id === "new") {
        await supabase.from("tool_types").insert(payload).select();
      } else {
        await supabase.from("tool_types").update(payload).eq("id", id).select();
      }
      router.push("/admin/tool_types");
    } catch (err) {
      console.error(err);
      alert("Помилка при збереженні типу інструменту");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthWrapper>
      <AdminLayout>
        <div className="max-w-2xl mx-auto mt-10">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            {id === "new" ? "➕ Додати тип інструменту" : "✏️ Редагувати тип"}
          </h1>

          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
            {/* Назва */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Назва</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                placeholder="Наприклад: Дрилі"
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-slug"
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Категорія */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Категорія</label>
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Оберіть категорію</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Підкатегорія */}
            {subcategories.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Підкатегорія
                </label>
                <select
                  value={subcategoryId || ""}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Оберіть підкатегорію</option>
                  {subcategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Фото */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Фото</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-xl border hover:bg-gray-200">
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  Завантажити
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] || null)
                    }
                  />
                </label>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Попередній перегляд"
                    className="w-28 h-28 rounded-xl border object-cover"
                  />
                )}
              </div>
            </div>

            {/* Кнопка */}
            <button
              onClick={saveToolType}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <CheckIcon className="h-5 w-5" />
              {loading
                ? "Збереження..."
                : id === "new"
                ? "Додати тип"
                : "Зберегти зміни"}
            </button>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
};

export default ToolTypeForm;
