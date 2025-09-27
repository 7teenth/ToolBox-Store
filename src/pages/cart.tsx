// pages/cart.tsx
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import Link from "next/link";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  discount?: number; // % скидки
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Дрель",
      price: 120,
      quantity: 2,
      image_url: "/images/drills.png",
      discount: 10,
    },
    {
      id: 2,
      name: "Шуруповёрт",
      price: 80,
      quantity: 1,
      image_url: "/images/drivers.png",
    },
  ]);
  const [coupon, setCoupon] = useState("");

  const increment = (id: number) =>
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decrement = (id: number) =>
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );

  const removeItem = (id: number) =>
    setCartItems((items) => items.filter((item) => item.id !== id));

  const total = cartItems.reduce((sum, item) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Корзина</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-700">
            Ваша корзина пуста.{" "}
            <Link href="/catalog" className="text-blue-600 underline">
              Перейти к покупкам
            </Link>
          </p>
        ) : (
          <>
            <div className="grid gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center sm:items-start bg-white p-4 rounded-xl shadow hover:shadow-2xl transition-transform transform hover:-translate-y-1 relative"
                >
                  {item.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                      -{item.discount}%
                    </span>
                  )}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded mb-4 sm:mb-0 sm:mr-4"
                  />
                  <div className="flex-1 flex flex-col justify-between w-full">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-green-600 font-bold mt-1">
                      $
                      {item.discount
                        ? (item.price * (1 - item.discount / 100)).toFixed(2)
                        : item.price}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decrement(item.id)}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        <FaMinus className="text-gray-700" />
                      </button>
                      <span className="px-2 text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        <FaPlus className="text-gray-700" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-2 bg-red-500 rounded hover:bg-red-600 transition"
                      >
                        <FaTrash className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Купон и итог */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow gap-4">
              <input
                type="text"
                placeholder="Введите промокод"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="p-2 border rounded flex-1"
              />
              <span className="text-xl font-bold">
                Итого: ${total.toFixed(2)}
              </span>
              <Link
                href="/checkout"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Оформить заказ
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
