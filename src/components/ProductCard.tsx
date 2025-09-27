import React, { useState } from "react";
import { Product } from "../types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  isPopular?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isPopular,
}) => {
  const stock = Number(product.stock);

  const defaultImage = product.image_url
    ? `/images/${product.image_url.replace(/^\/+/, "")}`
    : "/images/default-product.png";
  const hoverImage = product.image_hover
    ? `/images/${product.image_hover.replace(/^\/+/, "")}`
    : defaultImage;

  const [currentImage, setCurrentImage] = useState(defaultImage);
  const [fade, setFade] = useState(false);

  const handleMouseEnter = () => {
    setFade(true);
    setTimeout(() => setCurrentImage(hoverImage), 150);
    setTimeout(() => setFade(false), 300);
  };

  const handleMouseLeave = () => {
    setFade(true);
    setTimeout(() => setCurrentImage(defaultImage), 150);
    setTimeout(() => setFade(false), 300);
  };

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

  let availabilityText = "";
  let availabilityColor = "";
  if (stock > 5) {
    availabilityText = "В наличии";
    availabilityColor = "text-green-600";
  } else if (stock > 0) {
    availabilityText = "Мало на складе";
    availabilityColor = "text-yellow-500";
  } else {
    availabilityText = "Нет в наличии";
    availabilityColor = "text-red-600";
  }

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform flex flex-col cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ссылка на страницу товара оборачивает верхнюю часть карточки */}
      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative">
          <img
            src={currentImage}
            alt={product.name}
            className={`w-full h-48 object-cover transition-opacity duration-300 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          />
          {isPopular && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              Популярный
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <div className="flex mt-1">{stars}</div>
            <p className={`mt-1 font-medium ${availabilityColor}`}>
              {availabilityText}
            </p>
            <span className="font-bold text-green-600 mt-2 block">
              ${product.price}
            </span>
          </div>
        </div>
      </Link>

      {/* Кнопка "В корзину" отдельно */}
      <div className="p-4 pt-0">
        <button
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors ${
            stock === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={stock === 0}
        >
          В корзину
        </button>
      </div>
    </div>
  );
};
