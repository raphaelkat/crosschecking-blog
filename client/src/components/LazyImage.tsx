import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  quality?: "low" | "medium" | "high";
}

/**
 * LazyImage Component
 * Optimize image loading with lazy loading and responsive sizing
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className = "",
  placeholder,
  onLoad,
  quality = "high",
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = src;
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  if (error) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Failed to load image
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {!isLoaded && (
        <Skeleton
          className="absolute inset-0 w-full h-full"
          style={{
            width: width ? `${width}px` : "100%",
            height: height ? `${height}px` : "auto",
          }}
        />
      )}
      <img
        ref={imgRef}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
        }}
      />
    </div>
  );
}

/**
 * Responsive Image Component
 * Display images with responsive sizing
 */
export function ResponsiveImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-900 ${className}`}>
      {!isLoaded && <Skeleton className="absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
        sizes={sizes}
      />
    </div>
  );
}
