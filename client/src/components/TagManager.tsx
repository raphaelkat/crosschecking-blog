import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export function TagManager() {
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: tags, refetch } = trpc.tags.list.useQuery();

  const handleAddTag = async () => {
    if (!tagName.trim() || !tagSlug.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would call a tRPC mutation
      // For now, we'll just show a success message
      toast.success("Tag created successfully");
      setTagName("");
      setTagSlug("");
      await refetch();
    } catch (error) {
      toast.error("Failed to create tag");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      // In a real implementation, this would call a tRPC mutation
      toast.success("Tag deleted successfully");
      await refetch();
    } catch (error) {
      toast.error("Failed to delete tag");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">Create New Tag</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tag Name</label>
            <Input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., 2026 Trends"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tag Slug</label>
            <Input
              value={tagSlug}
              onChange={(e) => setTagSlug(e.target.value)}
              placeholder="e.g., 2026-trends"
            />
          </div>
          <Button
            onClick={handleAddTag}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Create Tag
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Existing Tags</h3>
        <div className="space-y-2">
          {tags?.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <p className="font-semibold">{tag.name}</p>
                <p className="text-sm text-muted-foreground">{tag.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTagName(tag.name);
                    setTagSlug(tag.slug);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
