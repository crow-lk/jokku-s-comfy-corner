import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts, mapProductsToUi, type ApiCategory } from "@/lib/api";

const buildCategoryMap = (categories: ApiCategory[]) =>
  new Map(categories.map((category) => [category.id, category.name]));

export const useCatalog = () => {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categoryMap = useMemo(
    () => buildCategoryMap(categoriesQuery.data ?? []),
    [categoriesQuery.data]
  );

  const products = useMemo(
    () => mapProductsToUi(productsQuery.data ?? [], categoryMap),
    [productsQuery.data, categoryMap]
  );

  const categoryOptions = useMemo(() => {
    const names = (categoriesQuery.data ?? []).map((category) => category.name);
    return ["All", ...Array.from(new Set(names))];
  }, [categoriesQuery.data]);

  return {
    products,
    categories: categoriesQuery.data ?? [],
    categoryMap,
    categoryOptions,
    isLoading: categoriesQuery.isLoading || productsQuery.isLoading,
    error: categoriesQuery.error ?? productsQuery.error,
  };
};
