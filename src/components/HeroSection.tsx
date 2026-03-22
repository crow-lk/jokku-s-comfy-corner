import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroBlack from "@/assets/hero-boxer-black.png";
import heroRed from "@/assets/hero-boxer-red.png";
import heroNavy from "@/assets/hero-boxer-navy.png";
import heroGrey from "@/assets/hero-boxer-grey.png";

const heroImages = [heroBlack, heroRed, heroNavy, heroGrey];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square">
              {heroImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Jokku boxer briefs ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-700 ease-in-out"
                  style={{ opacity: i === activeIndex ? 1 : 0 }}
                />
              ))}
            </div>
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground font-heading text-2xl px-4 py-2 rounded-xl border-[3px] border-foreground rotate-12" style={{ boxShadow: "var(--comic-shadow)" }}>
              FROM Rs.300!
            </div>
            {/* Dot indicators */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full border border-primary-foreground/50 transition-all duration-300 ${
                    i === activeIndex ? "bg-secondary scale-125" : "bg-primary-foreground/40"
                  }`}
                  aria-label={`View color ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 halftone-bg opacity-30 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
