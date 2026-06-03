import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit2 } from "lucide-react";

export default function AdminTags() {
  const { data: tags = [], refetch } = trpc.tags.list.useQuery();
  const createTag = trpc.tags.create.useMutation();
  const updateTag = trpc.tags.update.useMutation();
  const deleteTag = trpc.tags.delete.useMutation();

  const [newTag, setNewTag] = useState({ name: "", slug: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTag, setEditTag] = useState({ name: "", slug: "" });

  const handleCreate = async () => {
    if (!newTag.name || !newTag.slug) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await createTag.mutateAsync(newTag);
      setNewTag({ name: "", slug: "" });
      refetch();
      alert("Tag created successfully");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editTag.name || !editTag.slug) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await updateTag.mutateAsync({ id, ...editTag });
      setEditingId(null);
      refetch();
      alert("Tag updated successfully");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      try {
        await deleteTag.mutateAsync({ id });
        refetch();
        alert("Tag deleted successfully");
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-foreground">Add New Tag</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Tag name"
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
          />
          <Input
            placeholder="Tag slug"
            value={newTag.slug}
            onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
          />
          <Button onClick={handleCreate} disabled={createTag.isPending} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Tag
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Slug</th>
              <th className="px-6 py-3 text-right font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-b border-border hover:bg-muted/50 transition">
                {editingId === tag.id ? (
                  <>
                    <td className="px-6 py-4">
                      <Input
                        value={editTag.name}
                        onChange={(e) => setEditTag({ ...editTag, name: e.target.value })}
                        className="w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        value={editTag.slug}
                        onChange={(e) => setEditTag({ ...editTag, slug: e.target.value })}
                        className="w-full"
                      />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(tag.id)}
                        disabled={updateTag.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-foreground">{tag.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{tag.slug}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(tag.id);
                          setEditTag({ name: tag.name, slug: tag.slug });
                        }}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(tag.id)}
                        disabled={deleteTag.isPending}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {tags.length === 0 && (
          <div className="px-6 py-8 text-center text-muted-foreground">
            No tags yet. Create your first tag above.
          </div>
        )}
      </div>
    </div>
  );
}
