import React from "react";
import { useCompare } from "@/context/CompareContext";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Compare() {
  const { items: selectedProducts, removeItem, clear } = useCompare();

  const allFeatureKeys = Array.from(
    new Set(selectedProducts.flatMap((p) => Object.keys(p.features || {})))
  ).sort();

  const toolTypes = Array.from(
    new Set(
      selectedProducts.map((p) => p.tool_types?.name?.trim().toLowerCase())
    )
  );

  const isMixedType = toolTypes.length > 1;

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {selectedProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <h2 className="text-3xl font-bold mb-4">
              😕 Немає товарів для порівняння
            </h2>
            <p className="mb-6">
              Додайте товари з каталогу, щоб побачити порівняння.
            </p>
            <a
              href="/catalog"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Перейти до каталогу
            </a>
          </div>
        ) : isMixedType ? (
          <div className="text-center py-20 text-red-600">
            <h2 className="text-2xl font-bold mb-4">
              ⚠️ Неможливо порівняти товари різного типу
            </h2>
            <p className="mb-6">
              Видаліть товари іншого типу, щоб продовжити порівняння.
            </p>
            <button
              onClick={clear}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              🗑️ Очистити порівняння
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                📊 Порівняння товарів
              </h2>
              <button
                onClick={clear}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition flex items-center gap-2"
              >
                🗑️ Очистити порівняння
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Тип інструменту:{" "}
              <strong>{selectedProducts[0].tool_types?.name}</strong>
            </p>

            <div className="overflow-x-auto border rounded-xl shadow-md">
              <table className="min-w-full text-sm text-left">
                <thead className="sticky top-0 bg-white border-b z-10">
                  <tr>
                    <th className="p-3 font-semibold text-gray-600">
                      Характеристика
                    </th>
                    {selectedProducts.map((p) => (
                      <th
                        key={p.id}
                        className="p-3 text-center font-semibold text-gray-700"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <img
                            alt={p.name}
                            className="h-16 w-16 object-cover rounded-md border"
                          />
                          <span className="text-sm font-medium text-center">
                            {p.name}
                          </span>
                          <button
                            onClick={() => removeItem(p.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Видалити
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium text-gray-600">Ціна</td>
                    {selectedProducts.map((p) => (
                      <td
                        key={`price-${p.id}`}
                        className="p-3 text-center text-green-700 font-bold"
                      >
                        {p.price} грн
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium text-gray-600">Рейтинг</td>
                    {selectedProducts.map((p) => (
                      <td
                        key={`rating-${p.id}`}
                        className="p-3 text-center text-yellow-500"
                      >
                        ⭐ {p.rating}
                      </td>
                    ))}
                  </tr>
                  {allFeatureKeys.map((key, i) => (
                    <tr
                      key={key}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-3 font-medium text-gray-600">{key}</td>
                      {selectedProducts.map((p) => (
                        <td
                          key={`${p.id}-${key}`}
                          className="p-3 text-center text-gray-800"
                        >
                          {p.features?.[key] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};
