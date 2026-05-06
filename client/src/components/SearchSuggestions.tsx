import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Search } from "lucide-react";

interface SearchSuggestionsProps {
  query: string;
  onSelectSuggestion?: (slug: string) => void;
  isOpen?: boolean;
}

export default function SearchSuggestions({
  query,
  onSelectSuggestion,
  isOpen = true,
}: SearchSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions
  const { data: suggestions, isLoading } = trpc.articles.suggestions.useQuery(
    { query, limit: 5 },
    { enabled: query.length > 1 && isOpen }
  );

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !suggestions || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            // Navigate to the selected suggestion
            window.location.href = `/article/${suggestions[selectedIndex].slug}`;
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, suggestions, selectedIndex, onSelectSuggestion]);

  if (!isOpen || query.length < 2 || !suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {isLoading ? (
        <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading suggestions...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-1">
          {suggestions.map((suggestion, index) => (
            <Link
              key={suggestion.id}
              href={`/article/${suggestion.slug}`}
              onClick={() => onSelectSuggestion?.(suggestion.slug)}
              className={`block w-full text-left px-4 py-3 transition-colors flex items-start gap-3 hover:bg-accent/10 ${
                index === selectedIndex
                  ? "bg-accent/20 text-accent"
                  : "text-foreground"
              }`}
            >
              {suggestion.featuredImage && (
                <img
                  src={suggestion.featuredImage}
                  alt={suggestion.title}
                  className="w-10 h-10 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">
                  {suggestion.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {suggestion.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground text-sm">
          <Search className="w-5 h-5 mx-auto mb-2 opacity-50" />
          No articles found
        </div>
      )}
    </div>
  );
}
