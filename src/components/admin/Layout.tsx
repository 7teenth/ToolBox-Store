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
  { label: "Dashboard", href: "/admin", icon: HomeIcon },
  { label: "Categories", href: "/admin/categories", icon: TagIcon },
  {
    label: "Subcategories",
    href: "/admin/subcategories",
    icon: Squares2X2Icon,
  },
  {
    label: "Tool Types",
    href: "/admin/tool_types",
    icon: WrenchScrewdriverIcon,
  },
  { label: "Products", href: "/admin/products", icon: CubeIcon },
  { label: "Reviews", href: "/admin/reviews", icon: StarIcon },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
  { label: "Users", href: "/admin/users", icon: UserIcon },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) setSidebarOpen(saved === "true");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("sidebarOpen", sidebarOpen.toString());
  }, [sidebarOpen, mounted]);

  const handleLogout = () => {
    localStorage.removeItem("admin-auth"); // удаляем авторизацию
    router.reload(); // перезагружаем страницу, чтобы показать форму логина
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white flex flex-col p-4 ${
          mounted ? "transition-all duration-300" : ""
        } ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <h2 className="text-2xl font-extrabold tracking-tight">
              🛠 Admin Panel
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

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center rounded-lg p-2 hover:bg-gray-800 ${
                  isActive ? "bg-gray-700 text-white" : "text-gray-300"
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

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-2 rounded-lg hover:bg-red-600 transition-colors text-red-100 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
};
