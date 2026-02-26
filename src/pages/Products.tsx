import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("popular");

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews; // popular
  });

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-6xl font-heading text-foreground text-center mb-2">
        🛒 SHOP ALL UNDIES
      </h1>
      <p className="text-center text-muted-foreground font-body mb-8">
        Find your perfect pair — comfort guaranteed or your money back!
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {categories.map((cat) => (
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl font-heading text-muted-foreground">No products found 😅</p>
          <button onClick={() => handleCategory("All")} className="comic-btn-primary mt-4">
            Show All
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
