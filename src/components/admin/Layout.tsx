import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeIcon,
  TagIcon,
  Squares2X2Icon,
  WrenchScrewdriverIcon,
  CubeIcon,
  StarIcon,
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "Панель", href: "/admin", icon: HomeIcon },
  { label: "Категорії", href: "/admin/categories", icon: TagIcon },
  { label: "Підкатегорії", href: "/admin/subcategories", icon: Squares2X2Icon },
  {
    label: "Типи інструментів",
    href: "/admin/tool_types",
    icon: WrenchScrewdriverIcon,
  },
  { label: "Товари", href: "/admin/products", icon: CubeIcon },
  { label: "Бренди", href: "/admin/brands", icon: TagIcon }, // новая вкладка
  { label: "Відгуки", href: "/admin/reviews", icon: StarIcon },
  { label: "Замовлення", href: "/admin/orders", icon: ShoppingCartIcon },
  { label: "Користувачі", href: "/admin/users", icon: UserIcon },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  // Зчитуємо стан панелі з localStorage одразу, без миготіння
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarOpen");
      return saved ? saved === "true" : true;
    }
    return true;
  });

  // Зберігаємо зміни в localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarOpen", sidebarOpen.toString());
    }
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("admin-auth"); // видаляємо авторизацію
    router.reload(); // перезавантажуємо сторінку, щоб показати форму входу
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Бічна панель */}
      <aside
        className={`bg-gray-900 text-white flex flex-col p-4 transition-all duration-300 ease-in-out shadow-lg ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <h2 className="text-2xl font-extrabold tracking-tight whitespace-nowrap">
              🛠 Адмін панель
            </h2>
          )}
          <button
            className="text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Навігація */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900/20">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center rounded-lg p-2 transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                } ${sidebarOpen ? "gap-3" : "justify-center"}`}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Кнопка виходу */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-2 rounded-lg hover:bg-red-600 transition-colors text-red-100 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          {sidebarOpen && <span className="text-sm font-medium">Вийти</span>}
        </button>
      </aside>

      {/* Основний контент */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
};
