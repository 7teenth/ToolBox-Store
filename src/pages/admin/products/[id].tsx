import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { FiTag, FiImage, FiBox, FiDollarSign, FiStar } from "react-icons/fi";

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
    if (uploadError) return null;
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

  const inputBase =
    "border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {id === "new" ? "🛠️ Add Product" : "✏️ Edit Product"}
      </h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto space-y-8">
        {/* General Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            General Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FiTag className="text-gray-400" />
              <input
                className={inputBase}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FiTag className="text-gray-400" />
              <input
                className={inputBase}
                placeholder="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-gray-400" />
              <input
                className={inputBase}
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <FiBox className="text-gray-400" />
              <input
                className={inputBase}
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FiBox className="text-gray-400" />
              <input
                className={inputBase}
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Categories & Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className={inputBase}
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className={inputBase}
              value={subcategoryId || ""}
              onChange={(e) => setSubcategoryId(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              className={inputBase}
              value={toolTypeId || ""}
              onChange={(e) => setToolTypeId(e.target.value)}
            >
              <option value="">Select Tool Type</option>
              {toolTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Descriptions */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Descriptions
          </h2>
          <textarea
            className={inputBase}
            placeholder="Short Description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          <textarea
            className={inputBase}
            placeholder="Full Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>

        {/* Additional Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Additional Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className={inputBase}
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
            <input
              className={inputBase}
              placeholder="Power Type"
              value={powerType}
              onChange={(e) => setPowerType(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <FiStar className="text-yellow-400" />
              <input
                className={inputBase}
                type="number"
                placeholder="Rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Images
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                <label className="cursor-pointer flex flex-col items-center p-2 border border-dashed rounded-lg hover:border-blue-500 transition w-full h-32 justify-center bg-gray-50">
                  <FiImage className="text-gray-300 group-hover:text-blue-500 text-2xl" />
                  <span className="text-sm text-gray-500">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setImageFiles((prev) => {
                        const arr = [...prev];
                        arr[i] = f;
                        return arr;
                      });
                    }}
                  />
                </label>
                {url && !imageFiles[i] && (
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    className="h-24 w-24 object-cover rounded border shadow-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={saveProduct}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 text-lg"
        >
          {id === "new" ? "➕ Add Product" : "💾 Save Changes"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
