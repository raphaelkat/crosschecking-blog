import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card } from "@/components/ui/card";

export default function AnalyticsDashboard() {
  const { data: articles } = trpc.articles.list.useQuery({ limit: 100 });

  // Calculate analytics
  const totalViews = (articles || []).reduce((sum: number, article: any) => sum + (article.views || 0), 0) || 0;
  const totalArticles = (articles || []).length || 0;
  const avgViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

  // Top articles by views
  const topArticles = (articles || [])
    .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((article: any) => ({
      name: article.title.substring(0, 20),
      views: article.views || 0,
    }));

  // Views over time (mock data)
  const viewsOverTime = [
    { date: "Mon", views: 120 },
    { date: "Tue", views: 200 },
    { date: "Wed", views: 150 },
    { date: "Thu", views: 280 },
    { date: "Fri", views: 190 },
    { date: "Sat", views: 230 },
    { date: "Sun", views: 200 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Articles</h3>
          <p className="text-3xl font-bold">{totalArticles}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Views</h3>
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Views</h3>
          <p className="text-3xl font-bold">{avgViews.toLocaleString()}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Articles */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Articles by Views</h3>
          {topArticles.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topArticles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">No data available</p>
          )}
        </Card>
      </div>

      {/* Article List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Article Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">Views</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {(articles || []).slice(0, 10).map((article: any) => (
                <tr key={article.id} className="border-b border-border hover:bg-muted transition">
                  <td className="py-3 px-4">{article.title.substring(0, 40)}</td>
                  <td className="py-3 px-4">{(article.views || 0).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      article.status === "published"
                        ? "bg-green-100 text-green-800"
                        : article.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
