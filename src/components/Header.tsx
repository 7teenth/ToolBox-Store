import React, { useState } from "react";
import Link from "next/link";

const Header: React.FC = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(query)}`;
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-6 md:py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Левая часть: логотип + каталог */}
        <div className="flex items-center justify-start space-x-4 md:space-x-6 mb-4 md:mb-0">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/images/logo.png"
              alt="ToolBox"
              className="h-10 w-10 rounded-full cursor-pointer"
            />
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

        {/* Центр: поиск */}
        <div className="flex-1 mx-auto w-full max-w-md mb-4 md:mb-0">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Искать товар или категорию..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
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

        {/* Правая часть: телефон + сравнение + корзина (только иконки) */}
        <div className="flex items-center justify-end space-x-3">
          <a
            href="tel:+380990817643"
            className="bg-gray-700 hover:bg-gray-600 transition-colors px-4 py-2 rounded-lg font-medium shadow flex items-center justify-center"
          >
            <span className="mr-1">📞</span> +38 (099) 081-76-43
          </a>

          {/* Иконка сравнения */}
          <Link href="/compare">
            <button className="text-white hover:text-gray-300 transition-colors p-2 rounded-full">
              ⚖️
            </button>
          </Link>

          {/* Иконка корзины */}
          <Link href="/cart">
            <button className="text-white hover:text-gray-300 transition-colors p-2 rounded-full">
              🛒
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
