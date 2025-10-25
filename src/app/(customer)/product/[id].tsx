// pages/product/[id].tsx
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Layout } from "@/components/Layout";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";


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
}: any) {

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


  return (
    <Layout>
      {/* <Head>
        <title>{product.name} – ToolBox Store</title>
        <meta
          name="description"
          content={
            product.short_description?.trim() ||
            `Купити ${product.name} за ${product.price} грн.`
          }
        />
        <meta property="og:image" content={selectedImage} />
      </Head> */}

      {/* Контент */}
      <div className="max-w-6xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-10">
        {/* Галерея */}
        <div className="flex-1 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity:1 }}
            className="relative w-full h-96 bg-gray-50 rounded-xl overflow-hidden"
          >
            {/* <Image
              alt={product.name}
              fill
              priority
              className="object-contain"
              onLoad={() => setImgLoaded(true)}
              onError={(e) => ((e.currentTarget as any).src = fallbackImage)}
            /> */}
          </motion.div>

          {/* Мініатюри */}
          <div className="flex gap-2 flex-wrap">
            {/* {imageUrls.map((img, idx) => (
              <button
                key={idx}
                className={`relative w-20 h-20 rounded overflow-hidden border-2 transition-all`}
              >
                <Image
                  src={img}
                  alt={`thumb-${idx}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))} */}
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
              {/* {stars} */}
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
              {/* <span className="font-medium text-gray-800">{displayStock}</span> */}
            </p>

            <div className="mt-5 flex items-center gap-4">
              <button
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-lg font-semibold"
              >
                −
              </button>
              {/* <span className="text-lg">{quantity}</span> */}
              <button
                // onClick={increment}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-lg font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              // disabled={!hasStock}
              // onClick={handleAddToCart}
              className={`flex-1 px-5 py-3 rounded-lg text-lg text-white font-medium transition-colors`}
            >
              У кошик
            </button>
            <button
              className={`flex-1 px-5 py-3 rounded-lg text-lg text-white font-medium transition-colors`}
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
              className={`px-5 py-2 transition-all`}
            >
              {tab === "description"
                ? "Опис"
                : tab === "specs"
                ? "Характеристики"
                : "Відгуки"}
            </button>
          ))}
        </div>

        {/* <AnimatePresence mode="wait">
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
                specsList.length > 0 ? (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specsList.map((s, i) => (
                      <div key={i} className="bg-white p-3 rounded shadow-sm">
                        <dt className="text-sm text-gray-600">{s.label}</dt>
                        <dd className="mt-1 text-sm font-medium text-gray-800">
                          {typeof s.value === "boolean"
                            ? s.value
                              ? "Так"
                              : "Ні"
                            : String(s.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-gray-600">Характеристики відсутні.</p>
                )
              ) : (
                <div className="space-y-8">
                  <ReviewList reviews={reviews} />
                  <ReviewForm productId={product.id} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>

      {/* Схожі товари */}
      <div className="max-w-6xl mx-auto px-4 mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Схожі товари</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {similarProducts.map((prod: any) => (
            <ProductCard
              key={prod.id}
              product={prod}
              isPopular={(prod.sales ?? 0) > 50} // можно любой критерий популярности
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}