import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/Layout";

interface OrderedItem {
  product_id: string;
  name?: string;
  quantity?: number;
}

interface User {
  id: string;
  full_name: string;
  phone?: string | null;
  phone_clean?: string | null;
  created_at: string;
  ordered_items?: OrderedItem[];
}

const normalizeText = (value: string): string =>
  value.toLowerCase().replace(/\s+/g, "");

const normalizePhone = (value: string): string => value.replace(/\D/g, "");

const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  return (
    <AdminLayout>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">👥 Users</h1>

      <input
        type="text"
        placeholder="🔍 Пошук за ім’ям, телефоном або товаром"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
      />

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Ordered Items</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* {filteredUsers.map((u: User) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {u.full_name}
                </td>
                <td className="px-4 py-3 text-gray-700">{u.phone || "—"}</td>
                <td className="px-4 py-3 text-gray-700">
                  {Array.isArray(u.ordered_items) &&
                  u.ordered_items.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {u.ordered_items.map((item: OrderedItem, idx: number) => (
                        <li key={idx}>
                          {item.name || `Product ${item.product_id}`} ×{" "}
                          {item.quantity || 1}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default UsersAdmin;
