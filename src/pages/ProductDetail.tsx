import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Star, Minus, Plus, ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-heading text-foreground">Product not found 😢</h1>
        <Link to="/products" className="comic-btn-primary mt-6 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first! 📏");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    toast.success(`${product.name} (${selectedSize}) added to cart! 🎉`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="comic-card overflow-hidden p-0">
          <div className="relative bg-muted">
            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 comic-tag bg-accent text-accent-foreground">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-body">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-heading text-primary">Rs.{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">Rs.{product.originalPrice}</span>
                <span className="comic-tag bg-secondary text-secondary-foreground text-sm">SAVE {discount}%</span>
              </>
            )}
          </div>

          <p className="text-foreground/80 font-body text-lg mb-6">{product.description}</p>

          {/* Size */}
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

          <button onClick={handleAddToCart} className="comic-btn-accent text-2xl w-full justify-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            ADD TO CART — Rs.{product.price * quantity}
          </button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-heading text-foreground mb-6">YOU MIGHT ALSO LIKE 👀</h2>
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
