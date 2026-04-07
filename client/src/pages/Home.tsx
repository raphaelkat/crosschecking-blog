import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { setMetaTags } from "@/lib/seo";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Set SEO meta tags for homepage
  useEffect(() => {
    setMetaTags({
      title: "Crosschecking.Blog - High-Authority Comparison & Review Articles",
      description: "In-depth comparison articles and reviews for AI, SaaS, E-commerce, and more. Data-driven insights to help you make informed decisions.",
      keyword: "comparison, reviews, AI, SaaS, tech",
      url: window.location.origin,
      type: "website",
    });
  }, []);

  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: featuredArticles, isLoading: articlesLoading } = trpc.articles.list.useQuery({
    limit: 6,
    offset: 0,
  });
  const { data: trendingArticles } = trpc.articles.trending.useQuery({ limit: 3 });
  const subscribeNewsletter = trpc.newsletter.subscribe.useMutation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus("loading");
    try {
      await subscribeNewsletter.mutateAsync({ email });
      setSubscribeStatus("success");
      setEmail("");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    } catch (error) {
      setSubscribeStatus("error");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-2xl font-bold font-serif">Crosschecking</a>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {categories?.slice(0, 5).map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                <a className="text-sm hover:text-accent transition-colors">{cat.name}</a>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-background to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Make Informed Decisions
            </h1>
            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
              In-depth, data-driven comparisons across Tech, AI, Finance, E-commerce, and more. 
              Discover the best solutions for your needs with our expert analysis.
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
                <a>
                  <Button>Search</Button>
                </a>
              </Link>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categoriesLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                categories?.slice(0, 8).map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <a className="badge hover:bg-accent hover:text-accent-foreground transition-colors">
                      {cat.name}
                    </a>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-2">Latest Comparisons</h2>
              <p className="text-muted-foreground">Discover our most recent in-depth analysis</p>
            </div>
            <Link href="/articles">
              <a className="flex items-center gap-2 text-accent hover:gap-3 transition-all">
                View All <ChevronRight className="w-4 h-4" />
              </a>
            </Link>
          </div>

          {articlesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <div className="article-grid">
              {featuredArticles?.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <a className="article-card group">
                    {article.featuredImage && (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="article-image"
                      />
                    )}
                    <div className="flex-1">
                      <div className="article-meta">
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                      </div>
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-excerpt">{article.excerpt || article.content.substring(0, 150)}...</p>
                    </div>
                    <div className="flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                      Read More <ChevronRight className="w-4 h-4" />
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Articles Sidebar */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-serif font-bold mb-8">Why Compare?</h2>
              <div className="prose space-y-6">
                <p className="text-lg leading-relaxed">
                  In 2026, choosing between products and services is no longer about price alone—it's about finding 
                  the perfect fit for your unique needs. Our comparative analysis framework helps you evaluate options 
                  across critical dimensions: value for money, ease of use, innovation, and reliability.
                </p>
                <p className="text-lg leading-relaxed">
                  Whether you're evaluating AI tools for content creation, comparing payment solutions for your business, 
                  or exploring the latest tech gadgets, we provide the data-driven insights you need to make confident decisions.
                </p>
              </div>
            </div>

            {/* Trending Widget */}
            <div className="bg-card rounded-lg p-6 border border-border h-fit">
              <h3 className="text-xl font-serif font-bold mb-6">Trending Now</h3>
              <div className="space-y-4">
                {trendingArticles?.map((article, idx) => (
                  <Link key={article.id} href={`/article/${article.slug}`}>
                    <a className="block group">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-serif font-bold text-muted-foreground group-hover:text-accent transition-colors">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm group-hover:text-accent transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {article.viewCount} views
                          </p>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-accent text-accent-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-4">Stay Ahead of the Curve</h2>
            <p className="text-lg mb-8 opacity-90">
              Subscribe to our newsletter to receive the latest insights and updates on new comparison articles 
              directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-accent-foreground text-accent"
                disabled={subscribeStatus === "loading"}
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={subscribeStatus === "loading"}
              >
                {subscribeStatus === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>

            {subscribeStatus === "success" && (
              <p className="text-sm text-green-600">Thank you! Check your email to confirm subscription.</p>
            )}
            {subscribeStatus === "error" && (
              <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-serif font-bold mb-4">Crosschecking</h3>
              <p className="text-sm text-muted-foreground">
                High-authority comparative analysis and reviews for informed decision-making.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories?.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`}>
                      <a className="text-muted-foreground hover:text-accent transition-colors">{cat.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Affiliate Disclosure</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 Crosschecking.blog. All rights reserved. | Affiliate Disclosure: We may earn commissions from affiliate links.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
