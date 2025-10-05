import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/lib/supabaseClient";
import { ProductCard } from "@/components/ProductCard";
import SortDropdown, { SortOption } from "@/components/SortDropdown";
import SidebarFilter from "@/components/SidebarFilter";
import { Category } from "@/components/Categories";
import { Product } from "@/types/product";
import { Subcategory } from "@/types/subcategory";

interface Props {
  category: Category;
  products: Product[];
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .eq("slug", slug)
    .single();

  if (categoryError || !categoryData) {
    return { notFound: true };
  }

  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("*, tool_types(id, name)")
    .eq("category_id", categoryData.id);

  if (productsError) {
    console.error("❌ Ошибка загрузки товаров:", productsError.message);
  }

  return {
    props: {
      category: {
        id: categoryData.id,
        name: categoryData.name,
        image_url: categoryData.image_url,
        slug: categoryData.slug,
        subcategories: categoryData.subcategories ?? [],
      },
      products: productsData ?? [],
    },
  };
};

export default function CategoryPage({ category, products }: Props) {
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedToolTypes, setSelectedToolTypes] = useState<string[]>([]);
  const [selectedPowerTypes, setSelectedPowerTypes] = useState<string[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null
  );
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);

  const allPrices = useMemo(
    () => products.map((p) => p.price ?? 0),
    [products]
  );

  const allBrands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand ?? "").filter(Boolean))];
  }, [products]);

  const uniqueToolTypes = useMemo(() => {
    const seen = new Set<string>();
    return products
      .map((p) => p.tool_types)
      .filter((type): type is { id: string; name: string } => {
        if (!type || !type.id || seen.has(type.id)) return false;
        seen.add(type.id);
        return true;
      });
  }, [products]);

  const allToolTypes = useMemo(() => {
    return uniqueToolTypes.map((type) => type.id);
  }, [uniqueToolTypes]);

  const allPowerTypes = useMemo(() => {
    return [
      ...new Set(products.map((p) => p.power_type ?? "").filter(Boolean)),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand ?? "");
      const matchesToolType =
        selectedToolTypes.length === 0 ||
        selectedToolTypes.includes(p.tool_types?.id ?? "");
      const matchesPowerType =
        selectedPowerTypes.length === 0 ||
        selectedPowerTypes.includes(p.power_type ?? "");
      const matchesSubcategory =
        !activeSubcategory || p.subcategory_id === activeSubcategory;
      const matchesPrice =
        (priceMin === null || (p.price ?? 0) >= priceMin) &&
        (priceMax === null || (p.price ?? 0) <= priceMax);

      return (
        matchesBrand &&
        matchesToolType &&
        matchesPowerType &&
        matchesSubcategory &&
        matchesPrice
      );
    });
  }, [
    products,
    selectedBrands,
    selectedToolTypes,
    selectedPowerTypes,
    activeSubcategory,
    priceMin,
    priceMax,
  ]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortOption) {
      case "priceAsc":
        return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case "priceDesc":
        return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case "brandAsc":
        return sorted.sort((a, b) =>
          (a.brand ?? "").localeCompare(b.brand ?? "")
        );
      case "brandDesc":
        return sorted.sort((a, b) =>
          (b.brand ?? "").localeCompare(a.brand ?? "")
        );
      default:
        return sorted;
    }
  }, [filteredProducts, sortOption]);

  return (
    <Layout>
      <Head>
        <title>{category.name} – ToolBox Store</title>
      </Head>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center sm:text-left">
            {category.name}
          </h1>
          <SortDropdown value={sortOption} onChange={setSortOption} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <SidebarFilter
            subcategories={category.subcategories as Subcategory[]}
            brands={allBrands}
            availableBrands={allBrands}
            selectedBrands={selectedBrands}
            toolTypes={uniqueToolTypes}
            availableToolTypes={allToolTypes}
            selectedToolTypes={selectedToolTypes}
            powerTypes={allPowerTypes}
            availablePowerTypes={allPowerTypes}
            selectedPowerTypes={selectedPowerTypes}
            activeSubcategory={activeSubcategory}
            priceMin={priceMin}
            priceMax={priceMax}
            allPrices={allPrices}
            onSubcategorySelect={setActiveSubcategory}
            onBrandToggle={(brand) =>
              setSelectedBrands((prev) =>
                prev.includes(brand)
                  ? prev.filter((b) => b !== brand)
                  : [...prev, brand]
              )
            }
            onToolTypeToggle={(type) =>
              setSelectedToolTypes((prev) =>
                prev.includes(type)
                  ? prev.filter((t) => t !== type)
                  : [...prev, type]
              )
            }
            onPowerTypeToggle={(type) =>
              setSelectedPowerTypes((prev) =>
                prev.includes(type)
                  ? prev.filter((t) => t !== type)
                  : [...prev, type]
              )
            }
            onPriceMinChange={setPriceMin}
            onPriceMaxChange={setPriceMax}
            onResetFilters={() => {
              setSelectedBrands([]);
              setSelectedToolTypes([]);
              setSelectedPowerTypes([]);
              setActiveSubcategory(null);
              setPriceMin(null);
              setPriceMax(null);
            }}
          />

          <div>
            {sortedProducts.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Товари не знайдено.</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
