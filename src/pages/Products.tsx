import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useCatalog } from "@/hooks/useCatalog";

const Products = () => {
  const { products, categoryOptions, isLoading, error } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    if (categoryOptions.length === 0) return;
    if (activeCategory !== "All" && !categoryOptions.includes(activeCategory)) {
      setActiveCategory("All");
      searchParams.delete("category");
      setSearchParams(searchParams, { replace: true });
    }
  }, [activeCategory, categoryOptions, searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.categoryName === activeCategory);
  }, [activeCategory, products]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aPrice = typeof a.price === "number" ? a.price : Number.POSITIVE_INFINITY;
      const bPrice = typeof b.price === "number" ? b.price : Number.POSITIVE_INFINITY;
      if (sortBy === "price-low") return aPrice - bPrice;
      if (sortBy === "price-high") return bPrice - aPrice;
      if (sortBy === "rating") return ((b as any).rating ?? 0) - ((a as any).rating ?? 0);
      return ((b as any).reviews ?? 0) - ((a as any).reviews ?? 0); // popular
    });
  }, [filtered, sortBy]);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const isCatalogEmpty = !isLoading && !error && products.length === 0;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-6xl font-heading text-foreground text-center mb-2">
        SHOP ALL UNDIES
      </h1>
      <p className="text-center text-muted-foreground font-body mb-8">
        Find your perfect pair — comfort guaranteed or your money back!
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {categoryOptions.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`comic-tag transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {!isCatalogEmpty && (
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground font-body">
            {sorted.length} product{sorted.length !== 1 ? "s" : ""} found
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="comic-tag bg-card text-foreground cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      )}

      {error && (
        <p className="text-center text-destructive font-body mb-6">
          Couldn’t load products right now. Please try again shortly.
        </p>
      )}

      {isCatalogEmpty ? (
        <div className="text-center py-20">
          <p className="text-4xl font-heading text-foreground mb-3">New collection releasing soon!</p>
          <p className="text-muted-foreground font-body">We’re prepping fresh drops. Check back shortly.</p>
        </div>
      ) : isLoading ? (
        <p className="text-center text-muted-foreground font-body">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {sorted.length === 0 && !isLoading && !isCatalogEmpty && (
        <div className="text-center py-20">
          <p className="text-4xl font-heading text-muted-foreground">No products found</p>
          <button onClick={() => handleCategory("All")} className="comic-btn-primary mt-4">
            Show All
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
