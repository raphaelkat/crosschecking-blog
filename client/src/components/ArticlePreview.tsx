import { Streamdown } from "streamdown";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticlePreviewProps {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  onClose: () => void;
}

export function ArticlePreview({
  title,
  excerpt,
  content,
  featuredImage,
  onClose,
}: ArticlePreviewProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Article Preview</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-8">
          <article className="max-w-2xl mx-auto">
            {/* Featured Image */}
            {featuredImage && (
              <div className="mb-8">
                <img
                  src={featuredImage}
                  alt={title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Article Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4">{title}</h1>
              <p className="text-lg text-foreground/80">{excerpt}</p>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <Streamdown>{content}</Streamdown>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
