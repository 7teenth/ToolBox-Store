import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";
import {
  ArrowUpTrayIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const SUPABASE_BASE_URL =
  "https://tsofemmfvfmioiwcsayj.supabase.co/storage/v1/object/public/products";

// 🔹 Генерація slug
const generateSlug = (text: string) => {
  if (!text) return "";
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    ґ: "g",
    д: "d",
    е: "e",
    є: "e",
    ж: "zh",
    з: "z",
    и: "i",
    і: "i",
    ї: "i",
    й: "i",
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
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ю: "yu",
    я: "ya",
    ь: "",
    "'": "",
    " ": "-",
    "—": "-",
    ".": "",
    ",": "",
    ":": "",
    ";": "",
  };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] || ch)
    .join("")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const getImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${SUPABASE_BASE_URL}/${path}`;
};

// 🔹 Дополнительные параметры с украинским названием
const paramColumns: { key: string; label: string }[] = [
  { key: "weight", label: "Вага" },
  { key: "power_watts", label: "Потужність (Вт)" },
  { key: "rpm", label: "Оберти (RPM)" },
  { key: "torque", label: "Крутний момент (Н·м)" },
  { key: "speeds", label: "Кількість швидкостей" },
  { key: "removable_chuck", label: "Знімний патрон" },
];

const ToolTypeForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    if (id && id !== "new") fetchToolType();
  }, [id]);

  useEffect(() => {
    if (categoryId) fetchSubcategories(categoryId);
    else setSubcategories([]);
  }, [categoryId]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name");
    setCategories(data || []);
  };

  const fetchSubcategories = async (catId: string) => {
    const { data } = await supabase
      .from("subcategories")
      .select("id, name")
      .eq("category_id", catId);
    setSubcategories(data || []);
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
      setSubcategoryId(data.subcategory_id);
      setImageUrl(data.image_url);
      setPreviewUrl(getImageUrl(data.image_url));
      setSelectedColumns(data.parameters || []);
    }
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(imageUrl ? getImageUrl(imageUrl) : null);
    }
  };

  const uploadToolTypeImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;
    const cleanName = generateSlug(imageFile.name.replace(/\.[^/.]+$/, ""));
    const fileExt = imageFile.name.split(".").pop();
    const bucketPath = `assets/tool_types/${Date.now()}_${cleanName}.${fileExt}`;
    const { error } = await supabase.storage
      .from("products")
      .upload(bucketPath, imageFile, { upsert: true });
    if (error) {
      console.error("Помилка завантаження файлу:", error.message || error);
      return null;
    }
    return bucketPath;
  };

  const checkSlugUnique = async (slugToCheck: string) => {
    try {
      const { data, error } = await supabase
        .from("tool_types")
        .select("id")
        .eq("slug", slugToCheck)
        .limit(1)
        .maybeSingle();
      if (error) return false;
      if (data && (id === "new" || data.id !== id)) return false;
      return true;
    } catch {
      return false;
    }
  };

  const saveToolType = async () => {
    if (!name.trim() || !slug.trim() || !categoryId || !subcategoryId) {
      alert("Заповніть всі обов'язкові поля!");
      return;
    }
    setLoading(true);
    const uploadedPath = imageFile ? await uploadToolTypeImage() : imageUrl;
    const slugUnique = await checkSlugUnique(slug);
    if (!slugUnique) {
      alert("Slug вже існує!");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      slug,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      image_url: uploadedPath,
      parameters: [
        ...selectedColumns,
        "price",
        "brand",
        "short_description",
        "description",
      ],
    };

    try {
      if (id === "new") {
        // insert into DB
        await supabase.from("tool_types").insert(payload).select();

        // update local types file via API so `src/types/tool_types.ts` is in sync
        try {
          const resp = await fetch("/api/addToolType", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, selectedColumns }),
          });
          const json = await resp.json().catch(() => ({}));
          if (!resp.ok) {
            console.warn(
              "API /api/addToolType returned non-OK status",
              resp.status,
              json
            );
            alert(
              "Warning: could not update src/types/tool_types.ts on disk. Check server logs."
            );
          } else {
            console.log("/api/addToolType response:", json);
          }
        } catch (fileErr) {
          console.warn(
            "Failed to update src/types/tool_types.ts via API:",
            fileErr
          );
          alert(
            "Warning: failed to contact /api/addToolType. See console for details."
          );
        }
      } else {
        await supabase.from("tool_types").update(payload).eq("id", id).select();
      }
      router.push("/admin/tool_types");
    } catch (err) {
      console.error(err);
      alert("Помилка при збереженні типу інструменту");
    } finally {
      setLoading(false);
    }
  };

  const deleteToolType = async (id: string) => {
    // Получаем запись
    const { data: toolType, error: fetchError } = await supabase
      .from("tool_types")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !toolType) {
      console.error("Не удалось получить тип:", fetchError);
      return;
    }

    const strip = (s: string) => (s || "").split("?")[0].replace(/^\/+/, "");
    const buildCandidates = (raw?: string | null) => {
      const candidates = new Set<string>();
      if (!raw) return [] as string[];
      const r = String(raw);
      candidates.add(strip(r));
      try {
        candidates.add(strip(decodeURIComponent(r)));
      } catch {}
      if (r.includes(SUPABASE_BASE_URL))
        candidates.add(strip(r.replace(SUPABASE_BASE_URL + "/", "")));
      const objMatch = r.match(/\/object\/public\/products\/(.+)$/);
      if (objMatch && objMatch[1]) candidates.add(strip(objMatch[1]));
      const prodMatch = r.match(/\/products\/(.+)$/);
      if (prodMatch && prodMatch[1]) candidates.add(strip(prodMatch[1]));
      if (/^assets\//.test(r)) candidates.add(strip(r));
      Array.from(Array.from(candidates)).forEach((c) => {
        try {
          candidates.add(decodeURIComponent(c));
        } catch {}
        candidates.add(c.replace(/%2F/g, "/"));
      });
      return Array.from(candidates).map(strip).filter(Boolean);
    };

    // Merge candidates from DB value and the public URL (in case formats differ)
    const dbCandidates = buildCandidates(toolType.image_url);
    const publicUrl = getImageUrl(toolType.image_url) || undefined;
    const publicCandidates = buildCandidates(publicUrl);
    const finalCandidates = Array.from(
      new Set([...dbCandidates, ...publicCandidates])
    );

    if (finalCandidates.length > 0)
      console.log("Delete candidates for", id, finalCandidates);

    let removed = false;
    for (const candidate of finalCandidates) {
      try {
        const { error: deleteError } = await supabase.storage
          .from("products")
          .remove([candidate]);
        if (!deleteError) {
          console.log("Removed from storage:", candidate);
          removed = true;
          break;
        }
        console.warn(
          "Remove error for",
          candidate,
          deleteError.message || deleteError
        );

        // Try listing parent directory and find a match
        const parent = candidate.includes("/")
          ? candidate.split("/").slice(0, -1).join("/")
          : "";
        try {
          const { data: listData, error: listErr } = await supabase.storage
            .from("products")
            .list(parent || "", { limit: 1000 });
          if (listErr) {
            console.warn("List error for parent", parent, listErr);
          } else {
            const targetName = candidate.split("/").pop();
            const found = (listData || []).find(
              (f: any) =>
                f.name === targetName ||
                f.name === candidate ||
                decodeURIComponent(f.name) === targetName
            );
            if (found) {
              const tryPath = parent ? `${parent}/${found.name}` : found.name;
              const { error: remove2 } = await supabase.storage
                .from("products")
                .remove([tryPath]);
              if (!remove2) {
                console.log("Removed via listing match:", tryPath);
                removed = true;
                break;
              } else {
                console.warn(
                  "Failed removing via listing match",
                  tryPath,
                  remove2
                );
              }
            }
          }
        } catch (e) {
          console.warn("Error while listing parent for debugging:", e);
        }
      } catch (e) {
        console.warn(
          "Unexpected error during remove attempt for",
          candidate,
          e
        );
      }
    }

    if (!removed && finalCandidates.length > 0)
      console.error(
        "All attempts to remove image failed. Candidates:",
        finalCandidates,
        "original:",
        toolType.image_url
      );

    // Удаляем сам тип
    const { error: deleteTypeError } = await supabase
      .from("tool_types")
      .delete()
      .eq("id", id);

    if (deleteTypeError) {
      console.error("Помилка при видаленні типу:", deleteTypeError);
      return;
    }

    // Also remove from src/types/tool_types.ts via API so code mappings stay in sync
    try {
      const resp = await fetch("/api/removeToolType", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: toolType.slug }),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        console.warn("/api/removeToolType failed", resp.status, json);
        alert(
          "Warning: tool type deleted from DB but failed to remove from src/types/tool_types.ts. See console."
        );
      } else {
        console.log("/api/removeToolType response:", json);
      }
    } catch (e) {
      console.warn("Failed to call /api/removeToolType:", e);
      alert(
        "Warning: could not contact /api/removeToolType. Check server logs."
      );
    }
  };

  // Debug: try to remove current imageUrl directly (useful to test exact URL)
  const debugDeleteImage = async () => {
    const raw = imageUrl || "";
    if (!raw) {
      alert("No imageUrl available to delete");
      return;
    }

    const strip = (s: string) => s.split("?")[0].replace(/^\/+/, "");
    const candidates = new Set<string>();
    candidates.add(strip(raw));
    try {
      candidates.add(strip(decodeURIComponent(raw)));
    } catch {}
    if (raw.includes(SUPABASE_BASE_URL))
      candidates.add(strip(raw.replace(SUPABASE_BASE_URL + "/", "")));
    const objMatch = raw.match(/\/object\/public\/products\/(.+)$/);
    if (objMatch && objMatch[1]) candidates.add(strip(objMatch[1]));
    const prodMatch = raw.match(/\/products\/(.+)$/);
    if (prodMatch && prodMatch[1]) candidates.add(strip(prodMatch[1]));
    if (/^assets\//.test(raw)) candidates.add(strip(raw));

    Array.from(Array.from(candidates)).forEach((c) => {
      try {
        candidates.add(decodeURIComponent(c));
      } catch {}
      candidates.add(c.replace(/%2F/g, "/"));
    });

    const final = Array.from(candidates).map(strip).filter(Boolean);

    for (const candidate of final) {
      try {
        // Try remove
        const { error } = await supabase.storage
          .from("products")
          .remove([candidate]);
        if (!error) {
          alert(`Removed from storage: ${candidate}`);
          return;
        } else {
          // show error and continue
          console.warn("Remove error for candidate", candidate, error);
        }
      } catch (e) {
        console.warn("Exception removing candidate", candidate, e);
      }
    }

    alert(`All attempts failed. Tried: ${final.join(", ")}`);
  };

  return (
    <AdminAuthWrapper>
      <AdminLayout>
        <div className="max-w-2xl mx-auto mt-10">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            {id === "new" ? "➕ Додати тип інструменту" : "✏️ Редагувати тип"}
          </h1>

          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
            {/* Назва */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Назва</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                placeholder="Наприклад: Дрилі"
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-slug"
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Категорія */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Категорія</label>
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Оберіть категорію</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Підкатегорія */}
            {subcategories.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Підкатегорія
                </label>
                <select
                  value={subcategoryId || ""}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Оберіть підкатегорію</option>
                  {subcategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Фото */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Фото</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-xl border hover:bg-gray-200">
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  Завантажити
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] || null)
                    }
                  />
                </label>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Попередній перегляд"
                    className="w-28 h-28 rounded-xl border object-cover"
                  />
                )}
                {previewUrl && (
                  <button
                    type="button"
                    onClick={debugDeleteImage}
                    className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Force delete photo
                  </button>
                )}
              </div>
            </div>

            {/* Додаткові параметри */}
            {paramColumns.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Додаткові параметри
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 border rounded-xl max-h-72 overflow-y-auto bg-gray-50">
                  {paramColumns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center justify-between gap-2 p-3 rounded-xl border bg-white hover:bg-blue-50 cursor-pointer"
                    >
                      <span className="text-gray-700">{col.label}</span>
                      <input
                        type="checkbox"
                        value={col.key}
                        checked={selectedColumns.includes(col.key)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedColumns((prev) =>
                            checked
                              ? [...prev, col.key]
                              : prev.filter((c) => c !== col.key)
                          );
                        }}
                        className="accent-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex flex-col gap-3">
              <button
                onClick={saveToolType}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CheckIcon className="h-5 w-5" />
                {loading
                  ? "Збереження..."
                  : id === "new"
                  ? "Додати тип"
                  : "Зберегти зміни"}
              </button>

              {id !== "new" && (
                <button
                  onClick={() => deleteToolType(id as string)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-2xl font-semibold hover:bg-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                  Видалити тип
                </button>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
};

export default ToolTypeForm;
