import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { CheckIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

// 🔠 Генерация slug на латинице
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 👆 fetch categories и tool type при загрузке
  useEffect(() => {
    fetchCategories();
    if (id && id !== "new") fetchToolType();
  }, [id]);

  // 🔄 fetch subcategories при выборе категории
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
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}_${slug || generateSlug(name)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(`tool_types/${fileName}`, imageFile, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(`tool_types/${fileName}`);
    return data.publicUrl;
  };

  const saveToolType = async () => {
    if (!name.trim() || !slug.trim() || !categoryId || !subcategoryId) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const uploadedUrl = await uploadImage();
    const payload = {
      name,
      slug,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      image_url: uploadedUrl,
    };

    try {
      let res;
      if (id === "new") {
        res = await supabase.from("tool_types").insert(payload).select();
      } else {
        res = await supabase
          .from("tool_types")
          .update(payload)
          .eq("id", id)
          .select();
      }

      if (res.error) throw res.error;
      router.push("/admin/tool_types");
    } catch (err) {
      console.error("Supabase error:", err);
      alert("Failed to save Tool Type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
          {id === "new" ? "➕ Add Tool Type" : "✏️ Edit Tool Type"}
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const val = e.target.value;
                setName(val);
                setSlug(generateSlug(val));
              }}
              placeholder="e.g. Drills"
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:shadow-md"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Slug (auto)</label>
            <div className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 font-mono shadow-inner">
              {slug || "slug-will-appear-here"}
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Category</label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:shadow-md"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {subcategories.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Subcategory</label>
              <select
                value={subcategoryId || ""}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:shadow-md"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Image */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 inline-block">
              Image
            </label>
            <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 transition">
              <ArrowUpTrayIcon className="h-5 w-5" />
              Upload
              <input
                type="file"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
            {(imageUrl || imageFile) && (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imageUrl!}
                alt="Preview"
                className="w-32 h-32 mt-3 object-cover rounded-xl border"
              />
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={saveToolType}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-2xl transition shadow-lg transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <CheckIcon className="h-5 w-5" />
            {loading
              ? "Saving..."
              : id === "new"
              ? "Add Tool Type"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ToolTypeForm;
