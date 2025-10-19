import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";
import SidebarFilter from "@/components/SidebarFilter";
import SortDropdown, { SortOption } from "@/components/SortDropdown";
import { ProductCard } from "@/components/ProductCard";

interface ToolType {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

const ToolTypePage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [toolType, setToolType] = useState<ToolType | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [toolTypes, setToolTypes] = useState<ToolType[]>([]);
  const [selectedToolTypes, setSelectedToolTypes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("popular");

  const fetchToolType = useCallback(async (slug: string) => {
    try {
      const { data: tt } = await supabase
        .from("tool_types")
        .select("id,name,slug,image_url,subcategory_id")
        .eq("slug", slug)
        .single();

      if (!tt) return;
      setToolType(tt);

      // Подкатегория
      const { data: sub } = await supabase
        .from("subcategories")
        .select("id,name,slug,category_id")
        .eq("id", tt.subcategory_id)
        .single();
      if (sub) setSubcategory(sub);

      // Категория
      if (sub?.category_id) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id,name")
          .eq("id", sub.category_id)
          .single();
        if (cat) setCategory(cat);
      }
    } catch (e) {
      console.error("Error fetching tool type:", e);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!toolType || !subcategory) return;
    setLoadingProducts(true);
    try {
      let builder = supabase
        .from("products")
        .select(
          `id,name,description,short_description,price,brand,image_url,hover_image_url,subcategory_id,rating,power_type,stock,status`
        )
        .eq("subcategory_id", subcategory.id)
        .eq("tool_type_id", toolType.id);

      // фильтр брендов
      if (selectedBrands.length > 0)
        builder = builder.in("brand", selectedBrands);

      // сортировка
      if (sortOption === "priceAsc")
        builder = builder.order("price", { ascending: true });
      else if (sortOption === "priceDesc")
        builder = builder.order("price", { ascending: false });
      else builder = builder.order("created_at", { ascending: false });

      const { data: raw, error } = await builder;
      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        return;
      }

      const mapped: Product[] = (raw || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        short_description: p.short_description || "",
        price: p.price ?? 0,
        brand: p.brand || "",
        image_url: p.image_url || null,
        hover_image_url: p.hover_image_url || null,
        subcategory_id: p.subcategory_id,
        stock: p.stock ?? null,
        status:
          typeof p.stock === "number"
            ? p.stock > 0
              ? "В наявності"
              : "Не в наявності"
            : p.status ?? "В наявності",
        rating: p.rating ?? 0,
        power_type: p.power_type ?? undefined,
      }));

      setProducts(mapped);

      // бренды
      const brandSet = Array.from(new Set(mapped.map((p) => p.brand))).filter(
        (b): b is string => Boolean(b)
      );
      setBrands(brandSet);
    } catch (e) {
      console.error("fetchProducts error:", e);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [toolType, subcategory, selectedBrands, sortOption]);

  useEffect(() => {
    if (slug) fetchToolType(slug as string);
  }, [slug, fetchToolType]);

  useEffect(() => {
    if (toolType && subcategory) fetchProducts();
  }, [toolType, subcategory, fetchProducts]);

  if (!toolType || !subcategory || !category)
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-600">
          <p>Завантаження інструменту...</p>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">{toolType.name}</h1>
        <div className="flex gap-6">
          <SidebarFilter
            subcategories={[]}
            brands={brands}
            availableBrands={brands}
            selectedBrands={selectedBrands}
            onBrandToggle={(b) =>
              setSelectedBrands((prev) =>
                prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
              )
            }
            toolTypes={[]}
            availableToolTypes={[]}
            selectedToolTypes={[]}
            onToolTypeToggle={() => {}}
            activeSubcategory={subcategory.id}
            priceMin={null}
            priceMax={null}
            allPrices={[]}
            onSubcategorySelect={() => {}}
            onPriceMinChange={() => {}}
            onPriceMaxChange={() => {}}
          />
          <div className="flex-1">
            <SortDropdown value={sortOption} onChange={setSortOption} />
            {loadingProducts ? (
              <div className="text-center py-12 text-gray-600">
                Завантаження товарів...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                Товари не знайдено
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} isPopular={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ToolTypePage;
