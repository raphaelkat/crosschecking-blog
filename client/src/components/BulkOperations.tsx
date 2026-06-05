import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import {
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  Archive,
  Copy,
} from "lucide-react";

interface BulkOperationsProps {
  selectedIds: number[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

/**
 * Bulk Operations Component
 * Perform batch operations on multiple articles
 */
export function BulkOperations({
  selectedIds,
  onClearSelection,
  onRefresh,
}: BulkOperationsProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    action: string;
    title: string;
    description: string;
  } | null>(null);

  // Mutations
  const publishArticles = trpc.articles.bulkPublish.useMutation({
    onSuccess: () => {
      onRefresh();
      onClearSelection();
    },
  });

  const unpublishArticles = trpc.articles.bulkUnpublish.useMutation({
    onSuccess: () => {
      onRefresh();
      onClearSelection();
    },
  });

  const deleteArticles = trpc.articles.bulkDelete.useMutation({
    onSuccess: () => {
      onRefresh();
      onClearSelection();
    },
  });

  // Duplicate not implemented yet
  // const duplicateArticles = trpc.articles.bulkDuplicate.useMutation({...});

  if (selectedIds.length === 0) {
    return null;
  }

  const handleAction = (action: string) => {
    switch (action) {
      case "publish":
        setConfirmDialog({
          action: "publish",
          title: "Publish Articles",
          description: `Are you sure you want to publish ${selectedIds.length} article(s)? They will become visible to the public.`,
        });
        break;
      case "unpublish":
        setConfirmDialog({
          action: "unpublish",
          title: "Unpublish Articles",
          description: `Are you sure you want to unpublish ${selectedIds.length} article(s)? They will no longer be visible to the public.`,
        });
        break;
      case "delete":
        setConfirmDialog({
          action: "delete",
          title: "Delete Articles",
          description: `Are you sure you want to delete ${selectedIds.length} article(s)? This action cannot be undone.`,
        });
        break;
      // Duplicate not implemented yet
    }
  };

  const executeAction = () => {
    if (!confirmDialog) return;

    switch (confirmDialog.action) {
      case "publish":
        publishArticles.mutate({ ids: selectedIds });
        break;
      case "unpublish":
        unpublishArticles.mutate({ ids: selectedIds });
        break;
      case "delete":
        deleteArticles.mutate({ ids: selectedIds });
        break;
      // Duplicate not implemented yet
    }

    setConfirmDialog(null);
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg border border-border">
        <div className="flex-1">
          <p className="font-semibold">
            {selectedIds.length} article{selectedIds.length !== 1 ? "s" : ""} selected
          </p>
          <p className="text-sm text-muted-foreground">
            Choose an action to perform on the selected items
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                <MoreVertical className="w-4 h-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleAction("publish")}
                disabled={publishArticles.isPending}
              >
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("unpublish")}
                disabled={unpublishArticles.isPending}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Unpublish
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAction("delete")}
                disabled={deleteArticles.isPending}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!confirmDialog}
        onOpenChange={() => setConfirmDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeAction}
              className={
                confirmDialog?.action === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              {confirmDialog?.action === "delete" ? "Delete" : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * Checkbox for selecting items in bulk operations
 */
export function BulkSelectCheckbox({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      className="cursor-pointer"
    />
  );
}
