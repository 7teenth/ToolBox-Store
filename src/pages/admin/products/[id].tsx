// pages/admin/products/[id].tsx
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/admin/Layout";
import { supabase } from "@/lib/supabaseClient";
import { FiImage, FiTrash2 } from "react-icons/fi";
import { tool_types } from "@/types/tool_types";

// ---------------- TYPES ----------------
type Brand = { id: string; name: string };
type Category = { id: string; name: string };
type Subcategory = { id: string; name: string; category_id: string };
type ToolType = { id: string; name: string; slug?: string };
interface Product {
  id: string | null;
  name: string;
  slug: string;
  price: number;
  status?: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  tool_type_id: string | null;
  brand_id: string | null;
  short_description: string;
  description: string;
  image_url: string | null;
  hover_image_url: string | null;
  image_3: string | null;
  image_4: string | null;
  image_5: string | null;
  image_6: string | null;
  image_7: string | null;
  image_8: string | null;
  weight: number | null;
  power_watts: number | null;
  torque: number | null;
  rpm: number | null;
  speeds: number | null;
  removable_chuck: boolean;
  power_type: string | null;
  chuck_diameter: number | null;
}

// ---------------- DYNAMIC FIELDS ----------------
const typeFieldsMap: Record<string, string[]> = {
  screwdriver: ["power_type", "torque", "rpm", "speeds", "removable_chuck"],
  grinder: ["power_watts", "weight", "rpm"],
  hammer_drill: ["power_watts", "weight", "power_type", "torque"],
  saw: ["power_watts", "weight", "rpm", "chuck_diameter"],
  battery: ["power_type", "battery_capacity", "voltage"],
};

// ---------------- HELPERS ----------------
function generateSlug(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 100);
}

