import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function TestimonialsCarousel() {
  const { data: testimonials = [] } = trpc.testimonials.list.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || testimonials.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoplay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setAutoplay(false);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Readers Say</h2>

        <div
          className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 md:p-12 min-h-[300px] flex flex-col justify-between overflow-hidden"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Quote */}
          <div className="flex-1 flex flex-col justify-center transition-opacity duration-500 ease-in-out">
            <div key={current.id} className="animate-fadeIn">
            <p className="text-lg md:text-xl text-gray-700 italic mb-6">"{current.content}"</p>

            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: current.rating || 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              {current.authorImage && (
                <img
                  src={current.authorImage}
                  alt={current.authorName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{current.authorName}</p>
                {current.authorTitle && (
                  <p className="text-sm text-gray-600">{current.authorTitle}</p>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoplay(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-blue-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Counter */}
          <div className="text-center text-sm text-gray-600 mt-4">
            {currentIndex + 1} / {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  );
}
