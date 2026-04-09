import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search as SearchIcon, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { setMetaTags } from "@/lib/seo";

export default function Search() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split("?")[1] || "");
  const initialQuery = queryParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Set SEO meta tags for search page
  useEffect(() => {
    setMetaTags({
      title: `Search Results for "${searchQuery}" - Crosschecking.Blog`,
      description: `Search results for "${searchQuery}" across all comparison articles and reviews.`,
      keyword: `search, ${searchQuery}, comparison, reviews`,
      url: `${window.location.origin}${location}`,
      type: "website",
    });
  }, [searchQuery, location]);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: searchResults, isLoading } = trpc.articles.search.useQuery(
    {
      query: searchQuery,
      categoryId: selectedCategory || undefined,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    },
    { enabled: searchQuery.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const totalPages = searchResults ? Math.ceil(searchResults.total / itemsPerPage) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold font-serif">
            Crosschecking
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {categories?.slice(0, 5).map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="text-sm hover:text-accent transition-colors">
                {cat.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-12 bg-secondary/30 border-b border-border">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-serif font-bold mb-8">Search Articles</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-3">
              <Input
                placeholder="Search articles, products, comparisons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="gap-2">
                <SearchIcon className="w-4 h-4" />
                Search
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                All Categories
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          {searchQuery.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Enter a search query to find articles</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : searchResults && searchResults.articles.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-8">
                Found {searchResults.total} result{searchResults.total !== 1 ? "s" : ""} for "{searchQuery}"
              </p>

              <div className="space-y-6">
                {searchResults.articles.map((article: any) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="block p-6 border border-border rounded-lg hover:border-accent hover:bg-secondary/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-2">
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                        </div>
                        <h3 className="text-2xl font-bold mb-2 hover:text-accent transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-foreground/80 line-clamp-2 mb-4">
                          {article.excerpt || article.content.substring(0, 200)}...
                        </p>
                        <div className="flex items-center gap-2 text-accent">
                          Read More <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                      {article.featuredImage && (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-32 h-32 object-cover rounded-sm flex-shrink-0"
                        />
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && searchResults.articles.length > 0 && (
                <div className="flex justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No articles found matching your search</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
