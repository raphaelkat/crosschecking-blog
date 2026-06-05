import { useState } from "react";
import { Streamdown } from "streamdown";
import { X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ArticlePreviewProps {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  onClose?: () => void;
  trigger?: "button" | "link" | "icon" | "modal";
  triggerLabel?: string;
}

export function ArticlePreview({
  title,
  excerpt,
  content,
  featuredImage,
  onClose,
  trigger = "button",
  triggerLabel = "Preview",
}: ArticlePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    if (trigger === "modal") {
      setIsOpen(false);
    } else if (onClose) {
      onClose();
    }
  };

  const renderTrigger = () => {
    if (trigger === "icon") {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          title="Preview article"
        >
          <Eye className="w-4 h-4" />
        </Button>
      );
    }

    if (trigger === "link") {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="text-primary hover:underline text-sm font-medium"
        >
          {triggerLabel}
        </button>
      );
    }

    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="w-4 h-4 mr-2" />
        {triggerLabel}
      </Button>
    );
  };

  const previewContent = (
    <article className="max-w-2xl mx-auto space-y-6">
      {/* Featured Image */}
      {featuredImage && (
        <div>
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Article Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold mb-4">{title}</h1>
        <p className="text-lg text-foreground/80">{excerpt}</p>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <Streamdown>{content}</Streamdown>
      </div>
    </article>
  );

  // Modal/Dialog variant
  if (trigger === "modal" || trigger === "icon" || trigger === "link") {
    return (
      <>
        {renderTrigger()}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Article Preview</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              {previewContent}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Full-screen modal variant (default)
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Article Preview</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-8">
          {previewContent}
        </div>
      </div>
    </div>
  );
}
