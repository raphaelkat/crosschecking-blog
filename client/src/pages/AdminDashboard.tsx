import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import AdminEditors from "./AdminEditors";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"articles" | "categories" | "comments" | "editors">("articles");

  const { data: articles, isLoading: articlesLoading } = trpc.articles.list.useQuery({
    limit: 100,
  });
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: pendingComments } = trpc.comments.listPending.useQuery();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You must be an admin to access this page.</p>
          <Link href="/">
            <a>
              <Button>Back to Home</Button>
            </a>
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin: {user.name}</span>
            <Link href="/">
              <a className="text-sm text-accent hover:underline">Exit Admin</a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog content, categories, and comments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("articles")}
            className={`pb-4 px-2 font-bold transition-colors ${
              activeTab === "articles"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Articles ({articles?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 px-2 font-bold transition-colors ${
              activeTab === "categories"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Categories ({categories?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-4 px-2 font-bold transition-colors ${
              activeTab === "comments"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Comments ({pendingComments?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("editors")}
            className={`pb-4 px-2 font-bold transition-colors ${
              activeTab === "editors"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Editors & Users
          </button>
        </div>

        {/* Articles Tab */}
        {activeTab === "articles" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Articles</h2>
              <Link href="/admin/articles/new">
                <a>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Article
                  </Button>
                </a>
              </Link>
            </div>

            {articlesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin w-8 h-8" />
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {article.status} • {new Date(article.createdAt).toLocaleDateString()} • {article.viewCount} views
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/article/${article.slug}`}>
                        <a>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </a>
                      </Link>
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <a>
                          <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </a>
                      </Link>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No articles yet. Create your first one!</p>
                <Link href="/admin/articles/new">
                  <a>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Article
                    </Button>
                  </a>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Categories</h2>
            {categories && categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/category/${cat.slug}`}>
                        <a>
                          <Button variant="outline" size="sm" className="flex-1">
                            View
                          </Button>
                        </a>
                      </Link>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No categories found.</p>
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Pending Comments</h2>
            {pendingComments && pendingComments.length > 0 ? (
              <div className="space-y-4">
                {pendingComments.map((comment) => (
                  <div key={comment.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">{comment.authorName}</h3>
                        <p className="text-sm text-muted-foreground">{comment.authorEmail}</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                    </div>
                    <p className="mb-4 text-foreground">{comment.content}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="flex-1">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pending comments.</p>
            )}
          </div>
        )}

        {/* Editors Tab */}
        {activeTab === "editors" && (
          <AdminEditors />
        )}
      </div>
    </div>
  );
}
