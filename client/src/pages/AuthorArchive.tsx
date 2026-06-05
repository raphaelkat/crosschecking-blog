import { useParams } from "wouter";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Mail, Linkedin, Twitter, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * Author Archive Page
 * Display all articles by a specific author
 */
export function AuthorArchive() {
  const { authorId } = useParams<{ authorId: string }>();
  const [, setLocation] = useLocation();
  const [author, setAuthor] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch author details and articles
  const { data: allUsers = [] } = trpc.users.list.useQuery();
  const { data: allArticles = [] } = trpc.articles.list.useQuery({});

  useEffect(() => {
    if (!authorId) return;

    const fetchAuthorData = () => {
      const foundAuthor = allUsers.find(
        (u: any) => u.id === parseInt(authorId)
      );

      if (foundAuthor) {
        setAuthor(foundAuthor);
      }

      const authorArticles = allArticles.filter(
        (a: any) => a.authorId === parseInt(authorId)
      );

      setArticles(authorArticles || []);
      setIsLoading(false);
    };

    fetchAuthorData();
  }, [authorId, allUsers, allArticles]);

  if (allUsers.length === 0 || allArticles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Loading author information...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
          <Button onClick={() => setLocation("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-6 items-start">
            {/* Author Avatar */}
            {author.profilePhoto && (
              <img
                src={author.profilePhoto}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
            )}

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{author.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">
                {author.role === "editor" ? "Editor" : "Author"}
              </p>

              {author.biography && (
                <p className="text-base mb-4 max-w-2xl">{author.biography}</p>
              )}

              {/* Social Links */}
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${author.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Articles</p>
              <p className="text-3xl font-bold">{articles.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-lg font-semibold">
                {new Date(author.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="text-lg font-semibold">
                {formatDistanceToNow(new Date(author.lastSignedIn), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Articles by {author.name}</h2>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No articles published yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: any }) {
  const [, setLocation] = useLocation();

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() =>
        setLocation(
          `/articles/${article.slug || article.id}`
        )
      }
    >
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {article.category && (
          <p className="text-xs font-semibold text-primary uppercase mb-2">
            {article.category.name}
          </p>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {article.excerpt || article.description}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {formatDistanceToNow(new Date(article.publishedAt), {
              addSuffix: true,
            })}
          </span>
          <span>{article.viewCount || 0} views</span>
        </div>
      </div>
    </Card>
  );
}
