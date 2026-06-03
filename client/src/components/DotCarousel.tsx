import { useState, useEffect, ReactNode } from "react";

interface DotCarouselProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  autoplayInterval?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
  showCounter?: boolean;
  itemsPerSlide?: number;
}

export default function DotCarousel({
  items,
  renderItem,
  autoplayInterval = 5000,
  onIndexChange,
  className = "",
  showCounter = false,
  itemsPerSlide = 1,
}: DotCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  useEffect(() => {
    if (!autoplay || items.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, items.length, totalSlides, autoplayInterval]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  if (items.length === 0) return null;

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setAutoplay(false);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      setAutoplay(false);
    } else if (e.key === "ArrowRight") {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
      setAutoplay(false);
    }
  };

  const visibleItems = items.slice(
    currentIndex * itemsPerSlide,
    (currentIndex + 1) * itemsPerSlide
  );

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Carousel"
      tabIndex={0}
    >
      {/* Carousel Content */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isTransitioning ? "opacity-75" : "opacity-100"
        }`}
      >
        {itemsPerSlide === 1 ? (
          <div key={currentIndex}>{renderItem(visibleItems[0], currentIndex)}</div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${itemsPerSlide}, 1fr)` }}>
            {visibleItems.map((item, idx) => (
              <div key={currentIndex * itemsPerSlide + idx}>
                {renderItem(item, currentIndex * itemsPerSlide + idx)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dot Navigation */}
      <div className="flex justify-center items-center gap-3 mt-8">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleDotClick(index);
              }
            }}
            className={`transition-all duration-300 ease-out rounded-full ${
              index === currentIndex
                ? "w-3 h-3 bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125"
                : "w-2 h-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
            role="tab"
          />
        ))}
      </div>

      {/* Counter (Optional) */}
      {showCounter && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          {currentIndex + 1} / {totalSlides}
        </div>
      )}
    </div>
  );
}
