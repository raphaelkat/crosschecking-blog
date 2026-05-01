import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Search, X } from "lucide-react";

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchAutocomplete({ onSearch, className = "" }: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults } = trpc.articles.search.useQuery(
    { query, limit: 5 },
    { enabled: query.length > 0 }
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const results = searchResults?.articles || [];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          const article = results[selectedIndex];
          setQuery("");
          setIsOpen(false);
          setSelectedIndex(-1);
          onSearch?.(query);
        } else if (query.trim()) {
          onSearch?.(query);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  };

  const results = searchResults?.articles || [];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {results.map((article, index) => (
              <Link key={article.id} href={`/article/${article.slug}`}>
                <div
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                    setSelectedIndex(-1);
                  }}
                  className={`px-4 py-3 cursor-pointer border-b border-border last:border-b-0 transition ${
                    index === selectedIndex
                      ? "bg-muted"
                      : "hover:bg-muted"
                  }`}
                >
                  <p className="font-medium text-foreground text-sm line-clamp-1">
                    {article.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {article.excerpt || article.content.substring(0, 100)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          No articles found for "{query}"
        </div>
      )}
    </div>
  );
}
