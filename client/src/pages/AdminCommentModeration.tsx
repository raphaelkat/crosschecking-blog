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
import { Check, X, Eye, Trash2, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * Comments Moderation System
 * Admin interface for reviewing and moderating article comments
 */
export function AdminCommentModeration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved">("pending");

  // Fetch pending comments
  const { data: pendingComments = [], isLoading } = trpc.comments.listPending.useQuery(
    undefined,
    { enabled: true }
  );

  // Approve comment mutation
  const approveComment = trpc.comments.approve.useMutation({
    onSuccess: () => {
      trpc.useUtils().comments.listPending.invalidate();
      setSelectedComment(null);
    },
  });

  // Delete comment mutation
  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => {
      trpc.useUtils().comments.listPending.invalidate();
      setSelectedComment(null);
    },
  });

  // Filter comments
  const filteredComments = useMemo(() => {
    return pendingComments.filter((comment: any) => {
      const matchesSearch =
        comment.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.authorEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.content?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "pending" && !comment.isApproved) ||
        (filterStatus === "approved" && comment.isApproved);

      return matchesSearch && matchesStatus;
    });
  }, [pendingComments, searchQuery, filterStatus]);

  const pendingCount = pendingComments.filter((c: any) => !c.isApproved).length;
  const approvedCount = pendingComments.filter((c: any) => c.isApproved).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Comment Moderation</h1>
          <p className="text-muted-foreground mt-1">
            Review and moderate article comments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Comments</p>
            <p className="text-3xl font-bold">{pendingComments.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by author, email, or content..."
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
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              onClick={() => setFilterStatus("approved")}
              size="sm"
            >
              Approved
            </Button>
          </div>
        </div>

        {/* Comments Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading comments...
                  </TableCell>
                </TableRow>
              ) : filteredComments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No comments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredComments.map((comment: any) => (
                  <TableRow key={comment.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{comment.authorName}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {comment.authorEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">{comment.content}</p>
                    </TableCell>
                    <TableCell className="text-sm">
                      Article #{comment.articleId}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          comment.isApproved
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                        }`}
                      >
                        {comment.isApproved ? "Approved" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedComment(comment)}
                        title="View full comment"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!comment.isApproved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            approveComment.mutate({ id: comment.id });
                          }}
                          className="text-green-600 hover:text-green-700"
                          title="Approve comment"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this comment?")) {
                            deleteComment.mutate({ id: comment.id });
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                        title="Delete comment"
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

        {/* Comment Details Dialog */}
        <Dialog
          open={!!selectedComment}
          onOpenChange={() => setSelectedComment(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Comment Details</DialogTitle>
              <DialogDescription>
                Review the full comment content
              </DialogDescription>
            </DialogHeader>
            {selectedComment && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Author</label>
                  <p className="text-sm mt-1">{selectedComment.authorName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <p className="font-mono text-sm mt-1">
                    {selectedComment.authorEmail}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Article ID</label>
                  <p className="text-sm mt-1">{selectedComment.articleId}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Date</label>
                  <p className="text-sm mt-1">
                    {new Date(selectedComment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Content</label>
                  <div className="bg-secondary/50 p-3 rounded mt-1 max-h-48 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedComment.content}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  {!selectedComment.isApproved && (
                    <Button
                      onClick={() => {
                        approveComment.mutate({ id: selectedComment.id });
                      }}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Comment
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Delete this comment?")) {
                        deleteComment.mutate({ id: selectedComment.id });
                      }
                    }}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Comment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
