import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { setMetaTags } from "@/lib/seo";
import { getCategoryIcon } from "@/lib/categoryIcons";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: allCategories, isLoading } = trpc.categories.list.useQuery();

  // Set SEO meta tags
  useEffect(() => {
    setMetaTags({
      title: "All Categories - Crosschecking.Blog",
      description: "Browse all categories and topics covered on Crosschecking.Blog. Find in-depth comparisons and reviews across Tech, AI, E-commerce, and more.",
      keyword: "categories, topics, comparison, reviews",
      url: window.location.origin + "/categories",
      type: "website",
    });
  }, []);

  // Filter categories based on search query
  const filteredCategories = allCategories?.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-background to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">All Categories</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Explore our comprehensive collection of comparison and review categories. Find the perfect topic for your research.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8 max-w-2xl mx-auto">
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0"
              />
              <Button className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {filteredCategories.length} of {allCategories?.length || 0} categories
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group p-6 rounded-lg border border-border bg-card hover:bg-accent/5 hover:border-accent transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-accent group-hover:text-accent/80 transition-colors flex-shrink-0">
                      {getCategoryIcon(cat.slug)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold group-hover:text-accent transition-colors break-words">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No categories found</p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-8">
              Browse our latest comparison articles or use the search feature to discover more content.
            </p>
            <Button asChild>
              <Link href="/articles">Browse All Articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
