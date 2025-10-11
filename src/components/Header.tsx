import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getImageUrl } from "../lib/getImageUrl";
import { FiShoppingCart, FiBarChart2 } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import { supabase } from "@/lib/supabaseClient";

interface SearchResult {
  id: string;
  name: string;
  type: "tool_type" | "brand";
}

const Header: React.FC = () => {
  const [query, setQuery] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { items } = useCart();
  const { items: compareItems } = useCompare();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const compareCount = compareItems.length;

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = getImageUrl("logos/logo.png");
    setLogoUrl(url);
  }, []);

  // Закрыть dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Поиск
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);

    if (!q.trim()) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    // Поиск по tool_types
    const { data: toolTypes } = await supabase
      .from("tool_types")
      .select("id, name")
      .ilike("name", `%${q}%`)
      .limit(5);

    // Поиск по брендам в products
    const { data: brands } = await supabase
      .from("products")
      .select("brand")
      .ilike("brand", `%${q}%`)
      .limit(5);

    // Уникальные бренды
    const brandResults: SearchResult[] = Array.from(
      new Map(
        (brands ?? [])
          .filter((b) => b.brand)
          .map((b) => [
            b.brand,
            { id: b.brand!, name: b.brand!, type: "brand" as const },
          ])
      ).values()
    );

    const combined: SearchResult[] = [
      ...(toolTypes?.map((t) => ({
        id: t.id,
        name: t.name,
        type: "tool_type" as const,
      })) ?? []),
      ...brandResults,
    ];

    setResults(combined);
    setDropdownOpen(combined.length > 0);
  };

  const handleSelect = (item: SearchResult) => {
    setQuery("");
    setResults([]);
    setDropdownOpen(false);

    if (item.type === "tool_type") {
      window.location.href = `/catalog?tool_type=${item.id}`;
    } else if (item.type === "brand") {
      window.location.href = `/catalog?brand=${encodeURIComponent(item.name)}`;
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

        {/* Центр: поиск */}
        <div
          className="flex-1 mx-auto w-full max-w-md mb-4 md:mb-0 relative"
          ref={wrapperRef}
        >
          <input
            type="search"
            placeholder="Пошук по типу інструменту або бренду..."
            value={query}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />

          {/* Dropdown */}
          {dropdownOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white text-black rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto z-50">
              {results.some((r) => r.type === "tool_type") && (
                <div className="border-b px-4 py-1 text-gray-500 font-semibold">
                  Типи інструментів
                </div>
              )}
              {results
                .filter((r) => r.type === "tool_type")
                .map((item) => (
                  <div
                    key={`tool_type-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-500">Тип</span>
                  </div>
                ))}

              {results.some((r) => r.type === "brand") && (
                <div className="border-b px-4 py-1 text-gray-500 font-semibold">
                  Бренди
                </div>
              )}
              {results
                .filter((r) => r.type === "brand")
                .map((item) => (
                  <div
                    key={`brand-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-500">Бренд</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Права частина: телефон + порівняння + кошик */}
        <div className="flex items-center justify-end space-x-3 relative">
          <a
            href="tel:+380990817643"
            className="bg-gray-700 hover:bg-gray-600 transition-colors px-4 py-2 rounded-lg font-medium shadow flex items-center justify-center"
          >
            <span className="mr-1">📞</span>
            <span className="hidden sm:inline">+38 (099) 081-76-43</span>
          </a>

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
