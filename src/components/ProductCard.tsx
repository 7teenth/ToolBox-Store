import React, { useState } from "react";
import Link from "next/link";
import { Product } from "../types/product";
import { getImageUrl } from "../lib/getImageUrl";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import { toast } from "react-hot-toast";
import { RatingStars } from "./RatingStars";

interface ProductCardProps {
  product: Product;
  isPopular?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isPopular,
}) => {
  // Determine availability: prefer numeric `stock` when present, otherwise fall back to `status` string.
  const inStock =
    (typeof product.stock === "number" ? product.stock > 0 : undefined) ??
    (product.status || "").trim().toLowerCase() === "в наявності";

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

  const normalize = (str?: string | null) => (str || "").trim().toLowerCase();

  const currentType = normalize(product.tool_types?.name);
  const comparedType = normalize(comparedItems[0]?.tool_types?.name);

  const isCompatible =
    comparedItems.length === 0 ||
    (!!currentType && !!comparedType && currentType === comparedType);

  const handleMouseEnter = () => setCurrentImage(hoverImage);
  const handleMouseLeave = () => setCurrentImage(defaultImage);

  const handleAddToCart = () => {
    if (inStock) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        quantity: 1,
        image: defaultImage,
      });
      toast.success("Додано до кошика!");
    } else {
      toast.error("Товар відсутній на складі");
    }
  };

  const handleCompare = () => {
    if (!currentType) {
      toast.error("Неможливо порівняти: товар без типу інструменту");
      return;
    }

    if (isCompatible) {
      const statusDefined =
        typeof product.status === "string" && product.status.trim() !== "";
      const inStock = statusDefined
        ? product.status.trim().toLowerCase() === "в наявності"
        : typeof product.stock === "number"
        ? product.stock > 0
        : false;
      toast.error(
        `Неможливо порівняти: тип "${product.tool_types?.name}" не збігається з "${comparedItems[0]?.tool_types?.name}"`
      );
    }
  };

  const rating = product.rating ?? 0;

  const availability = inStock
    ? { text: "В наявності", color: "text-green-600" }
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
            !inStock ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!inStock}
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
