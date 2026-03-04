import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { useCatalog } from "@/hooks/useCatalog";
import { Truck, Shield, RotateCcw, Zap } from "lucide-react";

const features = [
  { icon: Truck, title: "FREE DELIVERY 🚀", desc: "On orders over Rs.3000" },
  { icon: Shield, title: "100% COTTON 🌿", desc: "Premium quality fabric" },
  { icon: RotateCcw, title: "EASY RETURNS 😎", desc: "7-day hassle-free returns" },
  { icon: Zap, title: "FAST SHIPPING ⚡", desc: "Island-wide next day delivery" },
];

const Index = () => {
  const { products, isLoading, error } = useCatalog();
  const featuredProducts = products.slice(0, 4);
  const dealProducts = products.filter((p) => p.originalPrice && p.price && p.originalPrice > p.price);
  const isEmpty = !isLoading && !error && products.length === 0;

  return (
    <div>
      <HeroSection />

      {/* Features */}
      <section className="py-10 bg-secondary border-y-[3px] border-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <f.icon className="w-8 h-8 mx-auto mb-2 text-foreground" strokeWidth={2.5} />
                <h4 className="font-heading text-lg text-foreground">{f.title}</h4>
                <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground">
            🔥 PEOPLE'S FAVES
          </h2>
          <p className="text-muted-foreground font-body mt-2">These undies are literally flying off shelves (and onto butts)</p>
        </div>
        {error && (
          <p className="text-center text-destructive font-body mb-6">
            Couldn’t load products right now. Please try again shortly.
          </p>
        )}
        {isEmpty ? (
          <div className="text-center text-muted-foreground font-body">
            <p className="text-2xl font-heading text-foreground mb-2">New collection releasing soon!</p>
            <p>Check back shortly for fresh drops.</p>
          </div>
        ) : isLoading ? (
          <p className="text-center text-muted-foreground font-body">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/products" className="comic-btn-primary text-xl">
            VIEW ALL PRODUCTS →
          </Link>
        </div>
      </section>

      {/* Speech bubble CTA */}
      <section className="py-16 bg-accent halftone-bg">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="speech-bubble mb-8 inline-block">
              <h2 className="text-3xl md:text-4xl font-heading text-foreground">
                "MY BUTT HAS NEVER BEEN HAPPIER!" 🤩
              </h2>
              <p className="text-muted-foreground font-body mt-2">— Actual Customer, Colombo (we can't make this up)</p>
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-heading text-accent-foreground mt-8 mb-4">
            10,000+ HAPPY BUTTS & COUNTING!
          </h3>
          <Link to="/products" className="comic-btn-secondary text-xl">
            TREAT YOUR BUTT NOW! 🎉
          </Link>
        </div>
      </section>

      {/* Deals */}
      {dealProducts.length > 0 && !isEmpty && (
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-heading text-foreground">
              💸 STUPID CHEAP DEALS
            </h2>
            <p className="text-muted-foreground font-body mt-2">Seriously, we might be losing money on these 😅</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {dealProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
