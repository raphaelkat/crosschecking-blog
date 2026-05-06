import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link } from "wouter";
import SearchSuggestions from "./SearchSuggestions";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showSuggestions?: boolean;
}

export default function SearchBar({
  placeholder = "Search articles...",
  onSearch,
  className = "",
  showSuggestions = true,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      setSuggestionsOpen(false);
    }
  };

  const handleSuggestionSelect = (slug: string) => {
    setSuggestionsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSuggestionsOpen(true);
            }}
            onFocus={() => setSuggestionsOpen(true)}
            className="flex-1 min-w-0"
          />
          {showSuggestions && (
            <SearchSuggestions
              query={debouncedQuery}
              onSelectSuggestion={handleSuggestionSelect}
              isOpen={suggestionsOpen && query.length > 1}
            />
          )}
        </div>
        <Button type="submit" className="w-full sm:w-auto gap-2">
          <Search className="w-4 h-4" />
          Search
        </Button>
      </form>
    </div>
  );
}
