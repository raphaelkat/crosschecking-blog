import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export interface ComparisonItem {
  name: string;
  price?: string;
  features: Record<string, boolean | string>;
  url?: string;
  isAffiliate?: boolean;
}

export interface ComparisonTableProps {
  title?: string;
  items: ComparisonItem[];
  criteria: string[];
}

export function ComparisonTable({ title, items, criteria }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto">
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-accent/10">
            <th className="border border-border p-4 text-left font-bold">Feature</th>
            {items.map((item) => (
              <th key={item.name} className="border border-border p-4 text-left font-bold">
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Price Row */}
          <tr className="hover:bg-accent/5">
            <td className="border border-border p-4 font-semibold">Price</td>
            {items.map((item) => (
              <td key={`${item.name}-price`} className="border border-border p-4">
                {item.price ? <span className="font-bold text-accent">{item.price}</span> : <span className="text-muted-foreground">Contact</span>}
              </td>
            ))}
          </tr>

          {/* Feature Rows */}
          {criteria.map((criterion, idx) => (
            <tr key={criterion} className={idx % 2 === 0 ? "hover:bg-accent/5" : "bg-card hover:bg-accent/5"}>
              <td className="border border-border p-4 font-medium">{criterion}</td>
              {items.map((item) => {
                const value = item.features[criterion];
                const isBoolean = typeof value === "boolean";

                return (
                  <td key={`${item.name}-${criterion}`} className="border border-border p-4 text-center">
                    {isBoolean ? (
                      value ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm">{value}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* CTA Row */}
          <tr className="bg-accent/10">
            <td className="border border-border p-4 font-semibold">Get Started</td>
            {items.map((item) => (
              <td key={`${item.name}-cta`} className="border border-border p-4 text-center">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant={item.isAffiliate ? "default" : "outline"}>
                      Visit
                    </Button>
                  </a>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {items.some((item) => item.isAffiliate) && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          *Some links are affiliate links. We earn a small commission at no extra cost to you.
        </p>
      )}
    </div>
  );
}
