import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const CategoryForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;
    const fileName = `${Date.now()}_${imageFile.name}`;
    const { error } = await supabase.storage
      .from("categories")
      .upload(fileName, imageFile, { upsert: true });
    if (error) return null;
    return supabase.storage.from("categories").getPublicUrl(fileName).data
      .publicUrl;
  };

  const saveCategory = async () => {
    if (!name.trim() || !slug.trim())
      return alert("Name and slug are required.");
    setLoading(true);
    const finalImageUrl = await uploadImage();
    if (id === "new") {
      await supabase
        .from("categories")
        .insert({ name, slug, image_url: finalImageUrl });
    } else {
      await supabase
        .from("categories")
        .update({ name, slug, image_url: finalImageUrl })
        .eq("id", id);
    }
    router.push("/admin/categories");
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
          {id === "new" ? "➕ Add Category" : "✏️ Edit Category"}
        </h1>

        <div className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Power Tools"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. power-tools"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 text-sm text-gray-700 transition">
                <ArrowUpTrayIcon className="h-5 w-5" />
                Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              )}
            </div>
          </div>

          <button
            onClick={saveCategory}
            disabled={loading}
            className={`w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
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
