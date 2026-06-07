import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import DotCarousel from "./DotCarousel";

export default function PartnershipsCarousel() {
  const { data: partnerships = [] } = trpc.partnerships.list.useQuery();
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Handle responsive items per slide
  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (partnerships.length === 0) return null;

  const renderPartner = (partner: any) => (
    <div className="bg-white dark:bg-card rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] shadow-sm hover:shadow-md transition-shadow border border-border">
      {partner.partnerLogo && (
        <img
          src={partner.partnerLogo}
          alt={partner.partnerName}
          className="h-16 object-contain mb-4"
        />
      )}
      <h3 className="font-semibold text-gray-900 dark:text-foreground text-center mb-2">
        {partner.partnerName}
      </h3>
      {partner.description && (
        <p className="text-sm text-gray-600 dark:text-muted-foreground text-center">
          {partner.description}
        </p>
      )}
      {partner.partnerUrl && (
        <a
          href={partner.partnerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Learn More →
        </a>
      )}
    </div>
  );

  return (
    <section className="py-16 bg-gray-50 dark:bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Our Partners & Collaborators
        </h2>

        <DotCarousel
          items={partnerships}
          renderItem={renderPartner}
          autoplayInterval={4000}
          showCounter={false}
          itemsPerSlide={itemsPerSlide}
          className="px-4"
        />
      </div>
    </section>
  );
}
