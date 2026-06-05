import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ExternalLink, Check } from "lucide-react";

interface AffiliateProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  affiliateUrl: string;
  badge?: string;
  features: string[];
  pros: string[];
  cons: string[];
}

interface AffiliateShowcaseProps {
  products: AffiliateProduct[];
  title?: string;
  description?: string;
  layout?: "grid" | "carousel" | "list";
}

/**
 * Affiliate Showcase Component
 * Displays featured affiliate products with ratings, features, and CTA buttons
 */
export function AffiliateShowcase({
  products,
  title = "Featured Products",
  description = "Our top recommended solutions",
  layout = "grid",
}: AffiliateShowcaseProps) {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Products Grid */}
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {products.map((product, index) => (
            <AffiliateProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct === index}
              onSelect={() => setSelectedProduct(index)}
              index={index}
            />
          ))}
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-12 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <span className="font-semibold">Affiliate Disclosure:</span> We may
            earn a commission from products purchased through our links. This
            helps support our research and allows us to continue providing
            quality content.
          </p>
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: AffiliateProduct;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function AffiliateProductCard({
  product,
  isSelected,
  onSelect,
  index,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 cursor-pointer ${
        isSelected
          ? "ring-2 ring-primary shadow-lg scale-105"
          : "hover:shadow-lg hover:scale-102"
      }`}
      onClick={onSelect}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Name and Price */}
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-1">{product.name}</h3>
          <p className="text-2xl font-bold text-primary">{product.price}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">
          {product.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
            Key Features
          </h4>
          <ul className="space-y-1">
            {product.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expanded Details */}
        {isSelected && (
          <div className="mb-4 p-3 bg-secondary/50 rounded-lg space-y-3 animate-in fade-in duration-200">
            {product.pros.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                  Pros
                </h5>
                <ul className="space-y-1">
                  {product.pros.map((pro, idx) => (
                    <li key={idx} className="text-xs flex gap-2">
                      <span className="text-green-600 dark:text-green-400">
                        ✓
                      </span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.cons.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  Cons
                </h5>
                <ul className="space-y-1">
                  {product.cons.map((con, idx) => (
                    <li key={idx} className="text-xs flex gap-2">
                      <span className="text-amber-600 dark:text-amber-400">
                        ✗
                      </span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 h-auto"
        >
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <span>View on Official Site</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

/**
 * Simple Affiliate Product Card for inline use
 */
export function SimpleAffiliateCard({
  product,
}: {
  product: AffiliateProduct;
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <div className="flex-1">
          <h4 className="font-bold mb-1">{product.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">{product.price}</span>
            <Button
              asChild
              size="sm"
              variant="outline"
            >
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
