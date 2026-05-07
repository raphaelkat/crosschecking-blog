import { Share2, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-semibold text-muted-foreground">Share:</span>
      
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Twitter"
        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md transition-colors hover:bg-blue-50 hover:text-blue-600 border-blue-200"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md transition-colors hover:bg-blue-100 hover:text-blue-700 border-blue-300"
      >
        <Facebook className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md transition-colors hover:bg-blue-50 hover:text-blue-700 border-blue-200"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on WhatsApp"
        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md transition-colors hover:bg-green-50 hover:text-green-600 border-green-200"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {typeof navigator !== "undefined" && "share" in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="hover:bg-gray-100"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
