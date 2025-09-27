// pages/catalog.tsx
import React, { useState } from "react";
import { Layout } from "../components/Layout";

const categories: Record<string, string[]> = {
  Электроинструменты: ["Дрели", "Перфораторы", "Шлифмашины"],
  "Ручной инструмент": ["Отвертки", "Молотки", "Ключи"],
  "Измерительные инструменты": ["Уровни", "Рулетки", "Штангенциркули"],
  "Садовый инструмент": ["Газонокосилки", "Секаторы", "Лопаты"],
  Расходники: ["Буры", "Диски", "Насадки"],
};

const CatalogPage: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow mt-8">
        <h1 className="text-2xl font-bold mb-6">Каталог категорий</h1>
        {Object.entries(categories).map(([category, subcategories]) => (
          <div key={category} className="mb-4">
            <div
              className="cursor-pointer font-semibold text-lg p-3 bg-gray-200 rounded hover:bg-gray-300 transition-colors flex justify-between items-center"
              onClick={() =>
                setOpenCategory(openCategory === category ? null : category)
              }
            >
              {category}
              <span className="text-xl">
                {openCategory === category ? "−" : "+"}
              </span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openCategory === category ? "max-h-96 mt-2" : "max-h-0"
              }`}
            >
              <ul className="ml-4 space-y-1">
                {subcategories.map((sub) => (
                  <li
                    key={sub}
                    className="cursor-pointer p-2 bg-white rounded hover:bg-gray-200 transition-colors"
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default CatalogPage;
