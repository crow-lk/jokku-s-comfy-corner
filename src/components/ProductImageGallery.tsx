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
    <div className="space-y-2">
      {/* Main image with swipe */}
      <div
        className="comic-card overflow-hidden p-0 relative bg-muted"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={finalImages[activeIndex]}
          alt={`${name} - image ${activeIndex + 1}`}
          className="w-full aspect-[3/4] object-cover transition-opacity duration-300 md:max-h-[55vh]"
        />

        {badge && (
          <span className="absolute top-4 left-4 comic-tag bg-accent text-accent-foreground">
            {badge}
          </span>
        )}

        {/* Arrows (hidden on very small screens, visible on md+) */}
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

        {/* Dot indicators */}
        {finalImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {finalImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full border border-foreground/50 transition-all duration-200",
                  i === activeIndex
                    ? "bg-primary scale-110"
                    : "bg-background/60 hover:bg-background"
                )}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {finalImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {finalImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                i === activeIndex
                  ? "border-primary ring-2 ring-primary/30"
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
  );
};

export default ProductImageGallery;
