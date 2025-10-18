import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { FiImage, FiChevronDown, FiChevronUp } from "react-icons/fi";

// Секция формы
const sections = [
  "Основна інформація",
  "Категорії та типи",
  "Опис",
  "Технічні характеристики",
  "Зображення",
];

// Настройка, какие поля отображать для каждого типа инструмента
const typeFieldsMap: Record<string, string[]> = {
  screwdriver: [
    "weight",
    "power_type",
    "power_watts",
    "torque",
    "rpm",
    "speeds",
    "chuck_diameter",
    "removable_chuck",
  ],
  magnet: ["weight", "power_type"],
  dril: [
    "price",
    "brand",
    "weight",
    "power_watts",
    "torque",
    "rpm",
    "speeds",
    "chuck_diameter",
    "removable_chuck",
    "short_description",
    "description",
    "image_url",
    "hover_image_url",
    "image_3",
    "image_4",
    "image_5",
    "image_6",
    "image_7",
    "image_8",
  ],
};

// Простая функция генерации слага из названия
function generateSlug(text: string) {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    ґ: "g",
    д: "d",
    е: "e",
    є: "ye",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "yi",
    й: "y",
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
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ю: "yu",
    я: "ya",
    ь: "",
    "'": "",
    " ": "-",
    ".": "",
    ",": "",
    "/": "-",
  };
  return text
    .toLowerCase()
    .split("")
    .map((c) => map[c] || c)
    .join("")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");
}

