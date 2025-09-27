import { createContext, useContext, useState } from "react";
import { Product } from "@/types/product";
import { toast } from "react-hot-toast";

interface CompareContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

export const CompareProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<Product[]>([]);

  const normalize = (str: string | undefined | null) =>
    (str || "").trim().toLowerCase();

  const addItem = (product: Product) => {
    const currentType = normalize(product.tool_types?.name);
    const comparedType = normalize(items[0]?.tool_types?.name);

    if (!currentType) {
      toast.error("Неможливо порівняти: товар без типу інструменту");
      return;
    }

    if (items.length === 0 || currentType === comparedType) {
      setItems((prev) =>
        prev.find((p) => p.id === product.id) ? prev : [...prev, product]
      );
    } else {
      toast.error("Неможливо порівняти: різний тип інструменту");
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clear = () => setItems([]);

  return (
    <CompareContext.Provider value={{ items, addItem, removeItem, clear }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context)
    throw new Error("useCompare must be used within CompareProvider");
  return context;
};
