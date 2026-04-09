import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export function FAQ({ items, title = "Frequently Asked Questions" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="my-8">
      {title && <h3 className="text-2xl font-bold mb-6">{title}</h3>}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden hover:border-accent transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between bg-secondary/50 hover:bg-secondary transition-colors text-left"
            >
              <h4 className="font-semibold text-foreground">{item.question}</h4>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 py-4 bg-background border-t border-border">
                <p className="text-foreground/80 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        })}
      </script>
    </div>
  );
}
