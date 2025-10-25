import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/Layout";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";

import {
  UserIcon,
  CubeIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    reviews: 0,
  });


  const cards = [
    {
      label: "Users",
      value: stats.users,
      icon: <UserIcon className="h-6 w-6 text-blue-600" />,
      gradient: "from-blue-100 to-blue-300",
    },
    {
      label: "Products",
      value: stats.products,
      icon: <CubeIcon className="h-6 w-6 text-green-600" />,
      gradient: "from-green-100 to-green-300",
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: <ShoppingCartIcon className="h-6 w-6 text-purple-600" />,
      gradient: "from-purple-100 to-purple-300",
    },
    {
      label: "Reviews",
      value: stats.reviews,
      icon: <StarIcon className="h-6 w-6 text-yellow-500" />,
      gradient: "from-yellow-100 to-yellow-300",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
        📊 Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon, gradient }) => (
          <div
            key={label}
            className={`p-6 rounded-xl shadow-md bg-gradient-to-br ${gradient} transition-transform transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-700">
                {label}
              </span>
              {icon}
            </div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default function Admin() {
  return (
    <AdminAuthWrapper>
      <AdminDashboard />
    </AdminAuthWrapper>
  );
}
