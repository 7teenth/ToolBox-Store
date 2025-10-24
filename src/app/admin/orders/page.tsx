import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/Layout";
import { TrashIcon } from "@heroicons/react/24/outline";

interface OrderItem {
  quantity: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  name: string;
  surname: string;
  phone: string;
  city: string;
  warehouse: string;
  comment: string | null;
  status: string;
  created_at: string;
  user_id: string | null;
  order_items?: OrderItem[];
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">📦 Orders</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">City / Warehouse</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {order.name} {order.surname}
                </td>
                <td className="px-4 py-3 text-gray-700">{order.phone}</td>
                <td className="px-4 py-3 text-gray-700">
                  {order.city} / {order.warehouse}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {order.order_items?.length ? (
                    <ul className="list-disc pl-4">
                      {order.order_items.map((item, idx) => (
                        <li key={idx}>
                          {item.product?.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors outline-none shadow-sm
    ${
      order.status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : order.status === "shipped"
        ? "bg-blue-100 text-blue-800"
        : order.status === "delivered"
        ? "bg-green-100 text-green-800"
        : order.status === "cancelled"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800"
    }
  `}
                  >
                    <option value="pending">Очікує</option>
                    <option value="shipped">Відправлено</option>
                    <option value="delivered">Доставлено</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};