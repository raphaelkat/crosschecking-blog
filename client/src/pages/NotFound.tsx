import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");

  const popularArticles = [
    { title: "Best Tech Gadgets 2026", slug: "best-tech-gadgets-2026" },
    { title: "AI Tools Comparison", slug: "ai-tools-comparison" },
    { title: "Cloud Platforms Review", slug: "cloud-platforms-review" },
    { title: "Productivity Software Guide", slug: "productivity-software-guide" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-serif font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Sorry, we could not find the page you are looking for. It may have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">Search for articles</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
                <Button className="gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="w-full gap-2 justify-center">
                <Home className="w-4 h-4" />
                Back to Homepage
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" className="w-full gap-2 justify-center">
                <ArrowRight className="w-4 h-4" />
                Browse Categories
              </Button>
            </Link>
          </div>

          <div className="text-left">
            <h3 className="text-lg font-bold mb-4 text-foreground">Popular articles</h3>
            <div className="space-y-2">
              {popularArticles.map((article) => (
                <Link key={article.slug} href={`/article/${article.slug}`}>
                  <div className="p-4 bg-card border border-border rounded-lg hover:border-blue-600 transition cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground group-hover:text-blue-600 transition">
                        {article.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-muted-foreground mb-4">
              Still cannot find what you are looking for?
            </p>
            <Link href="/contact">
              <Button className="gap-2">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