const ProductForm = ({ productId }: { productId?: string }) => {
  const [expanded, setExpanded] = useState<string[]>(["Основна інформація"]);
  const [product, setProduct] = useState<any>({
    name: "",
    slug: "",
    price: 0,
    brand: "",
    category_id: null,
    subcategory_id: null,
    tool_type_id: null,
    short_description: "",
    description: "",
    weight: null,
    power_type: "",
    power_watts: null,
    torque: null,
    rpm: null,
    speeds: null,
    chuck_diameter: null,
    removable_chuck: false,
    image_url: null,
    hover_image_url: null,
    image_3: null,
    image_4: null,
    image_5: null,
    image_6: null,
    image_7: null,
    image_8: null,
  });

  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(8).fill(null)
  );
  const [imageUrls, setImageUrls] = useState<(string | null)[]>(
    Array(8).fill(null)
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [toolTypes, setToolTypes] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOptions();
    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      setProduct((prev: any) => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  }, [product.name]);

  const fetchOptions = async () => {
    const { data: cats } = await supabase.from("categories").select("*");
    setCategories(cats || []);
    const { data: subs } = await supabase.from("subcategories").select("*");
    setSubcategories(subs || []);
    const { data: tools } = await supabase.from("tool_types").select("*");
    setToolTypes(tools || []);
  };

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();
    if (!data) return;
    setProduct(data);
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

  const toggleSection = (name: string) => {
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleImageChange = (i: number, file: File) => {
    const newFiles = [...imageFiles];
    const newUrls = [...imageUrls];
    newFiles[i] = file;
    newUrls[i] = URL.createObjectURL(file);
    setImageFiles(newFiles);
    setImageUrls(newUrls);
  };

  const removeImage = (i: number) => {
    const newFiles = [...imageFiles];
    const newUrls = [...imageUrls];
    newFiles[i] = null;
    newUrls[i] = null;
    setImageFiles(newFiles);
    setImageUrls(newUrls);
  };

  const saveProduct = async () => {
    setSaving(true);
    try {
      let currentId = productId || null;

      if (!productId) {
        const { data: inserted, error } = await supabase
          .from("products")
          .insert({ name: product.name, slug: product.slug })
          .select("id")
          .single();

        if (error || !inserted) {
          console.error(error);
          alert("Помилка при створенні товару");
          return;
        }
        currentId = inserted.id;
      }

      const uploadedUrls = await Promise.all(
        imageFiles.map(async (file, i) => {
          if (!file) return imageUrls[i];
          const storagePath = `assets/products/${currentId}/${file.name}`;
          const { data: uploadData } = await supabase.storage
            .from("products")
            .upload(storagePath, file, { upsert: true });
          return uploadData?.path.replace(/^assets\/products\//, "");
        })
      );

      const payload = {
        ...product,
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
      alert("Товар збережено!");
    } catch (e) {
      console.error(e);
      alert("Помилка при збереженні товару");
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    "border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  const filteredSubcategories = subcategories.filter(
    (s) => !product.category_id || s.category_id === product.category_id
  );
  const filteredToolTypes = toolTypes.filter(
    (t) =>
      (!product.category_id || t.category_id === product.category_id) &&
      (!product.subcategory_id || t.subcategory_id === product.subcategory_id)
  );

  const displayedFields = product.tool_type_id
    ? typeFieldsMap[
        toolTypes.find((t) => t.id === product.tool_type_id)?.slug || ""
      ] || []
    : [];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">
        {productId ? "✏️ Редагувати товар" : "🛠️ Додати товар"}
      </h1>
      <div className="space-y-4 max-w-5xl mx-auto">
        {sections.map((sec) => (
          <div
            key={sec}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSection(sec)}
              className="w-full flex justify-between items-center px-6 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              {sec}
              {expanded.includes(sec) ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expanded.includes(sec) && (
              <div className="p-6 space-y-4">
                {sec === "Основна інформація" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Назва</label>
                      <input
                        className={inputBase}
                        placeholder="Назва товару"
                        value={product.name}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            name: e.target.value,
                            slug: generateSlug(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Slug</label>
                      <input
                        className={inputBase}
                        placeholder="slug для URL"
                        value={product.slug || ""}
                        readOnly
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Ціна</label>
                      <input
                        type="number"
                        className={inputBase}
                        value={product.price}
                        min={0}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Бренд</label>
                      <input
                        className={inputBase}
                        value={product.brand || ""}
                        onChange={(e) =>
                          setProduct({ ...product, brand: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {sec === "Категорії та типи" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      className={inputBase}
                      value={product.category_id || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          category_id: e.target.value,
                          subcategory_id: null,
                          tool_type_id: null,
                        })
                      }
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
                      value={product.subcategory_id || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          subcategory_id: e.target.value,
                          tool_type_id: null,
                        })
                      }
                    >
                      <option value="">Оберіть підкатегорію</option>
                      {filteredSubcategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className={inputBase}
                      value={product.tool_type_id || ""}
                      onChange={(e) =>
                        setProduct({ ...product, tool_type_id: e.target.value })
                      }
                    >
                      <option value="">Оберіть тип інструмента</option>
                      {filteredToolTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {sec === "Опис" && (
                  <div className="space-y-2">
                    <textarea
                      className={inputBase}
                      placeholder="Короткий опис"
                      value={product.short_description || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          short_description: e.target.value,
                        })
                      }
                    />
                    <textarea
                      className={inputBase}
                      placeholder="Повний опис"
                      value={product.description || ""}
                      onChange={(e) =>
                        setProduct({ ...product, description: e.target.value })
                      }
                    />
                  </div>
                )}

                {sec === "Технічні характеристики" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {displayedFields.includes("weight") && (
                      <input
                        type="number"
                        className={inputBase}
                        placeholder="Вага"
                        value={product.weight || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            weight: Number(e.target.value),
                          })
                        }
                      />
                    )}
                    {displayedFields.includes("power_type") && (
                      <input
                        className={inputBase}
                        placeholder="Тип живлення"
                        value={product.power_type || ""}
                        onChange={(e) =>
                          setProduct({ ...product, power_type: e.target.value })
                        }
                      />
                    )}
                    {displayedFields.includes("power_watts") && (
                      <input
                        type="number"
                        className={inputBase}
                        placeholder="Потужність (Вт)"
                        value={product.power_watts || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            power_watts: Number(e.target.value),
                          })
                        }
                      />
                    )}
                    {displayedFields.includes("torque") && (
                      <input
                        type="number"
                        className={inputBase}
                        placeholder="Крутний момент"
                        value={product.torque || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            torque: Number(e.target.value),
                          })
                        }
                      />
                    )}
                    {displayedFields.includes("rpm") && (
                      <input
                        type="number"
                        className={inputBase}
                        placeholder="Оберти (rpm)"
                        value={product.rpm || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            rpm: Number(e.target.value),
                          })
                        }
                      />
                    )}
                    {displayedFields.includes("speeds") && (
                      <input
                        type="number"
                        className={inputBase}
                        placeholder="Швидкості"
                        value={product.speeds || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            speeds: Number(e.target.value),
                          })
                        }
                      />
                    )}
                    {displayedFields.includes("chuck_diameter") && (
                      <input
                        type="number"
                        className={inputBase}
                        placeholder="Діаметр патрона"
                        value={product.chuck_diameter || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            chuck_diameter: Number(e.target.value),
                          })
                        }
                      />
                    )}
                    {displayedFields.includes("removable_chuck") && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={product.removable_chuck}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              removable_chuck: e.target.checked,
                            })
                          }
                        />
                        Зйомний патрон
                      </label>
                    )}
                  </div>
                )}

                {sec === "Зображення" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, i) => (
                      <div
                        key={i}
                        className="relative flex flex-col items-center group border rounded-xl overflow-hidden hover:shadow-lg transition"
                      >
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-gray-50 hover:bg-gray-100">
                          {url ? (
                            <img
                              src={url}
                              alt={`Зображення ${i + 1}`}
                              className="object-contain w-full h-full transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <FiImage className="text-gray-400 text-4xl" />
                          )}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageChange(i, file);
                            }}
                          />
                        </label>
                        {url && (
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={saveProduct}
          disabled={saving}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Збереження..." : "Зберегти"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
