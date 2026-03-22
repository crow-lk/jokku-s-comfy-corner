import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, mapProductToUi } from "@/lib/api";
import { useCatalog } from "@/hooks/useCatalog";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import ProductImageGallery from "@/components/ProductImageGallery";
import { Star, Minus, Plus, ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { categoryMap, products: catalogProducts } = useCatalog();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id ?? ""),
    enabled: !!id,
  });

  const product = useMemo(() => {
    if (!productQuery.data) return null;
    return mapProductToUi(productQuery.data, categoryMap);
  }, [productQuery.data, categoryMap]);

  useEffect(() => {
    if (product && product.sizes.length === 1 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  if (productQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-body">Loading product...</p>
      </div>
    );
  }

  if (productQuery.error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-heading text-foreground">Couldn’t load this product</h1>
        <Link to="/products" className="comic-btn-primary mt-6 inline-block">Back to Shop</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-heading text-foreground">Product not found</h1>
        <Link to="/products" className="comic-btn-primary mt-6 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const related = catalogProducts
    .filter((p) => p.categoryName === product.categoryName && p.id !== product.id)
    .slice(0, 4);

  const selectedVariant = product.sizes.length === 0
    ? product.variants[0]
    : product.variants.find((variant) => variant.sizeName === selectedSize);
  const displayPrice = selectedVariant?.sellingPrice ?? product.price;
  const canPurchase = !product.inquiryOnly && !product.showPriceInquiryMode && typeof displayPrice === "number";
  const hasRating = typeof product.rating === "number" && typeof product.reviews === "number";

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a size first.");
      return;
    }
    if (product.inquiryOnly || product.showPriceInquiryMode || !canPurchase) {
      toast.error("This item is available on inquiry only.");
      return;
    }
    try {
      await addItem(selectedVariant.id, quantity);
      const sizeLabel = (selectedVariant.sizeName ?? selectedSize) || "One Size";
      toast.success(`${product.name} (${sizeLabel}) added to cart.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to add to cart.";
      toast.error(message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-[2fr_3fr] gap-10">
        {/* Image */}
        <ProductImageGallery
          images={product.images}
          name={product.name}
          badge={product.badge}
        />

        {/* Info */}
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
            {product.categoryName}
          </p>
          <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-3">{product.name}</h1>

          {hasRating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating ?? 0) ? "fill-secondary text-secondary" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-body">{product.rating} ({product.reviews} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            {canPurchase ? (
              <span className="text-4xl font-heading text-primary">Rs.{displayPrice}</span>
            ) : (
              <span className="text-2xl font-heading text-muted-foreground">Price on request</span>
            )}
            {product.originalPrice && canPurchase && (
              <span className="text-xl text-muted-foreground line-through">Rs.{product.originalPrice}</span>
            )}
          </div>

          {product.description && (
            <p className="text-foreground/80 font-body text-lg mb-6">{product.description}</p>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-heading text-xl text-foreground mb-3">SELECT SIZE:</h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`comic-tag text-base px-5 py-2 transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {size}
                    {selectedSize === size && <Check className="w-4 h-4 inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <h4 className="font-heading text-xl text-foreground mb-3">QUANTITY:</h4>
            <div className="inline-flex items-center border-[3px] border-foreground rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-muted transition-colors">
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-6 py-2 font-heading text-xl border-x-[3px] border-foreground">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-muted transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || !canPurchase}
            className={`comic-btn-accent text-2xl w-full justify-center gap-3 ${(!selectedVariant || !canPurchase) ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <ShoppingCart className="w-6 h-6" />
            {canPurchase ? `ADD TO CART — Rs.${(displayPrice ?? 0) * quantity}` : "PRICE ON REQUEST"}
          </button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-heading text-foreground mb-6">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
