import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";

const ProductForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [toolTypeId, setToolTypeId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [weight, setWeight] = useState<number>(0);
  const [powerType, setPowerType] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(8).fill(null)
  );
  const [imageUrls, setImageUrls] = useState<(string | null)[]>(
    Array(8).fill(null)
  );

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [toolTypes, setToolTypes] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    fetchOptions();
    if (id && id !== "new") fetchProduct();
  }, [id]);

  const fetchOptions = async () => {
    const { data: cats } = await supabase.from("categories").select("id, name");
    setCategories(cats || []);
    const { data: subs } = await supabase
      .from("subcategories")
      .select("id, name");
    setSubcategories(subs || []);
    const { data: tools } = await supabase
      .from("tool_types")
      .select("id, name");
    setToolTypes(tools || []);
  };

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setName(data.name);
      setSlug(data.slug);
      setPrice(data.price);
      setBrand(data.brand || "");
      setStock(data.stock || 0);
      setCategoryId(data.category_id);
      setSubcategoryId(data.subcategory_id);
      setToolTypeId(data.tool_type_id);
      setDescription(data.description || "");
      setShortDescription(data.short_description || "");
      setWeight(data.weight || 0);
      setPowerType(data.power_type || "");
      setRating(data.rating || 0);
      setImageUrls([
        data.image_url,
        data.hover_image_url,
        data.image_3,
        data.image_4,
        data.image_5,
        data.image_6,
        data.image_7,
        data.image_8,
      ]);
    }
  };

  const uploadImage = async (file: File, index: number) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `products/${Date.now()}_${index}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file, { upsert: true });
    if (uploadError) {
      console.error(uploadError);
      return null;
    }
    const urlData = supabase.storage
      .from("products")
      .getPublicUrl(uploadData.path);
    return urlData.data.publicUrl;
  };

  const saveProduct = async () => {
    const uploadedUrls = await Promise.all(
      imageFiles.map((f, i) => (f ? uploadImage(f, i) : imageUrls[i]))
    );

    const payload: any = {
      name,
      slug,
      price,
      brand,
      stock,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      tool_type_id: toolTypeId,
      description,
      short_description: shortDescription,
      weight,
      power_type: powerType,
      rating,
      image_url: uploadedUrls[0],
      hover_image_url: uploadedUrls[1],
      image_3: uploadedUrls[2],
      image_4: uploadedUrls[3],
      image_5: uploadedUrls[4],
      image_6: uploadedUrls[5],
      image_7: uploadedUrls[6],
      image_8: uploadedUrls[7],
    };

    if (id === "new") {
      await supabase.from("products").insert(payload);
    } else {
      await supabase.from("products").update(payload).eq("id", id);
    }

    router.push("/admin/products");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        {id === "new" ? "Add Product" : "Edit Product"}
      </h1>
      <div className="flex flex-col gap-4 max-w-xl">
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
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
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
          value={subcategoryId || ""}
          onChange={(e) => setSubcategoryId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
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
        <textarea
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Power Type"
          value={powerType}
          onChange={(e) => setPowerType(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <div className="flex flex-wrap gap-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex flex-col items-center">
              <input
                type="file"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setImageFiles((prev) => {
                    const arr = [...prev];
                    arr[i] = f;
                    return arr;
                  });
                }}
              />
              {url && !imageFiles[i] && <img src={url} className="h-24 mt-1" />}
            </div>
          ))}
        </div>

        <button
          onClick={saveProduct}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {id === "new" ? "Add" : "Save"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
