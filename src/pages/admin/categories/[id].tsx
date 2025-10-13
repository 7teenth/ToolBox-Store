import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const SUPABASE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products";

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

const getImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${SUPABASE_BASE_URL}/assets/${url}`;
};

const CategoryForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== "new") fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setName(data.name);
      setSlug(data.slug);
      setImageUrl(data.image_url);
      setPreviewUrl(getImageUrl(data.image_url));
    }
  };

  // 🔹 Генерируем preview локально сразу после выбора файла
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

  const uploadImageToBucket = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;

    const cleanName = generateSlug(imageFile.name.replace(/\.[^/.]+$/, ""));
    const fileExt = imageFile.name.split(".").pop();
    const tablePath = `categories/${Date.now()}_${cleanName}.${fileExt}`;
    const bucketPath = `assets/${tablePath}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(bucketPath, imageFile, { upsert: true });

    if (error) {
      console.error("Ошибка загрузки файла:", error.message);
      return null;
    }

    return tablePath;
  };

  const saveCategoryToTable = async (finalImagePath: string | null) => {
    const categoryData = { name, slug, image_url: finalImagePath || imageUrl };

    if (id === "new") {
      await supabase.from("categories").insert(categoryData);
    } else {
      await supabase.from("categories").update(categoryData).eq("id", id);
    }
  };

  const saveCategory = async () => {
    if (!name.trim() || !slug.trim())
      return alert("Name and slug are required.");
    setLoading(true);

    const uploadedPath = imageFile ? await uploadImageToBucket() : imageUrl;
    await saveCategoryToTable(uploadedPath);
    setLoading(false);

    router.push("/admin/categories");
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          {id === "new" ? "➕ Add Category" : "✏️ Edit Category"}
        </h1>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-2xl flex flex-col gap-8 border border-blue-200">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
              placeholder="Power Tools"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="power-tools"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Image</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-gray-300 shadow hover:shadow-lg transition-all text-indigo-700 font-medium hover:bg-indigo-50">
                <ArrowUpTrayIcon className="h-6 w-6" />
                Upload
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
                  alt="Preview"
                  className="w-28 h-28 rounded-xl border border-gray-300 object-cover shadow-md transition-all"
                />
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveCategory}
            disabled={loading}
            className={`w-full py-3 rounded-2xl text-white font-bold text-lg transition-all
              ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-2xl"
              }
            `}
          >
            {loading
              ? "Saving..."
              : id === "new"
              ? "Add Category"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
