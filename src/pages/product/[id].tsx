// pages/product/[id].tsx
import { GetServerSideProps } from "next";
import { supabase } from "../../lib/supabaseClient";
import { Product } from "../../types/product";
import { Layout } from "../../components/Layout";
import { Reviews, Review } from "../../components/Reviews";
import { useState } from "react";
import Link from "next/link";

interface ProductPageProps {
  product: Product | null;
  reviews: Review[];
  similarProducts: Product[];
}

export default function ProductPage({
  product,
  reviews,
  similarProducts,
}: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(
    product ? `/images/${product.image_url}` : "/images/default-product.png"
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");

  if (!product) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <p>Возможно, этот товар был удалён или не существует.</p>
        </div>
      </Layout>
    );
  }

  const images = [
    `/images/${product.image_url}`,
    product.image_hover ? `/images/${product.image_hover}` : null,
  ].filter(Boolean) as string[];

  const stars = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={i < product.rating ? "text-yellow-400" : "text-gray-300"}
    >
      ★
    </span>
  ));

  const increment = () => setQuantity((q) => Math.min(q + 1, product.stock));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <Layout>
      {/* Верхняя часть: фото + инфо */}
      <div className="max-w-6xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-8">
        {/* Галерея */}
        <div className="flex-1 flex flex-col gap-4">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <div className="flex gap-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === img ? "border-blue-600" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Инфо */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center mb-4 gap-2">
              {stars}
              <span className="text-sm text-gray-500">
                ({reviews.length} отзывов)
              </span>
            </div>
            <p className="text-gray-700 mb-4">{product.short_description}</p>
            <span className="text-3xl font-bold text-green-600">
              ${product.price}
            </span>
            <p className="mt-2 text-sm text-gray-500">
              В наличии: {product.stock > 0 ? product.stock : "Нет"}
            </p>

            {/* Количество */}
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={decrement}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={increment}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Кнопки */}
          <div className="mt-6 flex gap-4">
            <button
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-lg transition-colors ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={product.stock === 0}
            >
              В корзину
            </button>
            <button className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-100">
              В избранное
            </button>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 ${
              activeTab === "description"
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Описание
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-2 ${
              activeTab === "specs"
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Характеристики
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 ${
              activeTab === "reviews"
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Отзывы
          </button>
        </div>

        {activeTab === "description" && (
          <p className="text-gray-700">{product.description}</p>
        )}
        {activeTab === "specs" && (
          <ul className="list-disc ml-6 text-gray-700">
            <li>Мощность: {product.power || "—"}</li>
            <li>Вес: {product.weight || "—"}</li>
            <li>Производитель: {product.brand || "—"}</li>
          </ul>
        )}
        {activeTab === "reviews" && <Reviews reviews={reviews} />}
      </div>

      {/* Похожие товары */}
      <div className="max-w-6xl mx-auto px-4 mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {similarProducts.map((prod) => (
            <Link href={`/product/${prod.id}`} key={prod.id}>
              <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer">
                <img
                  src={`/images/${prod.image_url}`}
                  alt={prod.name}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="mt-2 font-semibold">{prod.name}</h3>
                <p className="text-green-600 font-bold">${prod.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  // 🔹 Заглушка: похожие товары (по категории)
  const { data: similarProducts } = await supabase
    .from("products")
    .select("*")
    .neq("id", id)
    .limit(4);

  // 🔹 Заглушка: отзывы
  const reviews: Review[] = [
    {
      id: 1,
      userName: "Иван",
      rating: 5,
      comment: "Отличный товар!",
      date: "2025-09-26",
    },
    {
      id: 2,
      userName: "Мария",
      rating: 4,
      comment: "Все понравилось, быстро доставили.",
      date: "2025-09-25",
    },
    {
      id: 3,
      userName: "Алексей",
      rating: 5,
      comment: "Рекомендую!",
      date: "2025-09-24",
    },
  ];

  return {
    props: {
      product: product || null,
      reviews,
      similarProducts: similarProducts || [],
    },
  };
};
