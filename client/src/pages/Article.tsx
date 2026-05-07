import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronRight, Share2, MessageCircle } from "lucide-react";
import { Streamdown } from "streamdown";
import { setMetaTags, setArticleSchema } from "@/lib/seo";
import { TableOfContents } from "@/components/TableOfContents";
import { ProsCons } from "@/components/ProsCons";
import { FAQ } from "@/components/FAQ";
import { Breadcrumb } from "@/components/Breadcrumb";
import ShareButtons from "@/components/ShareButtons";

export default function Article() {
  const [location] = useLocation();
  const slug = location.split('/').pop();
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentStatus, setCommentStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { data: article, isLoading } = trpc.articles.getBySlug.useQuery({ slug: slug || "" });

  // Set SEO meta tags and schema
  useEffect(() => {
    if (article) {
      setMetaTags({
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt || "",
        keyword: article.focusKeyword || undefined,
        url: `${window.location.origin}/article/${article.slug}`,
        type: "article",
        author: "Crosschecking.Blog",
        publishedDate: new Date(article.createdAt),
        modifiedDate: new Date(article.updatedAt),
      });

      setArticleSchema({
        title: article.title,
        description: article.excerpt || "",
        author: "Crosschecking.Blog",
        datePublished: new Date(article.createdAt),
        dateModified: new Date(article.updatedAt),
        url: `${window.location.origin}/article/${article.slug}`,
      });
    }
  }, [article]);
  const { data: relatedArticles } = trpc.articles.related.useQuery(
    { articleId: article?.id || 0, limit: 3 },
    { enabled: !!article?.id }
  );
  const { data: comments } = trpc.comments.listByArticle.useQuery(
    { articleId: article?.id || 0 },
    { enabled: !!article?.id }
  );
  const createComment = trpc.comments.create.useMutation();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentAuthor || !commentEmail || !commentContent) return;

    setCommentStatus("loading");
    try {
      await createComment.mutateAsync({
        articleId: article.id,
        authorName: commentAuthor,
        authorEmail: commentEmail,
        content: commentContent,
      });
      setCommentStatus("success");
      setCommentAuthor("");
      setCommentEmail("");
      setCommentContent("");
      setTimeout(() => setCommentStatus("idle"), 3000);
    } catch (error) {
      setCommentStatus("error");
      setTimeout(() => setCommentStatus("idle"), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Article Not Found</h1>
          <Link href="/" asChild>
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <span>Updated {new Date(article.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <h1 className="text-5xl font-serif font-bold mb-4 leading-tight">{article.title}</h1>
            <p className="text-xl text-foreground/80 leading-relaxed">{article.excerpt}</p>
          </div>

          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Article" },
            ]}
          />

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-12 -mx-4 md:mx-0">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Table of Contents */}
          <TableOfContents content={article.content as string} />

          {/* TL;DR Section */}
          {article.tldr && (
            <div className="cta-box bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500">
              <h3 className="font-bold mb-2 text-sm uppercase tracking-wide">TL;DR (Too Long; Didn't Read)</h3>
              <p className="text-sm leading-relaxed">{article.tldr}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <Streamdown>{article.content as string}</Streamdown>
          </div>

          {/* Share Buttons */}
          <div className="my-12 py-6 border-t border-border">
            <ShareButtons
              title={article.title}
              url={window.location.href}
              description={article.excerpt || undefined}
            />
          </div>

          {/* Affiliate Disclosure */}
          <div className="affiliate-disclosure">
            <strong>Affiliate Disclosure:</strong> This article contains affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you. This helps support our research and content creation.
          </div>

          {/* Affiliate Links */}
          {article.affiliateLinks && article.affiliateLinks.length > 0 && (
            <div className="my-12">
              <h2 className="text-2xl font-serif font-bold mb-6">Recommended Products</h2>
              <div className="space-y-4">
                {article.affiliateLinks.map((link) => (
                  <div key={link.id} className="cta-box bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{link.productName}</h3>
                        {link.affiliateNetwork && (
                          <p className="text-sm text-muted-foreground mb-3">via {link.affiliateNetwork}</p>
                        )}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button>Check Price</Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="my-12 py-12 border-t border-b border-border">
              <h2 className="text-2xl font-serif font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.id} href={`/article/${related.slug}`}>
                    <a className="group">
                      {related.featuredImage && (
                        <img
                          src={related.featuredImage}
                          alt={related.title}
                          className="w-full h-40 object-cover rounded-lg mb-3 group-hover:opacity-90 transition-opacity"
                        />
                      )}
                      <h3 className="font-bold group-hover:text-accent transition-colors">{related.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{related.excerpt?.substring(0, 100)}...</p>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="my-12 py-12 border-t border-border">
            <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Comments ({comments?.length || 0})
            </h2>

            {/* Comment Form */}
            <div className="bg-secondary rounded-lg p-6 mb-8 border border-border">
              <h3 className="font-bold mb-4">Leave a Comment</h3>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    required
                  />
                </div>
                <textarea
                  placeholder="Your Comment"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground min-h-32 resize-none"
                  required
                />
                <Button type="submit" disabled={commentStatus === "loading"}>
                  {commentStatus === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Comment"
                  )}
                </Button>
                {commentStatus === "success" && (
                  <p className="text-sm text-green-600">Comment submitted! It will appear after moderation.</p>
                )}
                {commentStatus === "error" && (
                  <p className="text-sm text-red-600">Error submitting comment. Please try again.</p>
                )}
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                Comments on this platform are moderated and handled exclusively by our administrative team to ensure a high-quality discussion.
              </p>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-accent pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold">{comment.authorName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground/80">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="bg-accent text-accent-foreground rounded-lg p-8 my-12 text-center">
            <h3 className="text-2xl font-serif font-bold mb-3">Stay Updated</h3>
            <p className="mb-6 opacity-90">
              Subscribe to our newsletter for more in-depth analysis and comparisons.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex gap-2 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-accent-foreground text-accent"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
}
