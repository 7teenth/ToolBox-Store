import { Subcategory } from "@/types/subcategory";
import { CheckIcon } from "@heroicons/react/24/solid";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useMemo } from "react";

interface Props {
  subcategories: Subcategory[];
  brands: string[];
  availableBrands: string[];
  selectedBrands: string[];
  toolTypes: { id: string; name: string }[];
  availableToolTypes: string[];
  selectedToolTypes: string[];
  activeSubcategory: string | null;
  priceMin: number | null;
  priceMax: number | null;
  allPrices: number[];
  onSubcategorySelect: (id: string | null) => void;
  onBrandToggle: (brand: string) => void;
  onToolTypeToggle: (type: string) => void;
  onPriceMinChange: (value: number | null) => void;
  onPriceMaxChange: (value: number | null) => void;
  onResetFilters?: () => void;
}

const SidebarFilter = ({
  subcategories,
  brands,
  availableBrands,
  selectedBrands,
  toolTypes,
  availableToolTypes,
  selectedToolTypes,
  activeSubcategory,
  priceMin,
  priceMax,
  allPrices,
  onSubcategorySelect,
  onBrandToggle,
  onToolTypeToggle,
  onPriceMinChange,
  onPriceMaxChange,
  onResetFilters,
}: Props) => {
  const sliderMin = useMemo(() => {
    return allPrices.length ? Math.min(...allPrices) : 0;
  }, [allPrices]);

  const sliderMax = useMemo(() => {
    return allPrices.length ? Math.max(...allPrices) : 10000;
  }, [allPrices]);

  const formatter = useMemo(() => new Intl.NumberFormat("uk-UA"), []);

  const safeMin = Number.isFinite(priceMin ?? sliderMin)
    ? priceMin ?? sliderMin
    : sliderMin;
  const safeMax = Number.isFinite(priceMax ?? sliderMax)
    ? priceMax ?? sliderMax
    : sliderMax;

  return (
    <aside className="space-y-8 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
      {onResetFilters && (
        <div className="flex justify-end">
          <button
            onClick={onResetFilters}
            className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition"
          >
            ✕ Очистити всі фільтри
          </button>
        </div>
      )}

      {/* Вид інструменту */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Вид інструменту
        </h2>
        <ul className="mt-3 space-y-2">
          {toolTypes.map((type) => {
            const isAvailable = availableToolTypes.includes(type.id);
            const isSelected = selectedToolTypes.includes(type.id);

            return (
              <li key={type.id}>
                <label
                  className={`flex items-center gap-3 group ${
                    !isAvailable
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToolTypeToggle(type.id)}
                    className="hidden peer"
                    disabled={!isAvailable}
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    <CheckIcon
                      className={`w-4 h-4 text-white transition duration-200 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition">
                    {type.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {selectedToolTypes.length > 0 && (
          <button
            onClick={() => {
              selectedToolTypes.forEach((id) => onToolTypeToggle(id));
            }}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            Очистити види
          </button>
        )}
      </div>

      {/* Бренди */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Бренди
        </h2>
        <ul className="mt-3 space-y-2">
          {brands.map((brand) => {
            const isAvailable = availableBrands.includes(brand);
            const isSelected = selectedBrands.includes(brand);

            return (
              <li key={brand}>
                <label
                  className={`flex items-center gap-3 group ${
                    !isAvailable
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onBrandToggle(brand)}
                    className="hidden peer"
                    disabled={!isAvailable}
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    <CheckIcon
                      className={`w-4 h-4 text-white transition duration-200 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition">
                    {brand}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {selectedBrands.length > 0 && (
          <button
            onClick={() => {
              selectedBrands.forEach(onBrandToggle);
            }}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            Очистити бренди
          </button>
        )}
      </div>

      {/* Тип живлення */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Тип живлення
        </h2>
        <ul className="space-y-2 mt-3">
          {subcategories.map((sub) => (
            <li key={sub.id}>
              <button
                onClick={() => onSubcategorySelect(sub.id)}
                className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                  activeSubcategory === sub.id
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {sub.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Ціна */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Ціна, грн
        </h2>

        <div className="flex items-center gap-3 mt-4">
          <input
            type="number"
            min={sliderMin}
            max={sliderMax}
            step={100}
            value={safeMin}
            onChange={(e) => {
              const val = Number(e.target.value);
              onPriceMinChange(isNaN(val) ? null : val);
            }}
            className="w-28 border rounded-lg px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">—</span>
          <input
            type="number"
            min={sliderMin}
            max={sliderMax}
            step={100}
            value={safeMax}
            onChange={(e) => {
              const val = Number(e.target.value);
              onPriceMaxChange(isNaN(val) ? null : val);
            }}
            className="w-28 border rounded-lg px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-5">
          <Slider
            range
            min={sliderMin}
            max={sliderMax}
            step={100}
            value={[safeMin, safeMax]}
            onChange={(value) => {
              if (Array.isArray(value)) {
                const [min, max] = value;
                onPriceMinChange(min);
                onPriceMaxChange(max);
              }
            }}
          />

          <div className="flex justify-between mt-3 text-sm text-gray-600 font-medium">
            <span>{formatter.format(safeMin)} грн</span>
            <span>{formatter.format(safeMax)} грн</span>
          </div>

          {(priceMin !== null || priceMax !== null) && (
            <button
              onClick={() => {
                onPriceMinChange(null);
                onPriceMaxChange(null);
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
            >
              Очистити ціну
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilter;
