import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";

const SubcategoryForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [toolTypeId, setToolTypeId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [toolTypes, setToolTypes] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    fetchOptions();
    if (id && id !== "new") fetchSubcategory();
  }, [id]);

  const fetchOptions = async () => {
    const { data: cats } = await supabase.from("categories").select("id, name");
    setCategories(cats || []);
    const { data: tools } = await supabase
      .from("tool_types")
      .select("id, name");
    setToolTypes(tools || []);
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
    setToolTypeId(data.tool_type_id);
  };

  const saveSubcategory = async () => {
    const payload = {
      name,
      slug,
      category_id: categoryId,
      tool_type_id: toolTypeId,
    };
    if (id === "new") {
      await supabase.from("subcategories").insert(payload);
    } else {
      await supabase.from("subcategories").update(payload).eq("id", id);
    }
    router.push("/admin/subcategories");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        {id === "new" ? "Add Subcategory" : "Edit Subcategory"}
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
        <select
          value={toolTypeId || ""}
          onChange={(e) => setToolTypeId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Tool Type</option>
          {toolTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={saveSubcategory}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {id === "new" ? "Add" : "Save"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default SubcategoryForm;
