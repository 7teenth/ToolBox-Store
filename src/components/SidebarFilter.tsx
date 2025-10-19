import React, { useMemo, useState } from "react";
import { Subcategory } from "@/types/subcategory";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface Props {
  subcategories: Subcategory[];
  brands: string[];
  availableBrands: string[];
  selectedBrands: string[];
  brandCounts?: Record<string, number>;
  toolTypes: { id: string; name: string }[];
  availableToolTypes: string[];
  selectedToolTypes: string[];
  toolTypeCounts?: Record<string, number>;
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
  className?: string;
}

const SidebarFilter: React.FC<Props> = ({
  subcategories,
  brands,
  availableBrands,
  selectedBrands,
  brandCounts,
  toolTypes,
  availableToolTypes,
  selectedToolTypes,
  toolTypeCounts,
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
  className,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    toolTypes: true,
    brands: true,
    subcats: false,
    price: true,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleSection = (key: string) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  const closeDrawer = () => setDrawerOpen(false);

  const sliderMin = useMemo(
    () => (allPrices.length ? Math.min(...allPrices) : 0),
    [allPrices]
  );
  const sliderMax = useMemo(
    () => (allPrices.length ? Math.max(...allPrices) : 10000),
    [allPrices]
  );
  const formatter = useMemo(() => new Intl.NumberFormat("uk-UA"), []);

  const safeMin = Number.isFinite(priceMin ?? sliderMin)
    ? priceMin ?? sliderMin
    : sliderMin;
  const safeMax = Number.isFinite(priceMax ?? sliderMax)
    ? priceMax ?? sliderMax
    : sliderMax;

  const renderMain = () => (
    <>
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

      <div className="flex flex-wrap gap-2">
        {selectedToolTypes.map((t) => (
          <button
            key={`chip-tt-${t}`}
            onClick={() => onToolTypeToggle(t)}
            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
          >
            {toolTypes.find((x) => x.id === t)?.name || t}
            <XMarkIcon className="w-3 h-3" />
          </button>
        ))}
        {selectedBrands.map((b) => (
          <button
            key={`chip-brand-${b}`}
            onClick={() => onBrandToggle(b)}
            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
          >
            {b}
            <XMarkIcon className="w-3 h-3" />
          </button>
        ))}
      </div>

      <div>
        <h3
          onClick={() => toggleSection("toolTypes")}
          className="flex items-center justify-between text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 cursor-pointer"
        >
          <span>Вид інструменту</span>
          <span className="text-sm text-gray-500">{toolTypes.length}</span>
        </h3>
        {openSections.toolTypes && (
          <ul className="mt-3 space-y-2">
            {toolTypes.map((t) => {
              const isAvailable = availableToolTypes.includes(t.id);
              const isSelected = selectedToolTypes.includes(t.id);
              return (
                <li key={t.id}>
                  <label
                    className={`flex items-center gap-3 ${
                      !isAvailable
                        ? "opacity-50 pointer-events-none"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToolTypeToggle(t.id)}
                      className="hidden peer"
                      disabled={!isAvailable}
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded-md flex items-center justify-center ${
                        isSelected
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      <CheckIcon
                        className={`w-4 h-4 text-white ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                      <span>{t.name}</span>
                      {toolTypeCounts && toolTypeCounts[t.id] != null && (
                        <span className="text-xs text-gray-500">
                          ({toolTypeCounts[t.id]})
                        </span>
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        {selectedToolTypes.length > 0 && (
          <button
            onClick={() => selectedToolTypes.forEach(onToolTypeToggle)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            Очистити види
          </button>
        )}
      </div>

      <div>
        <h3
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 cursor-pointer"
        >
          <span>Бренди</span>
          <span className="text-sm text-gray-500">{brands.length}</span>
        </h3>
        {openSections.brands && (
          <ul className="mt-3 space-y-2">
            {brands.map((b) => {
              const isAvailable = availableBrands.includes(b);
              const isSelected = selectedBrands.includes(b);
              return (
                <li key={b}>
                  <label
                    className={`flex items-center gap-3 ${
                      !isAvailable
                        ? "opacity-50 pointer-events-none"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onBrandToggle(b)}
                      className="hidden peer"
                      disabled={!isAvailable}
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded-md flex items-center justify-center ${
                        isSelected
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      <CheckIcon
                        className={`w-4 h-4 text-white ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                      <span>{b}</span>
                      {brandCounts && brandCounts[b] != null && (
                        <span className="text-xs text-gray-500">
                          ({brandCounts[b]})
                        </span>
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        {selectedBrands.length > 0 && (
          <button
            onClick={() => selectedBrands.forEach(onBrandToggle)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            Очистити бренди
          </button>
        )}
      </div>

      {/* power types section removed */}

      {/* subcategories section removed */}

      <div>
        <h3
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 cursor-pointer"
        >
          <span>Ціна, грн</span>
          <span className="text-sm text-gray-500">
            {allPrices.length
              ? `${Math.min(...allPrices)}–${Math.max(...allPrices)}`
              : "—"}
          </span>
        </h3>
        {openSections.price && (
          <>
            <div className="flex items-center gap-3 mt-4">
              <input
                type="number"
                min={sliderMin}
                max={sliderMax}
                step={100}
                value={safeMin}
                onChange={(e) =>
                  onPriceMinChange(
                    isNaN(+e.target.value) ? null : +e.target.value
                  )
                }
                className="w-28 border rounded-lg px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                min={sliderMin}
                max={sliderMax}
                step={100}
                value={safeMax}
                onChange={(e) =>
                  onPriceMaxChange(
                    isNaN(+e.target.value) ? null : +e.target.value
                  )
                }
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
          </>
        )}
      </div>
    </>
  );

  return (
    <aside
      className={`space-y-8 bg-white p-5 rounded-2xl shadow-md border border-gray-100 ${
        className || ""
      }`}
    >
      {/* Mobile toggle */}
      <div className="lg:hidden mb-2">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-full bg-white border rounded-lg px-3 py-2 text-sm font-medium shadow-sm flex items-center justify-between"
        >
          Фільтри
          <span className="text-xs text-gray-500">
            {selectedBrands.length + selectedToolTypes.length} applied
          </span>
        </button>
      </div>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
          <div className="absolute right-0 top-0 h-full w-4/5 bg-white p-5 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Фільтри</h3>
              <button
                onClick={closeDrawer}
                className="p-2 rounded hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {renderMain()}
          </div>
        </div>
      )}
      {renderMain()}
    </aside>
  );
};

export default SidebarFilter;
