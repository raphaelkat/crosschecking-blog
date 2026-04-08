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
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Make Informed Decisions</h1>
            <p className="text-xl text-muted-foreground mb-12">
              In-depth, data-driven comparisons across Tech, AI, Finance, E-commerce, and more. Discover the best solutions for your needs with our expert analysis.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              <Button asChild>
                <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
                  Search
                </Link>
              </Button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categoriesLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                categories?.slice(0, 8).map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className="badge hover:bg-accent hover:text-accent-foreground transition-colors">
                    {cat.name}
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
            <Link href="/articles" className="flex items-center gap-2 text-accent hover:gap-3 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <div className="article-grid">
              {featuredArticles?.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="article-card">
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
                  <div className="flex items-center gap-2 text-accent transition-all">
                    Read More <ChevronRight className="w-4 h-4" />
                  </div>
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
              <h2 className="text-3xl font-serif font-bold mb-8">Why Choose Crosschecking?</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Data-Driven Analysis</h3>
                  <p className="text-muted-foreground">We research the latest 2026 trends, pricing, and user reviews to provide accurate comparisons.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Honest Reviews</h3>
                  <p className="text-muted-foreground">Every product includes balanced pros and cons. We only recommend solutions we genuinely believe in.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">SEO-Optimized Content</h3>
                  <p className="text-muted-foreground">Our articles rank on the first page of search engines, helping you discover the best solutions.</p>
                </div>
              </div>
            </div>

            {/* Trending Widget */}
            <aside className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold mb-6">Trending Now</h3>
              <div className="space-y-4">
                {trendingArticles?.map((article) => (
                  <Link key={article.id} href={`/article/${article.slug}`} className="block hover:text-accent transition-colors">
                    <p className="font-semibold text-sm line-clamp-2">{article.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 opacity-90">Get the latest comparison articles and insights delivered to your inbox.</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground text-primary placeholder-primary/50"
              required
            />
            <Button 
              type="submit" 
              variant="secondary"
              disabled={subscribeStatus === "loading"}
            >
              {subscribeStatus === "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          {subscribeStatus === "success" && (
            <p className="text-sm mt-4">✓ Successfully subscribed!</p>
          )}
          {subscribeStatus === "error" && (
            <p className="text-sm mt-4">Error subscribing. Please try again.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Crosschecking</h4>
              <p className="text-sm text-muted-foreground">High-authority comparison and review articles for informed decision-making.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories?.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="text-muted-foreground hover:text-accent transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/sitemap.xml" className="text-muted-foreground hover:text-accent transition-colors">Sitemap</a></li>
                <li><a href="/robots.txt" className="text-muted-foreground hover:text-accent transition-colors">Robots.txt</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Crosschecking.Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
