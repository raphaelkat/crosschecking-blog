import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { setMetaTags } from "@/lib/seo";
import { getCategoryIcon } from "@/lib/categoryIcons";
import SearchBar from "@/components/SearchBar";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import PartnershipsCarousel from "@/components/PartnershipsCarousel";

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
  const { data: popularCategories, isLoading: popularLoading } = trpc.categories.popular.useQuery({ limit: 6 });
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
      // Keep success message visible for 5 seconds
      setTimeout(() => setSubscribeStatus("idle"), 5000);
    } catch (error) {
      setSubscribeStatus("error");
      // Keep error message visible for 5 seconds
      setTimeout(() => setSubscribeStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-background to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Make Informed Decisions</h1>
            <p className="text-xl text-muted-foreground mb-12">
              In-depth, data-driven comparisons across Tech, AI, Finance, E-commerce, and more. Discover the best solutions for your needs with our expert analysis.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search articles..."
                onSearch={(query) => {
                  window.location.href = `/search?q=${encodeURIComponent(query)}`;
                }}
              />
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

      {/* Popular Categories */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-2">Popular Categories</h2>
              <p className="text-muted-foreground">Explore the most visited topics</p>
            </div>
            <Link href="/categories" className="flex items-center gap-2 text-accent hover:gap-3 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {popularLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 pb-4 min-w-max">
                  {popularCategories?.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="group flex-shrink-0 w-80 p-6 rounded-lg border border-border bg-card hover:bg-accent/5 transition-all"
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="text-accent group-hover:text-accent/80 transition-colors flex-shrink-0">
                          {getCategoryIcon(cat.slug)}
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors flex-1">{cat.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 ml-12">{cat.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ChevronRight className="w-4 h-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
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
      <section className="py-16 md:py-24 bg-white text-foreground">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-4 text-foreground">Stay Updated</h2>
          <p className="text-lg mb-8 text-muted-foreground">Get the latest comparison articles and insights delivered to your inbox.</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0"
              required
            />
            <Button 
              type="submit"
              disabled={subscribeStatus === "loading"}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {subscribeStatus === "loading" && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {subscribeStatus === "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          {subscribeStatus === "success" && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Successfully subscribed!</p>
                <p className="text-sm text-green-700">Check your email for confirmation.</p>
              </div>
            </div>
          )}
          {subscribeStatus === "error" && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Subscription failed</p>
                  <p className="text-sm text-red-700">Please try again later.</p>
                </div>
              </div>
              <Button
                onClick={() => setSubscribeStatus("idle")}
                variant="outline"
                size="sm"
                className="flex-shrink-0 text-red-600 border-red-300 hover:bg-red-100"
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* Partnerships Carousel */}
      <PartnershipsCarousel />
    </div>
  );
}
