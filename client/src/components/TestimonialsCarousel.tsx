import { Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import DotCarousel from "./DotCarousel";

export default function TestimonialsCarousel() {
  const { data: testimonials = [] } = trpc.testimonials.list.useQuery();

  if (testimonials.length === 0) return null;

  const renderTestimonial = (testimonial: any) => (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-8 md:p-12 min-h-[300px] flex flex-col justify-between">
      {/* Quote */}
      <div>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic mb-6">
          "{testimonial.content}"
        </p>

        {/* Rating */}
        <div className="flex gap-1 mb-6">
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-4">
        {testimonial.authorImage && (
          <img
            src={testimonial.authorImage}
            alt={testimonial.authorName}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {testimonial.authorName}
          </p>
          {testimonial.authorTitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {testimonial.authorTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white dark:bg-background">
      <div className="container max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          What Our Readers Say
        </h2>

        <DotCarousel
          items={testimonials}
          renderItem={renderTestimonial}
          autoplayInterval={5000}
          showCounter={false}
          itemsPerSlide={1}
        />
      </div>
    </section>
  );
}
