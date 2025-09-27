import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Subcategory } from "@/types/subcategory";

import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import SidebarFilter from "@/components/SidebarFilter";
import SortDropdown from "@/components/SortDropdown";
import { ProductCard } from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

const pageSize = 12;

const CatalogByCategory = () => {
  const router = useRouter();
  const categoryId =
    typeof router.query.id === "string" ? router.query.id : null;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [toolTypes, setToolTypes] = useState<{ id: string; name: string }[]>(
    []
  );
  const [availableToolTypes, setAvailableToolTypes] = useState<string[]>([]);
  const [selectedToolTypes, setSelectedToolTypes] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null
  );
  const [sort, setSort] = useState<
    "popular" | "priceAsc" | "priceDesc" | "brandAsc" | "brandDesc"
  >("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [allPrices, setAllPrices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .then(({ data }) => setCategories(data ?? []));

    supabase
      .from("products")
      .select("brand, price, tool_type_id")
      .then(({ data }) => {
        if (!data) return;

        const brandList = Array.from(
          new Set(
            data
              .map((item) => item.brand)
              .filter(
                (b): b is string => typeof b === "string" && b.trim() !== ""
              )
          )
        );
        setBrands(brandList);

        const prices = data
          .map((p) => p.price)
          .filter((p): p is number => typeof p === "number");
        setAllPrices(prices);
      });

    supabase
      .from("tool_types")
      .select("id, name")
      .then(({ data, error }) => {
        if (error) {
          console.error("Ошибка загрузки типов инструмента:", error.message);
          return;
        }
        const types = (data ?? []).map((type) => ({
          id: type.id,
          name: type.name,
        }));
        setToolTypes(types);
      });
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .then(({ data }) => {
        setSubcategories(data ?? []);
      });
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;

    let query = supabase.from("products").select("*", { count: "exact" });

    query = query.eq("category_id", categoryId);
    if (activeSubcategory)
      query = query.eq("subcategory_id", activeSubcategory);
    if (selectedBrands.length > 0) query = query.in("brand", selectedBrands);
    if (selectedToolTypes.length > 0)
      query = query.in("tool_type_id", selectedToolTypes);
    if (priceMin !== null) query = query.gte("price", priceMin);
    if (priceMax !== null) query = query.lte("price", priceMax);

    query.then(({ count }) => {
      setTotalCount(count ?? 0);
    });
  }, [
    categoryId,
    activeSubcategory,
    selectedBrands,
    selectedToolTypes,
    priceMin,
    priceMax,
  ]);

  useEffect(() => {
    if (!categoryId) return;

    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from("products").select("*");

    console.log("🔍 Запрос к Supabase:");
    console.log("category_id:", categoryId);
    console.log("subcategory_id:", activeSubcategory);
    console.log("selectedBrands:", selectedBrands);
    console.log("selectedToolTypes:", selectedToolTypes);
    console.log("priceMin:", priceMin);
    console.log("priceMax:", priceMax);
    console.log("sort:", sort);
    console.log("currentPage:", currentPage);
    console.log("range:", from, to);

    query = query.eq("category_id", categoryId);
    if (activeSubcategory)
      query = query.eq("subcategory_id", activeSubcategory);
    if (selectedBrands.length > 0) query = query.in("brand", selectedBrands);
    if (selectedToolTypes.length > 0)
      query = query.in("tool_type_id", selectedToolTypes);
    if (priceMin !== null) query = query.gte("price", priceMin);
    if (priceMax !== null) query = query.lte("price", priceMax);

    if (sort === "priceAsc") query = query.order("price", { ascending: true });
    if (sort === "priceDesc")
      query = query.order("price", { ascending: false });
    if (sort === "brandAsc") query = query.order("brand", { ascending: true });
    if (sort === "brandDesc")
      query = query.order("brand", { ascending: false });
    if (sort === "popular")
      query = query.order("created_at", { ascending: false });

    setIsLoading(true);
    query.range(from, to).then(({ data, error }) => {
      setIsLoading(false);

      if (error) {
        console.error("❌ Ошибка загрузки товаров:", error);
      } else {
        console.log("✅ Загружено товаров:", data?.length ?? 0);
        console.log("📦 Товары:", data);
      }

      setProducts(data ?? []);

      const available = Array.from(
        new Set(
          (data ?? [])
            .map((p) => p.brand)
            .filter((b): b is string => typeof b === "string")
        )
      );
      setAvailableBrands(available);

      const availableTypes = Array.from(
        new Set(
          (data ?? [])
            .map((p) => p.tool_type_id)
            .filter((t): t is string => typeof t === "string")
        )
      );
      setAvailableToolTypes(availableTypes);
    });
  }, [
    categoryId,
    activeSubcategory,
    selectedBrands,
    selectedToolTypes,
    priceMin,
    priceMax,
    sort,
    currentPage,
  ]);

  useEffect(() => {
    if (categoryId && totalCount === 0) {
      console.warn("Нет товаров для категории:", categoryId);
      router.replace("/catalog/c175fa42-706f-4488-9086-f03343395621");
    }
  }, [categoryId, totalCount]);

  const toggleToolType = (type: string) => {
    setSelectedToolTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">Категорія</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-1/4">
            <SidebarFilter
              subcategories={subcategories}
              brands={brands}
              availableBrands={availableBrands}
              selectedBrands={selectedBrands}
              toolTypes={toolTypes}
              availableToolTypes={availableToolTypes}
              selectedToolTypes={selectedToolTypes}
              activeSubcategory={activeSubcategory}
              priceMin={priceMin}
              priceMax={priceMax}
              allPrices={allPrices}
              onSubcategorySelect={(id) => {
                setActiveSubcategory(id);
                setCurrentPage(1);
              }}
              onBrandToggle={(brand) => {
                setSelectedBrands((prev) =>
                  prev.includes(brand)
                    ? prev.filter((b) => b !== brand)
                    : [...prev, brand]
                );
                setCurrentPage(1);
              }}
              onToolTypeToggle={toggleToolType}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
              onResetFilters={() => {
                setActiveSubcategory(null);
                setSelectedBrands([]);
                setSelectedToolTypes([]);
                setPriceMin(null);
                setPriceMax(null);
                setCurrentPage(1);
              }}
            />
          </aside>

          <section className="flex-1">
            <div className="flex justify-end mb-4">
              <SortDropdown
                value={sort}
                onChange={(val) => {
                  setSort(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            {isLoading ? (
              <p className="text-center text-gray-400 py-10">
                Завантаження товарів…
              </p>
            ) : products.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <p className="text-gray-500">
                  Немає товарів за обраними фільтрами
                </p>
                <button
                  onClick={() =>
                    router.push("/catalog/c175fa42-706f-4488-9086-f03343395621")
                  }
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Перейти до популярної категорії
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination
              total={totalCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CatalogByCategory;
