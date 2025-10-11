import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";

const ToolTypeForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    fetchCategories();
    if (id && id !== "new") fetchToolType();
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name");
    setCategories(data || []);
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
      setImageUrl(data.image_url);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Загружаем файл
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(`tool_types/${fileName}`, imageFile, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return null;
    }

    // Получаем публичный URL
    const urlData = supabase.storage
      .from("products")
      .getPublicUrl(`tool_types/${fileName}`);

    return urlData.data.publicUrl; // <-- вот правильный способ
  };

  const saveToolType = async () => {
    const uploadedUrl = imageFile ? await uploadImage() : imageUrl;
    const payload = {
      name,
      slug,
      category_id: categoryId,
      image_url: uploadedUrl,
    };

    if (id === "new") {
      await supabase.from("tool_types").insert(payload);
    } else {
      await supabase.from("tool_types").update(payload).eq("id", id);
    }

    router.push("/admin/tool_types");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        {id === "new" ? "Add Tool Type" : "Edit Tool Type"}
      </h1>
      <div className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={categoryId || ""}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {imageUrl && !imageFile && (
            <img src={imageUrl} alt="Current" className="h-24 mt-2" />
          )}
        </div>
        <button
          onClick={saveToolType}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {id === "new" ? "Add" : "Save"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default ToolTypeForm;
