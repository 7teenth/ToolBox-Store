// pages/product/[id].tsx
import { GetServerSideProps } from "next";
import Head from "next/head";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { Layout } from "@/components/Layout";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { getImageUrl } from "@/lib/getImageUrl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";

interface ProductPageProps {
  product: Product | null;
  reviews: Review[];
  similarProducts: Product[];
  imageUrls: string[];
}

const TabSkeleton = ({ lines = 4 }: { lines?: number }) => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-300/70 rounded w-full" />
    ))}
  </div>
);

export default function ProductPage({
  product,
  reviews,
  similarProducts,
  imageUrls,
}: ProductPageProps) {
  const { addItem } = useCart();
  const router = useRouter();

  if (!product) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не знайдено</h1>
          <p className="text-gray-600">
            Можливо, цей товар був видалений або не існує.
          </p>
        </div>
      </Layout>
    );
  }

  const fallbackImage = getImageUrl("defaults/product.png");
  const [selectedImage, setSelectedImage] = useState(
    imageUrls.length > 0 ? imageUrls[0] : fallbackImage
  );
  const [imgLoaded, setImgLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");
  const [loadingTab, setLoadingTab] = useState(false);

  useEffect(() => {
    setSelectedImage(imageUrls.length > 0 ? imageUrls[0] : fallbackImage);
    setImgLoaded(false);
  }, [product, imageUrls]);

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

  const switchTab = (tab: typeof activeTab) => {
    if (tab === activeTab) return;
    setLoadingTab(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoadingTab(false);
    }, 250);
  };

  const increment = () =>
    setQuantity((q) => Math.min(q + 1, product.stock || 1));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = () => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: selectedImage,
      quantity,
    });
    toast.success("Додано до кошика 🛒", {
      style: { borderRadius: "8px", background: "#222", color: "#fff" },
    });
  };

  const cart = useCart();

  const handleOrderNow = () => {
    const alreadyInCart = cart.items.some((i) => i.id === String(product.id));

    if (!alreadyInCart) {
      cart.addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: selectedImage,
        quantity,
      });
      toast.success("Додано до кошика 🛒", {
        style: { borderRadius: "8px", background: "#222", color: "#fff" },
      });
    }

    router.push("/cart");
  };

  return (
    <Layout>
      <Head>
        <title>{product.name} – ToolBox Store</title>
        <meta
          name="description"
          content={
            product.short_description?.trim() ||
            `Купити ${product.name} за ${product.price} грн.`
          }
        />
        <meta property="og:image" content={selectedImage} />
      </Head>

      {/* Контент */}
      <div className="max-w-6xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-10">
        {/* Галерея */}
        <div className="flex-1 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: imgLoaded ? 1 : 0 }}
            className="relative w-full h-96 bg-gray-50 rounded-xl overflow-hidden"
          >
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-contain"
              onLoad={() => setImgLoaded(true)}
              onError={(e) => ((e.currentTarget as any).src = fallbackImage)}
            />
          </motion.div>

          {/* Мініатюри */}
          <div className="flex gap-2 flex-wrap">
            {imageUrls.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(img);
                  setImgLoaded(false);
                }}
                className={`relative w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`thumb-${idx}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Інформація */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-gray-800">
              {product.name}
            </h1>
            {product.tool_types?.name && (
              <p className="text-sm text-gray-500 mb-4">
                Тип інструменту: <strong>{product.tool_types.name}</strong>
              </p>
            )}

            <div className="flex items-center mb-4 gap-2">
              {stars}
              <span className="text-sm text-gray-500">
                ({reviews.length} відгуків)
              </span>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {product.short_description}
            </p>

            <span className="text-3xl font-bold text-green-600 block mb-2">
              {product.price} грн
            </span>
            <p className="text-sm text-gray-500">
              В наявності:{" "}
              <span className="font-medium text-gray-800">
                {product.stock > 0 ? product.stock : "Немає"}
              </span>
            </p>

            <div className="mt-5 flex items-center gap-4">
              <button
                onClick={decrement}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-lg font-semibold"
              >
                −
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={increment}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-lg font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className={`flex-1 px-5 py-3 rounded-lg text-lg text-white font-medium transition-colors ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              У кошик
            </button>
            <button
              disabled={product.stock === 0}
              onClick={handleOrderNow}
              className={`flex-1 px-5 py-3 rounded-lg text-lg text-white font-medium transition-colors ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Оформити замовлення
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex border-b mb-6">
          {["description", "specs", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab as typeof activeTab)}
              className={`px-5 py-2 transition-all ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab === "description"
                ? "Опис"
                : tab === "specs"
                ? "Характеристики"
                : "Відгуки"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {loadingTab ? (
            <TabSkeleton lines={5} />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "description" ? (
                <p className="text-gray-700">
                  {product.description?.trim() ||
                    "Опис товару наразі недоступний."}
                </p>
              ) : activeTab === "specs" ? (
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {product.power && <li>Потужність: {product.power}</li>}
                  {product.weight && <li>Вага: {product.weight}</li>}
                  {product.brand && <li>Виробник: {product.brand}</li>}
                </ul>
              ) : (
                <div className="space-y-8">
                  <ReviewList reviews={reviews} />
                  <ReviewForm productId={product.id} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Схожі товари */}
      <div className="max-w-6xl mx-auto px-4 mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Схожі товари</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {similarProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              isPopular={prod.sales > 50} // можно любой критерий популярности
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

// --- Server Side ---
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, tool_types(name)")
    .eq("id", id)
    .single();

  if (productError || !product) return { notFound: true };

  const { data: similarProducts } = await supabase
    .from("products")
    .select("*, tool_types(name)")
    .neq("id", id)
    .limit(4);

  const { data: rawReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", id)
    .order("date", { ascending: false });

  const reviews: Review[] =
    rawReviews?.map((r) => ({
      id: r.id,
      userName: r.user_name,
      rating: r.rating,
      comment: r.comment,
      date: r.date,
    })) || [];

  // --- Формируем массив реально существующих картинок ---
  const fallbackImage = "defaults/product.png";
  const imageFields = [
    (product as any).image_url,
    (product as any).hover_image_url,
    (product as any).image_3,
    (product as any).image_4,
    (product as any).image_5,
    (product as any).image_6,
    (product as any).image_7,
    (product as any).image_8,
  ];

  // оставляем только непустые пути
  const imageUrls: string[] = imageFields
    .filter((img) => img && img.trim() !== "")
    .map((img) => getImageUrl(img));

  // если картинок нет — подставляем fallback
  if (imageUrls.length === 0) {
    imageUrls.push(getImageUrl(fallbackImage));
  }

  return {
    props: {
      product,
      reviews,
      similarProducts: similarProducts ?? [],
      imageUrls,
    },
  };
};
