// pages/admin/products/[id].tsx
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/admin/Layout";
import { FiImage, FiTrash2 } from "react-icons/fi";

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



// ---------------- COMPONENT ----------------
export default function ProductAdminPage() {
  const router = useRouter();
  const { id } = router.query;
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


  const [saving, setSaving] = useState(false);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">
            {isEditing ? "Редактировать товар" : "Добавить товар"}
          </h1>
          <button
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
                  placeholder="Название товара"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Slug</label>
                <input
                  className="mt-2 border rounded-lg px-3 py-2 bg-gray-50"
                  value={product.slug}
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
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600">Бренд</label>
                  <select
                    className="mt-2 border rounded-lg px-3 py-2"
                    value={product.brand_id || ""}
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
              />
              <textarea
                className="w-full border rounded-lg p-3 h-36"
                placeholder="Полное описание"
                value={product.description}
              />
            </div>

            {/* Технические поля */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold mb-2">Технические характеристики</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* {displayedFields.includes("weight") && (
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
                    /> */}
                  {/* </div> */}
                {/* )} */}
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
                      {/* {imagePreviews[i] ? (
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
                      )} */}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    {/* {imagePreviews[i] && (
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-90 hover:opacity-100"
                      >
                        <FiTrash2 />
                      </button>
                    )} */}
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
