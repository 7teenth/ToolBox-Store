import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { getImageUrl } from "../lib/getImageUrl";

export const Footer: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      const url = await getImageUrl("logos/logo.png");
      setLogoUrl(url || (await getImageUrl("defaults/default-category.png")));
    };
    fetchLogo();
  }, []);

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:justify-between gap-8">
        {/* Логотип і опис */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="ToolBox"
              className="h-12 w-12 mb-2 rounded-full"
            />
          )}
          <p className="text-sm md:text-base max-w-xs">
            ToolBox Store — всі необхідні інструменти для вашого дому та роботи.
            Якість і надійність у кожному товарі.
          </p>
        </div>

        {/* Посилання на сторінки / категорії */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <h3 className="font-semibold mb-2">Меню</h3>
          <Link
            href="/catalog"
            className="hover:text-amber-400 transition-colors"
          >
            Каталог
          </Link>
          <Link
            href="/compare"
            className="hover:text-amber-400 transition-colors"
          >
            Порівняння
          </Link>
          <Link
            href="/contact"
            className="hover:text-amber-400 transition-colors"
          >
            Контакти
          </Link>
          <Link
            href="/about"
            className="hover:text-amber-400 transition-colors"
          >
            Про нас
          </Link>
        </div>

        {/* Соцмережі */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2">
          <h3 className="font-semibold mb-2">Слідкуйте за нами</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-400 transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Нижній рядок */}
      <div className="border-t border-white/10 mt-8 pt-4 text-center text-sm text-gray-300">
        &copy; 2025 ToolBox Store. Всі права захищені.
      </div>
    </footer>
  );
};
