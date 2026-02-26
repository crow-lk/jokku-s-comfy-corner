import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="comic-card group block overflow-hidden">
      <div className="relative overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 comic-tag bg-accent text-accent-foreground text-xs">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 comic-tag bg-secondary text-secondary-foreground text-xs">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-heading text-xl text-foreground mb-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-muted"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-heading text-2xl text-primary">Rs.{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">Rs.{product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
