import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Mail, Trash2, Download, Search, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * Newsletter Subscriber Management Page
 * Admin interface for managing newsletter subscribers
 */
export function AdminNewsletterSubscribers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "unsubscribed">("all");

  // Fetch subscribers
  const { data: subscribers = [], isLoading } = trpc.newsletter.listSubscribers.useQuery(
    undefined,
    { enabled: true }
  );

  // Delete subscriber mutation
  const deleteSubscriber = trpc.newsletter.deleteSubscriber.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      trpc.useUtils().newsletter.listSubscribers.invalidate();
    },
  });

  // Filter and search subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub: any) => {
      const matchesSearch =
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && !sub.unsubscribedAt) ||
        (filterStatus === "unsubscribed" && sub.unsubscribedAt);

      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchQuery, filterStatus]);

  // Export subscribers to CSV
  const handleExport = () => {
    const csv = [
      ["Email", "Name", "Subscribed Date", "Status"],
      ...filteredSubscribers.map((sub: any) => [
        sub.email,
        sub.name || "N/A",
        new Date(sub.createdAt).toLocaleDateString(),
        sub.unsubscribedAt ? "Unsubscribed" : "Active",
      ]),
    ]
      .map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your newsletter subscriber list
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Subscribers</p>
            <p className="text-3xl font-bold">{subscribers.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-3xl font-bold text-green-600">
              {subscribers.filter((s: any) => !s.unsubscribedAt).length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Unsubscribed</p>
            <p className="text-3xl font-bold text-red-600">
              {subscribers.filter((s: any) => s.unsubscribedAt).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              onClick={() => setFilterStatus("active")}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={filterStatus === "unsubscribed" ? "default" : "outline"}
              onClick={() => setFilterStatus("unsubscribed")}
              size="sm"
            >
              Unsubscribed
            </Button>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading subscribers...
                  </TableCell>
                </TableRow>
              ) : filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No subscribers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber: any) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-mono text-sm">
                      {subscriber.email}
                    </TableCell>
                    <TableCell>{subscriber.name || "—"}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(subscriber.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscriber.unsubscribedAt
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {subscriber.unsubscribedAt ? "Unsubscribed" : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSubscriber(subscriber)}
                        className="mr-2"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            confirm(
                              `Remove ${subscriber.email} from subscribers?`
                            )
                          ) {
                            deleteSubscriber.mutate({
                              id: subscriber.id,
                            });
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Subscriber Details Dialog */}
        <Dialog
          open={!!selectedSubscriber}
          onOpenChange={() => setSelectedSubscriber(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subscriber Details</DialogTitle>
              <DialogDescription>
                Information about this newsletter subscriber
              </DialogDescription>
            </DialogHeader>
            {selectedSubscriber && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <p className="font-mono text-sm mt-1">{selectedSubscriber.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Name</label>
                  <p className="text-sm mt-1">{selectedSubscriber.name || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Subscribed</label>
                  <p className="text-sm mt-1">
                    {new Date(selectedSubscriber.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Status</label>
                  <p className="text-sm mt-1">
                    {selectedSubscriber.unsubscribedAt
                      ? `Unsubscribed on ${new Date(
                          selectedSubscriber.unsubscribedAt
                        ).toLocaleString()}`
                      : "Active"}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
