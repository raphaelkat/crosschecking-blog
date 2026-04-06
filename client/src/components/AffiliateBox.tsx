import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AffiliateBoxProps {
  type: "top_choice" | "best_for_beginners" | "cta_button";
  title: string;
  description: string;
  productName: string;
  url: string;
  price?: string;
  rating?: number;
  features?: string[];
}

export function AffiliateBox({
  type,
  title,
  description,
  productName,
  url,
  price,
  rating,
  features,
}: AffiliateBoxProps) {
  const bgColor = type === "top_choice" ? "bg-accent/10" : type === "best_for_beginners" ? "bg-blue-50" : "bg-green-50";
  const borderColor = type === "top_choice" ? "border-accent" : type === "best_for_beginners" ? "border-blue-200" : "border-green-200";
  const badgeColor = type === "top_choice" ? "bg-accent text-accent-foreground" : type === "best_for_beginners" ? "bg-blue-600 text-white" : "bg-green-600 text-white";

  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-lg p-6 my-6`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`${badgeColor} text-xs font-bold px-3 py-1 rounded-full inline-block`}>
            {type === "top_choice" ? "⭐ OUR TOP CHOICE" : type === "best_for_beginners" ? "🎯 BEST FOR BEGINNERS" : "✓ RECOMMENDED"}
          </span>
          <h3 className="text-2xl font-bold mt-3">{title}</h3>
        </div>
      </div>

      <p className="text-foreground mb-4">{description}</p>

      {features && features.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Key Features:</p>
          <ul className="space-y-1">
            {features.map((feature, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-center">
                <span className="mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          {price && <p className="text-lg font-bold text-accent">{price}</p>}
          {rating && (
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">({rating}/5)</span>
            </div>
          )}
        </div>
      </div>

      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          Visit {productName}
        </Button>
      </a>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        *Affiliate link - We earn a small commission at no extra cost to you
      </p>
    </div>
  );
}
