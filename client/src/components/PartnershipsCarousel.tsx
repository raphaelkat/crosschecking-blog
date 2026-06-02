import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PartnershipsCarousel() {
  const { data: partnerships = [] } = trpc.partnerships.list.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || partnerships.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partnerships.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [autoplay, partnerships.length]);

  if (partnerships.length === 0) return null;

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(partnerships.length / itemsPerSlide);
  const slideIndex = Math.floor(currentIndex / itemsPerSlide);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - itemsPerSlide + partnerships.length) % partnerships.length);
    setAutoplay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + itemsPerSlide) % partnerships.length);
    setAutoplay(false);
  };

  const visiblePartners = partnerships.slice(
    slideIndex * itemsPerSlide,
    (slideIndex + 1) * itemsPerSlide
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Our Partners & Collaborators</h2>

        <div
          className="relative"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Carousel */}
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex-shrink-0"
              aria-label="Previous partners"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Partners Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {visiblePartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] shadow-sm hover:shadow-md transition-shadow"
                >
                  {partner.partnerLogo && (
                    <img
                      src={partner.partnerLogo}
                      alt={partner.partnerName}
                      className="h-16 object-contain mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 text-center mb-2">
                    {partner.partnerName}
                  </h3>
                  {partner.description && (
                    <p className="text-sm text-gray-600 text-center">{partner.description}</p>
                  )}
                  {partner.partnerUrl && (
                    <a
                      href={partner.partnerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Learn More →
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex-shrink-0"
              aria-label="Next partners"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index * itemsPerSlide);
                  setAutoplay(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === slideIndex
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to partners slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center text-sm text-gray-600 mt-4">
            {slideIndex + 1} / {totalSlides}
          </div>
        </div>
      </div>
    </section>
  );
}