// Debounce hook for slug generation
function useDebounce(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ---------------- COMPONENT ----------------
export default function ProductAdminPage() {
  const router = useRouter();
  const { id } = router.query;
  // consider `id === 'new'` as creating a new product (not editing)
  const isEditing = Boolean(id && id !== "new");

  // Options
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [toolTypes, setToolTypes] = useState<ToolType[]>([]);

  // Product state
  const [product, setProduct] = useState<Product>({
    id: null,
    name: "",
    slug: "",
    price: 0,
    category_id: null,
    subcategory_id: null,
    tool_type_id: null,
    brand_id: null,
    short_description: "",
    description: "",
    image_url: null,
    hover_image_url: null,
    image_3: null,
    image_4: null,
    image_5: null,
    image_6: null,
    image_7: null,
    image_8: null,
    weight: null,
    power_watts: null,
    torque: null,
    rpm: null,
    speeds: null,
    removable_chuck: false,
    power_type: null,
    chuck_diameter: null,
    status: null,
  });

  // Images
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(8).fill(null)
  );
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    Array(8).fill(null)
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const debouncedName = useDebounce(product.name, 300);

  // ---------------- FETCH OPTIONS ----------------
  useEffect(() => {
    async function fetchOptions() {
      const [bR, cR, sR, tR] = await Promise.all([
        supabase.from("brands").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name"),
        supabase.from("tool_types").select("*").order("name"),
      ]);
      // Log results so missing/empty brands can be diagnosed in dev
      console.log("fetchOptions results:", {
        brands: bR,
        categories: cR,
        subcategories: sR,
        tool_types: tR,
      });
      if (bR.error) console.error("Brands fetch error:", bR.error);
      if (cR.error) console.error("Categories fetch error:", cR.error);
      if (sR.error) console.error("Subcategories fetch error:", sR.error);
      if (tR.error) console.error("Tool types fetch error:", tR.error);
      setBrands(bR.data || []);
      setCategories(cR.data || []);
      setSubcategories(sR.data || []);
      setToolTypes(tR.data || []);
    }
    fetchOptions();
  }, []);

  // ---------------- FETCH PRODUCT ----------------
  useEffect(() => {
    if (!id || id === "new") return;
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      if (data) {
        setProduct({ ...data });
        setImagePreviews([
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
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // ---------------- AUTO SLUG ----------------
  useEffect(() => {
    if (!isEditing) {
      setProduct((p) => ({ ...p, slug: generateSlug(debouncedName) }));
    }
  }, [debouncedName, isEditing]);

  // ---------------- DISPLAYED FIELDS ----------------
  const displayedFields = useMemo(() => {
    const tt = toolTypes.find((t) => t.id === product.tool_type_id);
    const slug = tt?.slug || "";
    // prefer fields from src/types/tool_types.ts (editable mapping), fallback to in-file map
    if (slug && tool_types && tool_types[slug]) return tool_types[slug];
    return (slug && typeFieldsMap[slug]) || [];
  }, [product.tool_type_id, toolTypes]);

  // ---------------- FIELD SETTER ----------------
  const setField = (key: keyof Product, value: any) =>
    setProduct((p) => ({ ...p, [key]: value }));

  // ---------------- IMAGE HANDLERS ----------------
  function onFileChoose(i: number, file?: File | null) {
    const files = [...imageFiles];
    const previews = [...imagePreviews];
    // revoke old preview
    if (previews[i]) URL.revokeObjectURL(previews[i]!);
    files[i] = file || null;
    previews[i] = file ? URL.createObjectURL(file) : null;
    setImageFiles(files);
    setImagePreviews(previews);
  }

  function removeImage(i: number) {
    const files = [...imageFiles];
    const previews = [...imagePreviews];
    if (previews[i]) URL.revokeObjectURL(previews[i]!);
    files[i] = null;
    previews[i] = null;
    setImageFiles(files);
    setImagePreviews(previews);
    const keys: (keyof Product)[] = [
      "image_url",
      "hover_image_url",
      "image_3",
      "image_4",
      "image_5",
      "image_6",
      "image_7",
      "image_8",
    ];
    setField(keys[i], null);
  }

  // ---------------- UPLOAD ----------------
  async function uploadFileToStorage(file: File, productIdForPath: string) {
    const safeName = file.name.replace(/\s+/g, "_");
    const path = `assets/products/${productIdForPath}/${Date.now()}_${safeName}`;
    const { error } = await supabase.storage
      .from("products")
      .upload(path, file, { upsert: true });
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data } = supabase.storage.from("products").getPublicUrl(path);
    return data.publicUrl;
  }

  // ---------------- SAVE ----------------
  async function saveProduct() {
    // Validation
    if (!product.name.trim()) {
      alert("Введите название товара");
      return;
    }
    if (!product.price) {
      alert("Введите цену");
      return;
    }
    if (!product.category_id) {
      alert("Выберите категорию");
      return;
    }

    try {
      setSaving(true);
      let productId = product.id || null;

      // create stub if new
      if (!productId) {
        console.log("POST /api/products/idt6id body", {
          action: "createStub",
          name: product.name,
        });
        const res = await fetch("/api/products/idt6id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "createStub", name: product.name }),
        });
        const json = await res.json();
        if (!res.ok) {
          console.error("createStub failed", res.status, json);
          alert(
            "Ошибка создания товара: " +
              (json?.error?.message || json?.error || JSON.stringify(json))
          );
          setSaving(false);
          return;
        }
        productId = json.id;
      }

      // upload images parallel
      const keys: (keyof Product)[] = [
        "image_url",
        "hover_image_url",
        "image_3",
        "image_4",
        "image_5",
        "image_6",
        "image_7",
        "image_8",
      ];
      const uploadedUrls = { ...product };
      await Promise.all(
        imageFiles.map(async (file, i) => {
          const key = keys[i] as keyof Product;
          if (file) {
            const url = await uploadFileToStorage(file, productId as string);
            (uploadedUrls as any)[key] = url;
          } else if (!imagePreviews[i]) {
            (uploadedUrls as any)[key] = null;
          }
        })
      );

      // prepare payload
      const payload = {
        ...uploadedUrls,
        id: productId,
        name: product.name,
        slug: product.slug || generateSlug(product.name),
        price: Number(product.price),
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        tool_type_id: product.tool_type_id,
        brand_id: product.brand_id,
        short_description: product.short_description,
        description: product.description,
        weight: product.weight,
        power_watts: product.power_watts,
        torque: product.torque,
        rpm: product.rpm,
        speeds: product.speeds,
        removable_chuck: !!product.removable_chuck,
        power_type: product.power_type,
        chuck_diameter: product.chuck_diameter,
        status: product.status ?? undefined,
      };

      // call upsert API
      const res = await fetch("/api/products/idt6id", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upsert", payload }),
      });
      const resJson = await res.json();
      if (res.status >= 400)
        alert(
          "Ошибка сохранения: " + (resJson?.error?.message || res.statusText)
        );
      else {
        alert("Товар сохранён ✅");
        if (resJson?.id) router.replace(`/admin/products/${resJson.id}`);
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- RENDER ----------------
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">
            {isEditing ? "Редактировать товар" : "Добавить товар"}
          </h1>
          <button
            onClick={saveProduct}
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
          >
            {saving ? "Сохраняю..." : "Сохранить товар"}
          </button>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Основная информация */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Название</label>
                <input
                  className="mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                  value={product.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Название товара"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Slug</label>
                <input
                  className="mt-2 border rounded-lg px-3 py-2 bg-gray-50"
                  value={product.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="slug-для-url"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600">Цена</label>
                  <input
                    type="number"
                    className="mt-2 border rounded-lg px-3 py-2"
                    value={product.price}
                    onChange={(e) => setField("price", Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600">Бренд</label>
                  <select
                    className="mt-2 border rounded-lg px-3 py-2"
                    value={product.brand_id || ""}
                    onChange={(e) =>
                      setField("brand_id", e.target.value || null)
                    }
                  >
                    <option value="">— выбрать бренд —</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600">Статус</label>
                <select
                  className="mt-2 border rounded-lg px-3 py-2"
                  value={product.status ?? "В наявності"}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option value="В наявності">В наявності</option>
                  <option value="Не в наявності">Не в наявності</option>
                </select>
              </div>
            </div>

            {/* Категории / Тип */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="border rounded-lg px-3 py-2"
                  value={product.category_id || ""}
                  onChange={(e) => {
                    setField("category_id", e.target.value || null);
                    setField("subcategory_id", null);
                    setField("tool_type_id", null);
                  }}
                >
                  <option value="">— категория —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  className="border rounded-lg px-3 py-2"
                  value={product.subcategory_id || ""}
                  onChange={(e) => {
                    setField("subcategory_id", e.target.value || null);
                    setField("tool_type_id", null);
                  }}
                >
                  <option value="">— подкатегория —</option>
                  {subcategories
                    .filter(
                      (s) =>
                        !product.category_id ||
                        s.category_id === product.category_id
                    )
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
                <select
                  className="border rounded-lg px-3 py-2"
                  value={product.tool_type_id || ""}
                  onChange={(e) =>
                    setField("tool_type_id", e.target.value || null)
                  }
                >
                  <option value="">— тип инструмента —</option>
                  {toolTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Описание */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
              <textarea
                className="w-full border rounded-lg p-3 h-20"
                placeholder="Короткое описание"
                value={product.short_description}
                onChange={(e) => setField("short_description", e.target.value)}
              />
              <textarea
                className="w-full border rounded-lg p-3 h-36"
                placeholder="Полное описание"
                value={product.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            {/* Технические поля */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold mb-2">Технические характеристики</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayedFields.includes("weight") && (
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600">Вага (кг)</label>
                    <input
                      type="number"
                      className="mt-2 border rounded-lg px-3 py-2"
                      value={product.weight ?? ""}
                      onChange={(e) =>
                        setField(
                          "weight",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                )}
                {displayedFields.includes("power_type") && (
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600">
                      Тип живлення
                    </label>
                    <input
                      type="text"
                      className="mt-2 border rounded-lg px-3 py-2"
                      value={product.power_type ?? ""}
                      onChange={(e) => setField("power_type", e.target.value)}
                    />
                  </div>
                )}
                {displayedFields.includes("power_watts") && (
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600">
                      Потужність (Вт)
                    </label>
                    <input
                      type="number"
                      className="mt-2 border rounded-lg px-3 py-2"
                      value={product.power_watts ?? ""}
                      onChange={(e) =>
                        setField(
                          "power_watts",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                )}
                {displayedFields.includes("torque") && (
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600">
                      Крутний момент (Нм)
                    </label>
                    <input
                      type="number"
                      className="mt-2 border rounded-lg px-3 py-2"
                      value={product.torque ?? ""}
                      onChange={(e) =>
                        setField(
                          "torque",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                )}
                {displayedFields.includes("rpm") && (
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600">
                      Оберти (rpm)
                    </label>
                    <input
                      type="number"
                      className="mt-2 border rounded-lg px-3 py-2"
                      value={product.rpm ?? ""}
                      onChange={(e) =>
                        setField(
                          "rpm",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                )}
                {displayedFields.includes("speeds") && (
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600">
                      К-сть швидкостей
                    </label>
                    <input
                      type="number"
                      className="mt-2 border rounded-lg px-3 py-2"
                      value={product.speeds ?? ""}
                      onChange={(e) =>
                        setField(
                          "speeds",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                )}
                {displayedFields.includes("removable_chuck") && (
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={!!product.removable_chuck}
                      onChange={(e) =>
                        setField("removable_chuck", e.target.checked)
                      }
                    />
                    Зйомний патрон
                  </label>
                )}
                {displayedFields.includes("chuck_diameter") && (
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600">
                      Діаметр патрона (мм)
                    </label>
                    <input
                      type="number"
                      className="mt-2 border rounded-lg px-3 py-2"
                      value={product.chuck_diameter ?? ""}
                      onChange={(e) =>
                        setField(
                          "chuck_diameter",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: IMAGES */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-3">Изображения</h3>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative border rounded-lg overflow-hidden group"
                  >
                    <label className="cursor-pointer w-full h-28 bg-gray-50 flex items-center justify-center">
                      {imagePreviews[i] ? (
                        <img
                          src={imagePreviews[i]!}
                          className="w-full h-full object-contain"
                          alt={`img-${i}`}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <FiImage size={28} />
                          <span className="text-xs mt-1">
                            {i === 0
                              ? "Основное"
                              : i === 1
                              ? "Hover"
                              : `#${i + 1}`}
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          onFileChoose(i, e.target.files?.[0] || undefined)
                        }
                      />
                    </label>
                    {imagePreviews[i] && (
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-90 hover:opacity-100"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </AdminLayout>
  );
}
