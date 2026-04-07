import { useParams, Link } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, ChevronRight } from "lucide-react";
import { setMetaTags } from "@/lib/seo";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();

  const { data: category } = trpc.categories.getBySlug.useQuery({ slug: slug || "" });
  const { data: articles, isLoading } = trpc.articles.list.useQuery(
    { categoryId: category?.id || 0, limit: 20 },
    { enabled: !!category?.id }
  );

  // Set SEO meta tags for category
  useEffect(() => {
    if (category) {
      setMetaTags({
        title: `${category.name} - Crosschecking.Blog`,
        description: category.description || `Explore our collection of ${category.name} articles and comparisons`,
        keyword: category.name,
        url: `${window.location.origin}/category/${category.slug}`,
        type: "website",
      });
    }
  }, [category]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Category Not Found</h1>
          <Link href="/">
            <a className="text-accent hover:underline">Back to Home</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-2xl font-bold font-serif">Crosschecking</a>
          </Link>
        </div>
      </header>

      {/* Category Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-serif font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-xl text-foreground/80 leading-relaxed">{category.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 md:py-24">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="article-grid">
              {articles.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <a className="article-card">
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
                    <div className="flex items-center gap-2 text-accent hover:gap-3 transition-all">
                      Read More <ChevronRight className="w-4 h-4" />
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
