import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { FiImage } from "react-icons/fi";

export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleaned = path.replace(/^\/+/, "").replace(/--+/g, "-");
  const base =
    "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products/assets";

  let finalUrl = "";

  if (
    cleaned.startsWith("categories/") ||
    cleaned.startsWith("defaults/") ||
    cleaned.startsWith("logos/") ||
    cleaned.startsWith("slides/") ||
    cleaned.startsWith("products/")
  ) {
    finalUrl = `${base}/${cleaned}`;
  } else {
    finalUrl = `${base}/products/${cleaned}`;
  }

  finalUrl = finalUrl.replace(/([^:])\/{2,}/g, "$1/").replace(/--+/g, "-");

  return finalUrl;
}

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
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return;

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

  // ...

  const saveProduct = async () => {
    try {
      let currentId = id === "new" ? null : (id as string);

      if (id === "new") {
        const { data: inserted, error } = await supabase
          .from("products")
          .insert({ name, slug, price: price || 0 })
          .select("id")
          .single();
        if (error || !inserted) return;
        currentId = inserted.id;
      }

      // Завантажуємо картинки
      const uploadedUrls = await Promise.all(
        imageFiles.map(async (file, i) => {
          if (!file) return imageUrls[i]; // оставляем старый URL, если файл не выбран

          // Загружаем в Supabase с папкой assets/products
          const storagePath = `assets/products/${currentId}/${file.name}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("products")
              .upload(storagePath, file, { upsert: true });

          if (uploadError) {
            console.error("Upload error:", uploadError);
            return null;
          }

          // Для БД сохраняем только путь относительно assets/products
          // Например: "12345/filename.jpg" вместо "assets/products/12345/filename.jpg"
          const relativePath = uploadData.path.replace(
            /^assets\/products\//,
            ""
          );
          return relativePath;
        })
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
        image_url: uploadedUrls[0],
        hover_image_url: uploadedUrls[1],
        image_3: uploadedUrls[2],
        image_4: uploadedUrls[3],
        image_5: uploadedUrls[4],
        image_6: uploadedUrls[5],
        image_7: uploadedUrls[6],
        image_8: uploadedUrls[7],
      };

      await supabase.from("products").update(payload).eq("id", currentId);
      router.push("/admin/products");
    } catch (e) {
      console.error(e);
    }
  };

  const inputBase =
    "border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {id === "new" ? "🛠️ Додати товар" : "✏️ Редагувати товар"}
      </h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto space-y-8">
        {/* Загальна інформація */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Загальна інформація
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Назва</label>
              <input
                className={inputBase}
                placeholder="Назва"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Slug</label>
              <input
                className={inputBase}
                placeholder="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Ціна</label>
              <input
                className={inputBase}
                type="number"
                placeholder="Ціна"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Бренд</label>
              <input
                className={inputBase}
                placeholder="Бренд"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">
                Кількість на складі
              </label>
              <input
                className={inputBase}
                type="number"
                placeholder="Кількість"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Категорії */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Категорії та типи
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Категорія</label>
              <select
                className={inputBase}
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Оберіть категорію</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Підкатегорія</label>
              <select
                className={inputBase}
                value={subcategoryId || ""}
                onChange={(e) => setSubcategoryId(e.target.value)}
              >
                <option value="">Оберіть підкатегорію</option>
                {subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">
                Тип інструменту
              </label>
              <select
                className={inputBase}
                value={toolTypeId || ""}
                onChange={(e) => setToolTypeId(e.target.value)}
              >
                <option value="">Оберіть тип</option>
                {toolTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Опис */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Опис
          </h2>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Короткий опис</label>
            <textarea
              className={inputBase}
              placeholder="Короткий опис"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Повний опис</label>
            <textarea
              className={inputBase}
              placeholder="Повний опис"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </section>

        {/* Додаткова інформація */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Додаткова інформація
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Вага</label>
              <input
                className={inputBase}
                type="number"
                placeholder="Вага"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Тип живлення</label>
              <input
                className={inputBase}
                placeholder="Тип живлення"
                value={powerType}
                onChange={(e) => setPowerType(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Зображення */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Зображення
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                <label className="cursor-pointer flex flex-col items-center p-2 border border-dashed rounded-lg hover:border-blue-500 transition w-full h-32 justify-center bg-gray-50">
                  {url ? (
                    <img
                      src={url.startsWith("blob:") ? url : getImageUrl(url)}
                      alt={`Зображення ${i + 1}`}
                      className="h-24 w-24 object-cover rounded border shadow-sm"
                    />
                  ) : (
                    <>
                      <FiImage className="text-gray-300 group-hover:text-blue-500 text-2xl" />
                      <span className="text-sm text-gray-500">Завантажити</span>
                    </>
                  )}
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
                      if (f) {
                        const previewUrl = URL.createObjectURL(f);
                        setImageUrls((prev) => {
                          const arr = [...prev];
                          arr[i] = previewUrl;
                          return arr;
                        });
                      }
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Кнопка збереження */}
        <button
          onClick={saveProduct}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 text-lg"
        >
          {id === "new" ? "➕ Додати товар" : "💾 Зберегти зміни"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
