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

  return finalUrl.replace(/([^:])\/{2,}/g, "$1/").replace(/--+/g, "-");
}

const ProductForm = () => {
  const router = useRouter();
  const { id } = router.query;

  // Основные поля
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [toolTypeId, setToolTypeId] = useState<string | null>(null);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState<number | null>(null);
  const [powerType, setPowerType] = useState("");
  const [powerWatts, setPowerWatts] = useState<number | null>(null);
  const [torque, setTorque] = useState<number | null>(null);
  const [rpm, setRpm] = useState<number | null>(null);
  const [speeds, setSpeeds] = useState<number | null>(null);
  const [chuckDiameter, setChuckDiameter] = useState<number | null>(null);
  const [removableChuck, setRemovableChuck] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);

  // Изображения
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(8).fill(null)
  );
  const [imageUrls, setImageUrls] = useState<(string | null)[]>(
    Array(8).fill(null)
  );

  // Опции select
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string; category_id?: string; tool_type_id?: string }[]
  >([]);
  const [toolTypes, setToolTypes] = useState<
    { id: string; name: string; category_id?: string }[]
  >([]);

  useEffect(() => {
    fetchOptions();
    if (id && id !== "new") fetchProduct();
  }, [id]);

  const fetchOptions = async () => {
    const { data: cats } = await supabase.from("categories").select("id, name");
    setCategories(cats || []);

    const { data: subs } = await supabase
      .from("subcategories")
      .select("id, name, category_id, tool_type_id");
    setSubcategories(subs || []);

    const { data: tools } = await supabase
      .from("tool_types")
      .select("id, name, category_id");
    setToolTypes(tools || []);
  };

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return;

    setName(data.name);
    setSlug(data.slug || "");
    setPrice(data.price);
    setBrand(data.brand || "");
    setStock(data.stock || 0);
    setCategoryId(data.category_id);
    setSubcategoryId(data.subcategory_id);
    setToolTypeId(data.tool_type_id);
    setShortDescription(data.short_description || "");
    setDescription(data.description || "");
    setWeight(data.weight || null);
    setPowerType(data.power_type || "");
    setPowerWatts(data.power_watts || null);
    setTorque(data.torque || null);
    setRpm(data.rpm || null);
    setSpeeds(data.speeds || null);
    setChuckDiameter(data.chuck_diameter || null);
    setRemovableChuck(data.removable_chuck || false);
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
  };

  const filteredToolTypes = toolTypes.filter(
    (t) => !categoryId || t.category_id === categoryId
  );
  const filteredSubcategories = subcategories.filter(
    (s) => !categoryId || s.category_id === categoryId
  );

  const saveProduct = async () => {
    try {
      let currentId = id === "new" ? null : (id as string);

      if (id === "new") {
        const { data: inserted, error } = await supabase
          .from("products")
          .insert({ name, slug, price })
          .select("id")
          .single();
        if (error || !inserted) return;
        currentId = inserted.id;
      }

      const uploadedUrls = await Promise.all(
        imageFiles.map(async (file, i) => {
          if (!file) return imageUrls[i];
          const storagePath = `assets/products/${currentId}/${file.name}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("products")
              .upload(storagePath, file, { upsert: true });
          if (uploadError) return null;
          return uploadData.path.replace(/^assets\/products\//, "");
        })
      );

      const payload = {
        name,
        slug,
        price,
        brand,
        stock,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        tool_type_id: toolTypeId,
        short_description: shortDescription,
        description,
        weight,
        power_type: powerType,
        power_watts: powerWatts,
        torque,
        rpm,
        speeds,
        chuck_diameter: chuckDiameter,
        removable_chuck: removableChuck,
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

      await supabase.from("products").upsert(payload, { onConflict: "id" });
      router.push("/admin/products");
    } catch (e) {
      console.error(e);
    }
  };

  const inputBase =
    "border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">
        {id === "new" ? "🛠️ Додати товар" : "✏️ Редагувати товар"}
      </h1>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto space-y-8">
        {/* Общая информация */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Загальна інформація
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className={inputBase}
              placeholder="Назва"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={inputBase}
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <input
              type="number"
              className={inputBase}
              placeholder="Ціна"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <input
              className={inputBase}
              placeholder="Бренд"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <input
              type="number"
              className={inputBase}
              placeholder="Кількість на складі"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
            <input
              type="number"
              className={inputBase}
              placeholder="Рейтинг"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
        </section>

        {/* Категории и типы */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Категорії та типи
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className={inputBase}
              value={categoryId || ""}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId(null);
                setToolTypeId(null);
              }}
            >
              <option value="">Оберіть категорію</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className={inputBase}
              value={toolTypeId || ""}
              onChange={(e) => setToolTypeId(e.target.value)}
            >
              <option value="">Оберіть тип</option>
              {filteredToolTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              className={inputBase}
              value={subcategoryId || ""}
              onChange={(e) => setSubcategoryId(e.target.value)}
            >
              <option value="">Оберіть підкатегорію</option>
              {filteredSubcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Описание */}
        <section className="space-y-4">
          <textarea
            className={inputBase}
            placeholder="Короткий опис"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          <textarea
            className={inputBase}
            placeholder="Повний опис"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>

        {/* Дополнительные параметры */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              className={inputBase}
              placeholder="Вага"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
            <input
              className={inputBase}
              placeholder="Тип живлення"
              value={powerType}
              onChange={(e) => setPowerType(e.target.value)}
            />
            <input
              type="number"
              className={inputBase}
              placeholder="Потужність (Вт)"
              value={powerWatts || ""}
              onChange={(e) => setPowerWatts(Number(e.target.value))}
            />
            <input
              type="number"
              className={inputBase}
              placeholder="Крутний момент"
              value={torque || ""}
              onChange={(e) => setTorque(Number(e.target.value))}
            />
            <input
              type="number"
              className={inputBase}
              placeholder="Оберти (rpm)"
              value={rpm || ""}
              onChange={(e) => setRpm(Number(e.target.value))}
            />
            <input
              type="number"
              className={inputBase}
              placeholder="Швидкості"
              value={speeds || ""}
              onChange={(e) => setSpeeds(Number(e.target.value))}
            />
            <input
              type="number"
              className={inputBase}
              placeholder="Діаметр патрона"
              value={chuckDiameter || ""}
              onChange={(e) => setChuckDiameter(Number(e.target.value))}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={removableChuck}
                onChange={(e) => setRemovableChuck(e.target.checked)}
              />
              Зйомний патрон
            </label>
          </div>
        </section>

        {/* Изображения */}
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
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <FiImage className="text-gray-400 text-3xl" />
                  )}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (!file) return;
                      const newFiles = [...imageFiles];
                      const newUrls = [...imageUrls];
                      newFiles[i] = file;
                      newUrls[i] = URL.createObjectURL(file);
                      setImageFiles(newFiles);
                      setImageUrls(newUrls);
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={saveProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg"
        >
          Зберегти
        </button>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
