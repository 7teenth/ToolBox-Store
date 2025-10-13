import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "../types/product";
import { getImageUrl } from "../lib/getImageUrl";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import { toast } from "react-hot-toast";
import { RatingStars } from "./RatingStars";

export const ProductCard: React.FC<{
  product: Product;
  isPopular?: boolean;
}> = ({ product, isPopular }) => {
  const stock = Number(product.stock ?? 0);

  const defaultImage = getImageUrl(
    product.image_url || "defaults/default-product.png"
  );
  const hoverImage = getImageUrl(
    product.hover_image_url ||
      product.image_url ||
      "defaults/default-product.png"
  );

  const [currentImage, setCurrentImage] = useState(defaultImage);

  const { addItem } = useCart();
  const { addItem: addToCompare, items: comparedItems } = useCompare();

  const normalize = (str: string | undefined | null) =>
    (str || "").trim().toLowerCase();

  const currentType = normalize(product.tool_types?.name);
  const comparedType = normalize(comparedItems[0]?.tool_types?.name);

  const isCompatible =
    comparedItems.length === 0 ||
    (!!currentType && !!comparedType && currentType === comparedType);

  useEffect(() => {
    console.log("✅ ProductCard rendered:", product.name);
    console.log("🖼 defaultImage:", defaultImage);
    console.log("🖼 hoverImage:", hoverImage);
  }, []);

  useEffect(() => {
    console.log("🖼 currentImage changed:", currentImage);
  }, [currentImage]);

  const handleMouseEnter = () => {
    setCurrentImage(hoverImage);
  };

  const handleMouseLeave = () => {
    setCurrentImage(defaultImage);
  };

  const handleAddToCart = () => {
    if (stock > 0) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        quantity: 1,
        image: defaultImage,
      });
      toast.success("Додано до кошика!");
    }
  };

  const handleCompare = () => {
    if (!currentType) {
      toast.error("Неможливо порівняти: товар без типу інструменту");
      return;
    }

    if (isCompatible) {
      addToCompare(product);
      toast.success("Додано до порівняння!");
    } else {
      toast.error(
        `Неможливо порівняти: тип "${product.tool_types?.name}" не збігається з "${comparedItems[0]?.tool_types?.name}"`
      );
    }
  };

  const rating = product.rating ?? 0; // безопасная замена для undefined

  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
      ★
    </span>
  ));

  const availability =
    stock > 5
      ? { text: "В наявності", color: "text-green-600" }
      : stock > 0
      ? { text: "Мало на складі", color: "text-yellow-500" }
      : { text: "Немає в наявності", color: "text-red-600" };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/product/${String(product.id)}`}
        className="flex-1 flex flex-col"
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <img
            src={defaultImage}
            alt={product.name}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
              currentImage === defaultImage ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              e.currentTarget.src = getImageUrl("defaults/default-product.png");
            }}
          />
          <img
            src={hoverImage}
            alt={product.name}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
              currentImage === hoverImage ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              e.currentTarget.src = getImageUrl("defaults/default-product.png");
            }}
          />
          {isPopular && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              Популярний
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col justify-between h-full">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={rating} />
            {rating > 0 && (
              <span className="text-sm text-gray-600 font-medium">
                {rating.toFixed(1)} / 5
              </span>
            )}
          </div>
          <p className={`mt-1 font-medium ${availability.color}`}>
            {availability.text}
          </p>
          <span className="font-bold text-green-600 mt-2 block">
            {product.price} грн
          </span>
        </div>
      </Link>

      <div className="p-4 pt-0 flex justify-between items-center gap-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors ${
            stock === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={stock === 0}
        >
          До кошика
        </button>

        <button
          onClick={handleCompare}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition"
          title="Додати до порівняння"
          aria-label="Додати до порівняння"
        >
          ⚖️
        </button>
      </div>
    </div>
  );
};
