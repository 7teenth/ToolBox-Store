import React from "react";
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

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight">
          🛠 Admin Panel
        </h2>
        <nav className="flex flex-col gap-3">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
};
