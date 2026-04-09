import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TagFilterProps {
  tags: Array<{ id: number; name: string }>;
  selectedTags: number[];
  onTagToggle: (tagId: number) => void;
  onClearAll?: () => void;
}

export function TagFilter({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
}: TagFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filter by Tags</h3>
        {selectedTags.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-sm text-accent hover:underline transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTags.includes(tag.id)
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
