import { useState, useRef, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  badge?: string;
}

const ProductImageGallery = ({ images, name, badge }: ProductImageGalleryProps) => {
  const finalImages = useMemo(
    () => (images.length > 0 ? images.slice(0, 12) : ["/placeholder.svg"]),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      setActiveIndex((current) =>
        current > 0 ? current - 1 : finalImages.length - 1
      );
    }
  };

  return (
    <div className="space-y-2">
      {/* Main image - 1:1 ratio */}
      <div
        className="comic-card overflow-hidden p-0 relative bg-muted aspect-square"
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

        {finalImages.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex === 0 ? finalImages.length - 1 : activeIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2 border-foreground rounded-full p-1.5 hover:bg-background transition-colors hidden sm:flex"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(activeIndex === finalImages.length - 1 ? 0 : activeIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2 border-foreground rounded-full p-1.5 hover:bg-background transition-colors hidden sm:flex"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails grid: 6 per row, max 2 rows */}
      {finalImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {finalImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
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
  );
};

export default ProductImageGallery;
