import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";

export default function ArticleEditor() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/admin/articles/:id/edit");
  const isEditing = match && params?.id !== "new";

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    categoryId: "",
    status: "draft" as "draft" | "published" | "scheduled",
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    tldr: "",
  });

  const { data: categories } = trpc.categories.list.useQuery();
  // For now, we'll load article data from the list and find it
  // In a real app, you'd want to add a getById procedure
  const { data: articles } = trpc.articles.list.useQuery({ limit: 1000 });
  const article = isEditing
    ? articles?.find((a) => a.id === parseInt(params?.id || "0"))
    : undefined;
  const articleLoading = false;

  const createMutation = trpc.articles.create.useMutation();
  const updateMutation = trpc.articles.update.useMutation();

  useEffect(() => {
    if (article && isEditing) {
      setFormData({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt || "",
        categoryId: article.categoryId.toString(),
        status: article.status,
        metaTitle: article.metaTitle || "",
        metaDescription: article.metaDescription || "",
        focusKeyword: article.focusKeyword || "",
        tldr: article.tldr || "",
      });
    }
  }, [article, isEditing]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (isEditing) {
            if (article) {
        await updateMutation.mutateAsync({
          id: article.id,
          ...formData,
          categoryId: parseInt(formData.categoryId),
        });
      }
        toast.success("Article updated successfully");
      } else {
        const result = await createMutation.mutateAsync({
          ...formData,
          categoryId: parseInt(formData.categoryId),
        });
        toast.success("Article created successfully");
      }
      setLocation("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save article");
    }
  };

  // No loading state needed since we're fetching from list

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/admin">
            <a className="text-2xl font-bold font-serif">Crosschecking</a>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <a className="text-sm text-muted-foreground hover:text-foreground">Back to Admin</a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">
            {isEditing ? "Edit Article" : "Create New Article"}
          </h1>
          <p className="text-muted-foreground">Write and publish your comparison article</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., ChatGPT vs Claude: Which AI is Best for 2026?"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., chatgpt-vs-claude-2026"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Used in the URL</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the article"
                rows={2}
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Content</h2>

            <div>
              <label className="block text-sm font-medium mb-2">TL;DR (Too Long; Didn't Read) *</label>
              <Textarea
                value={formData.tldr}
                onChange={(e) => setFormData({ ...formData, tldr: e.target.value })}
                placeholder="Quick summary for readers in a hurry"
                rows={2}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.tldr.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Main Content *</label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write your article content here."
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">SEO Optimization</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <Input
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO title (60 characters recommended)"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.metaTitle.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO description (160 characters recommended)"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.metaDescription.length}/160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Focus Keyword</label>
              <Input
                value={formData.focusKeyword}
                onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                placeholder="Main keyword for SEO"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link href="/admin">
              <a>
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </a>
            </Link>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Update Article" : "Create Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
