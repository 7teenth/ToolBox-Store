import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getImageUrl } from "../lib/getImageUrl";
import { FiShoppingCart, FiBarChart2 } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";

const Header: React.FC = () => {
  const [query, setQuery] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const { items } = useCart();
  const { items: compareItems } = useCompare();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const compareCount = compareItems.length;

  useEffect(() => {
    const url = getImageUrl("logos/logo.png");
    setLogoUrl(url);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(query)}`;
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-6 md:py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Ліва частина: логотип + каталог */}
        <div className="flex items-center justify-start space-x-4 md:space-x-6 mb-4 md:mb-0">
          <Link href="/" className="flex items-center space-x-3">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="ToolBox"
                className="h-10 w-10 rounded-full cursor-pointer"
              />
            )}
            <h1 className="text-xl font-bold cursor-pointer hover:text-amber-400 transition-colors">
              ToolBox Store
            </h1>
          </Link>

          <Link href="/catalog">
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium shadow">
              Каталог
            </button>
          </Link>
        </div>

        {/* Центр: пошук */}
        <div className="flex-1 mx-auto w-full max-w-md mb-4 md:mb-0">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="search"
              id="search"
              name="search"
              placeholder="Пошук товару або категорії..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label="Пошук"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Права частина: телефон + порівняння + кошик */}
        <div className="flex items-center justify-end space-x-3 relative">
          {/* Телефон */}
          <a
            href="tel:+380990817643"
            className="bg-gray-700 hover:bg-gray-600 transition-colors px-4 py-2 rounded-lg font-medium shadow flex items-center justify-center"
          >
            <span className="mr-1">📞</span>
            <span className="hidden sm:inline">+38 (099) 081-76-43</span>
          </a>

          {/* Порівняння */}
          <Link href="/compare">
            <button
              className="relative p-2 rounded-full hover:bg-gray-700 transition"
              title="Порівняння"
              aria-label="Порівняння"
            >
              <FiBarChart2 className="text-white hover:text-gray-300 h-6 w-6" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {compareCount}
                </span>
              )}
            </button>
          </Link>

          {/* Кошик */}
          <Link href="/cart">
            <button
              className="relative p-2 rounded-full hover:bg-gray-700 transition"
              title="Кошик"
              aria-label="Кошик"
            >
              <FiShoppingCart className="text-white hover:text-gray-300 h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
