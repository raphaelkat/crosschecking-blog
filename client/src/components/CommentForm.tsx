import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface CommentFormProps {
  articleId: number;
  onCommentSubmitted?: () => void;
}

export function CommentForm({ articleId, onCommentSubmitted }: CommentFormProps) {
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !email.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would call a tRPC mutation
      toast.success("Comment submitted for moderation");
      setAuthor("");
      setEmail("");
      setContent("");
      onCommentSubmitted?.();
    } catch (error) {
      toast.error("Failed to submit comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-secondary/50 p-6 rounded-lg border border-border">
      <h3 className="text-lg font-bold">Leave a Comment</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Comment *</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Your comment will be moderated before appearing
        </p>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Post Comment
        </Button>
      </div>
    </form>
  );
}
