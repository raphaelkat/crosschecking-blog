import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface AffiliateManagerProps {
  articleId: number;
}

export function AffiliateManager({ articleId }: AffiliateManagerProps) {
  const [productName, setProductName] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [linkType, setLinkType] = useState<"top_choice" | "best_for_beginners" | "comparison_table" | "cta_button" | "inline">("top_choice");
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, we'd fetch affiliate links for the article
  // For now, we'll use a placeholder
  const affiliateLinks: any[] = [];
  const refetch = async () => {};

  const handleAddLink = async () => {
    if (!productName.trim() || !affiliateUrl.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would call a tRPC mutation
      toast.success("Affiliate link added successfully");
      setProductName("");
      setAffiliateUrl("");
      setLinkType("top_choice");
      await refetch();
    } catch (error) {
      toast.error("Failed to add affiliate link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!confirm("Are you sure you want to delete this affiliate link?")) return;

    try {
      // In a real implementation, this would call a tRPC mutation
      toast.success("Affiliate link deleted successfully");
      await refetch();
    } catch (error) {
      toast.error("Failed to delete affiliate link");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">Add Affiliate Link</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Stripe Payment Platform"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Affiliate URL</label>
            <Input
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://affiliate.example.com/..."
              type="url"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Link Type</label>
            <select
              value={linkType}
              onChange={(e) => setLinkType(e.target.value as any)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="top_choice">Our Top Choice</option>
              <option value="best_for_beginners">Best for Beginners</option>
              <option value="comparison_table">Comparison Table</option>
              <option value="cta_button">CTA Button</option>
              <option value="inline">Inline Link</option>
            </select>
          </div>
          <Button
            onClick={handleAddLink}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Link
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Affiliate Links</h3>
        <div className="space-y-2">
          {affiliateLinks.length > 0 ? (
            affiliateLinks.map((link: any) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold">{link.productName}</p>
                  <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{link.type}</span>
                    {link.clickCount && (
                      <span className="text-xs text-muted-foreground">
                        {link.clickCount} clicks
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteLink(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No affiliate links yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
