import { Share2, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
  articleId: number;
}

export default function ShareButtons({ title, url, description, articleId }: ShareButtonsProps) {
  const [shareCount, setShareCount] = useState(0);
  const incrementShareMutation = trpc.articles.incrementShare.useMutation();
  const getShareCountQuery = trpc.articles.getShareCount.useQuery({ articleId });

  useEffect(() => {
    if (getShareCountQuery.data?.shareCount !== undefined && getShareCountQuery.data.shareCount !== null) {
      setShareCount(getShareCountQuery.data.shareCount);
    }
  }, [getShareCountQuery.data]);

  const handleShare = async (platform: string) => {
    try {
      // Increment share count
      await incrementShareMutation.mutateAsync({ articleId });
      setShareCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to increment share count:', error);
    }
  };
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
        await handleShare("native");
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
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md transition-colors hover:bg-blue-100 hover:text-blue-700 border-blue-300"
        onClick={() => handleShare('facebook')}
      >
        <Facebook className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md transition-colors hover:bg-blue-50 hover:text-blue-700 border-blue-200"
        onClick={() => handleShare('linkedin')}
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on WhatsApp"
        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md transition-colors hover:bg-green-50 hover:text-green-600 border-green-200"
        onClick={() => handleShare('whatsapp')}
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

      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-300">
        <Share2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-muted-foreground">{shareCount}</span>
      </div>
    </div>
  );
}
