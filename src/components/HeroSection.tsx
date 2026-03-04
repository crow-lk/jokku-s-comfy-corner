import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left z-10">
            <div className="inline-block comic-tag bg-secondary text-secondary-foreground mb-4 text-sm">
              NEW COLLECTION DROPPED!
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-primary-foreground leading-none mb-4">
              UNDIES THAT
              <br />
              <span className="text-secondary">SLAP</span>
              <br />
              DIFFERENT!
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 font-body mb-8 max-w-md mx-auto md:mx-0">
              Sri Lanka's funniest & comfiest men's underwear. Your balls deserve better. Period.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/products" className="comic-btn-secondary text-xl">
                SHOP NOW
              </Link>
              <Link to="/products?category=Boxer+Shorts" className="comic-btn bg-primary-foreground text-primary text-xl">
                BEST SELLERS
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <img
              src={heroBanner}
              alt="Jokku Hero"
              className="w-full max-w-lg rounded-3xl border-[3px] border-foreground animate-float"
              style={{ boxShadow: "var(--comic-shadow-lg)" }}
            />
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground font-heading text-2xl px-4 py-2 rounded-xl border-[3px] border-foreground rotate-12" style={{ boxShadow: "var(--comic-shadow)" }}>
              FROM Rs.950!
            </div>
          </div>
        </div>
      </div>
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone-bg opacity-30 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
