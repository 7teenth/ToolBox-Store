import { GetServerSideProps } from "next";
import Head from "next/head";
import { supabase } from "../../lib/supabaseClient";
import { Product } from "../../types/product";
import { Layout } from "../../components/Layout";
import { Reviews, Review } from "../../components/Reviews";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { getImageUrl } from "@/lib/getImageUrl";

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
  const { addItem } = useCart();

  const mainImage = getImageUrl(product?.image_url || "defaults/product.png");
  const hoverImage = product?.image_hover && getImageUrl(product.image_hover);
  const images = [mainImage, hoverImage].filter(Boolean);

  const [selectedImage, setSelectedImage] = useState(mainImage);
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

  const stars = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={
        i < (product.rating || 0) ? "text-yellow-400" : "text-gray-300"
      }
    >
      ★
    </span>
  ));

  const increment = () =>
    setQuantity((q) => Math.min(q + 1, product.stock || 1));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = () => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: getImageUrl(product?.image_url || "defaults/product.png"),
      quantity,
    });

    toast.success("Додано до кошика!", {
      icon: "🛒",
      style: {
        borderRadius: "8px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <Layout>
      <Head>
        <title>{product.name} – ToolBox Store</title>
        <meta
          name="description"
          content={
            product.short_description?.trim()
              ? product.short_description
              : `Купити ${product.name} за ${product.price} грн. Доступно на ToolBox Store.`
          }
        />
      </Head>

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
                onClick={() => setSelectedImage(img ?? mainImage)}
              />
            ))}
          </div>
        </div>

        {/* Инфо */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.tool_types?.name && (
              <p className="text-sm text-gray-500 mb-4">
                Тип інструменту: <strong>{product.tool_types.name}</strong>
              </p>
            )}
            <div className="flex items-center mb-4 gap-2">
              {stars}
              <span className="text-sm text-gray-500">
                ({reviews.length} отзывов)
              </span>
            </div>
            <p className="text-gray-700 mb-4">{product.short_description}</p>
            <span className="text-3xl font-bold text-green-600">
              {product.price} грн
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
          <div className="mt-6 flex gap-4 flex-col sm:flex-row">
            <button
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-lg transition-colors ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              В корзину
            </button>

            <Link href="/cart">
              <button
                className={`flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-lg transition-colors ${
                  product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                Оформить заказ
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex border-b mb-6">
          {["description", "specs", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab === "description"
                ? "Описание"
                : tab === "specs"
                ? "Характеристики"
                : "Отзывы"}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <p className="text-gray-700">
            {product.description?.trim()
              ? product.description
              : "Опис товару наразі недоступний."}
          </p>
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
                  src={getImageUrl(prod.image_url || "defaults/product.png")}
                  alt={prod.name}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="mt-2 font-semibold">{prod.name}</h3>
                <p className="text-green-600 font-bold">{prod.price} грн</p>
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

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, tool_types(name)")
    .eq("id", id)
    .single();

  if (productError) {
    console.error("❌ Error fetching product:", productError.message);
  }

  const { data: similarProducts, error: similarError } = await supabase
    .from("products")
    .select("*, tool_types(name)")
    .neq("id", id)
    .limit(4);

  if (similarError) {
    console.error("❌ Error fetching similar products:", similarError.message);
  }

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
      product: product ?? null,
      reviews,
      similarProducts: similarProducts ?? [],
    },
  };
};
