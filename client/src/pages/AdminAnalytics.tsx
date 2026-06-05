import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, Share2, MessageSquare } from "lucide-react";

/**
 * Analytics Dashboard
 * Track article views, engagement, and performance metrics
 */
export function AdminAnalytics() {
  // Fetch articles with view counts
  const { data: articles = [] } = trpc.articles.list.useQuery({
    limit: 1000,
  });

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalViews = articles.reduce((sum, a: any) => sum + (a.viewCount || 0), 0);
    const totalShares = articles.reduce((sum, a: any) => sum + (a.shareCount || 0), 0);
    const avgViewsPerArticle = articles.length > 0 ? Math.round(totalViews / articles.length) : 0;

    // Top articles by views
    const topArticles = [...articles]
      .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);

    // Articles by category
    const categoryStats = articles.reduce((acc: any, article: any) => {
      const category = article.category?.name || "Uncategorized";
      const existing = acc.find((c: any) => c.name === category);
      if (existing) {
        existing.articles += 1;
        existing.views += article.viewCount || 0;
      } else {
        acc.push({
          name: category,
          articles: 1,
          views: article.viewCount || 0,
        });
      }
      return acc;
    }, []);

    // Engagement rate (shares + comments per view)
    const engagementRate = totalViews > 0 ? ((totalShares / totalViews) * 100).toFixed(2) : "0";

    return {
      totalViews,
      totalShares,
      avgViewsPerArticle,
      topArticles,
      categoryStats,
      engagementRate,
      totalArticles: articles.length,
    };
  }, [articles]);

  const COLORS = ["#0062d1", "#00a8e8", "#00c9ff", "#00e5ff", "#00f0ff"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track article performance and reader engagement
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold mt-2">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shares</p>
                <p className="text-3xl font-bold mt-2">{analytics.totalShares.toLocaleString()}</p>
              </div>
              <Share2 className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Views/Article</p>
                <p className="text-3xl font-bold mt-2">{analytics.avgViewsPerArticle}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-3xl font-bold mt-2">{analytics.engagementRate}%</p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Articles */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Top Articles by Views</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topArticles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="viewCount" fill="#0062d1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Views by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryStats}
                  dataKey="views"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analytics.categoryStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Category Stats Table */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Category Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-right py-3 px-4 font-semibold">Articles</th>
                  <th className="text-right py-3 px-4 font-semibold">Total Views</th>
                  <th className="text-right py-3 px-4 font-semibold">Avg Views</th>
                </tr>
              </thead>
              <tbody>
                {analytics.categoryStats.map((category: any, idx: number) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{category.name}</td>
                    <td className="text-right py-3 px-4">{category.articles}</td>
                    <td className="text-right py-3 px-4">{category.views.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      {Math.round(category.views / category.articles)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Articles Detailed */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Top Performing Articles</h3>
          <div className="space-y-4">
            {analytics.topArticles.map((article: any, idx: number) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{idx + 1}. {article.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {article.category?.name}
                  </p>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-sm text-muted-foreground">Views</p>
                    <p className="text-lg font-bold">{article.viewCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shares</p>
                    <p className="text-lg font-bold">{article.shareCount || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
