import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  badge?: string;
}

const ProductImageGallery = ({ images, name, badge }: ProductImageGalleryProps) => {
  const finalImages = images.length > 0 ? images : ["/placeholder.svg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + finalImages.length) % finalImages.length);
    },
    [finalImages.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      goTo(touchDeltaX.current > 0 ? activeIndex - 1 : activeIndex + 1);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Vertical scrollable thumbnail column — same height as main image */}
      {finalImages.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 overflow-y-auto scrollbar-hide w-16 shrink-0" style={{ maxHeight: "60vh" }}>
          {finalImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "shrink-0 w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                i === activeIndex
                  ? "border-secondary ring-2 ring-secondary/30"
                  : "border-foreground/20 hover:border-foreground/50 opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image with swipe */}
      <div className="flex-1 flex flex-col gap-2">
        <div
          className="comic-card overflow-hidden p-0 relative bg-muted aspect-[3/4]"
          style={{ maxHeight: "60vh" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={finalImages[activeIndex]}
            alt={`${name} - image ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {badge && (
            <span className="absolute top-4 left-4 comic-tag bg-accent text-accent-foreground">
              {badge}
            </span>
          )}

          {/* Arrows */}
          {finalImages.length > 1 && (
            <>
              <button
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2 border-foreground rounded-full p-1.5 hover:bg-background transition-colors hidden sm:flex"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2 border-foreground rounded-full p-1.5 hover:bg-background transition-colors hidden sm:flex"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dot indicators (mobile only) */}
          {finalImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {finalImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full border border-foreground/50 transition-all duration-200",
                    i === activeIndex
                      ? "bg-secondary scale-110"
                      : "bg-background/60 hover:bg-background"
                  )}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Horizontal thumbnail strip (mobile only) */}
        {finalImages.length > 1 && (
          <div className="flex md:hidden gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
            {finalImages.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 snap-start",
                  i === activeIndex
                    ? "border-secondary ring-2 ring-secondary/30"
                    : "border-foreground/20 hover:border-foreground/50 opacity-70 hover:opacity-100"
                )}
              >
                <img
                  src={img}
                  alt={`${name} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
