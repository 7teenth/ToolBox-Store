import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:justify-between gap-8">
        {/* Логотип и описание */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src="/images/logo.png"
            alt="ToolBox"
            className="h-12 w-12 mb-2 rounded-full"
          />
          <p className="text-sm md:text-base max-w-xs">
            ToolBox Store — все необходимые инструменты для вашего дома и
            работы. Качество и надежность в каждом товаре.
          </p>
        </div>

        {/* Ссылки на страницы / категории */}
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
            Сравнение
          </Link>
          <Link
            href="/contact"
            className="hover:text-amber-400 transition-colors"
          >
            Контакты
          </Link>
          <Link
            href="/about"
            className="hover:text-amber-400 transition-colors"
          >
            О нас
          </Link>
        </div>

        {/* Соцсети */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2">
          <h3 className="font-semibold mb-2">Следите за нами</h3>
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

      {/* Нижняя полоска */}
      <div className="border-t border-white/10 mt-8 pt-4 text-center text-sm text-gray-300">
        &copy; 2025 ToolBox Store. Все права защищены.
      </div>
    </footer>
  );
};
