import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/Layout";
import { supabase } from "@/lib/supabaseClient";

interface Brand {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrand, setNewBrand] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error(error);
    else setBrands(data || []);
    setLoading(false);
  };

  const addBrand = async () => {
    if (!newBrand.trim()) return;

    setLoading(true);
    let imageUrl: string | null = null;

    if (imageFile) {
      const fileName = `${newBrand
        .toLowerCase()
        .replace(/\s+/g, "_")}_${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        alert("Ошибка при загрузке картинки");
        setLoading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);
      imageUrl = publicData.publicUrl;
    }

    const { data, error } = await supabase
      .from("brands")
      .insert({
        name: newBrand,
        image_url: imageUrl,
        slug: newBrand.toLowerCase().replace(/\s+/g, "_"),
      })
      .select("*")
      .single();

    if (error) console.error(error);
    else {
      setBrands([...brands, data]);
      setNewBrand("");
      setImageFile(null);
    }

    setLoading(false);
  };

  const deleteBrand = async (id: string) => {
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) console.error(error);
    else setBrands(brands.filter((b) => b.id !== id));
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Управление брендами
      </h1>

      {/* Форма добавления */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Название нового бренда"
          value={newBrand} // контролируемый input
          onChange={(e) => setNewBrand(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-blue-400 transition"
        />

        {/* Кнопка загрузки фото */}
        <div className="relative">
          <input
            key={imageFile ? imageFile.name : "empty"} // перерисовываем input при сбросе
            type="file"
            accept="image/*"
            id="file-upload"
            className="absolute w-0 h-0 opacity-0"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-gradient-to-r from-green-400 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {imageFile ? "Файл выбран" : "Загрузить фото"}
          </label>
        </div>

        {/* Кнопка добавить бренд */}
        <button
          onClick={addBrand}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
        >
          Добавить
        </button>
      </div>

      {/* Загрузка */}
      {loading && <p className="text-center text-gray-500 mb-6">Загрузка...</p>}

      {/* Сетка брендов */}
      {brands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-5 flex flex-col items-center hover:scale-105 duration-300"
            >
              <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-4">
                {brand.image_url ? (
                  <img
                    src={brand.image_url}
                    alt={brand.name}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xl">Нет фото</span>
                )}
              </div>
              <h2 className="font-semibold text-lg mb-3 text-center text-gray-800">
                {brand.name}
              </h2>
              <button
                onClick={() => deleteBrand(brand.id)}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      ) : !loading ? (
        <p className="text-center mt-8 text-gray-500 text-lg">
          Брендов пока нет
        </p>
      ) : null}
    </AdminLayout>
  );
};

export default BrandsPage;
