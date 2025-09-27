import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export type SortOption =
  | "popular"
  | "priceAsc"
  | "priceDesc"
  | "brandAsc"
  | "brandDesc";

interface Props {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const options: { label: string; value: SortOption }[] = [
  { label: "Популярні", value: "popular" },
  { label: "Ціна ↑", value: "priceAsc" },
  { label: "Ціна ↓", value: "priceDesc" },
  { label: "Бренд A–Z", value: "brandAsc" },
  { label: "Бренд Z–A", value: "brandDesc" },
];

const SortDropdown = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? "Сортування";

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition text-sm font-medium text-gray-700"
      >
        {selectedLabel}
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden animate-fade-in"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition ${
                  value === opt.value
                    ? "bg-blue-100 text-blue-800 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
