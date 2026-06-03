import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminEditors() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "editor" as const,
    profilePhoto: "",
    biography: "",
  });

  const { data: users = [], isLoading, refetch } = trpc.users.list.useQuery();
  const createUser = trpc.users.create.useMutation();
  const updateUser = trpc.users.update.useMutation();
  const deleteUser = trpc.users.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync(formData);
      toast.success("Editor created successfully");
      setFormData({ email: "", name: "", role: "editor", profilePhoto: "", biography: "" });
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create editor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteUser.mutateAsync({ id });
      toast.success("Editor deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete editor");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editors & Users</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Editor
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Profile Photo URL</label>
              <Input
                value={formData.profilePhoto}
                onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Biography</label>
              <textarea
                className="w-full border border-border rounded-md p-2"
                rows={3}
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? "Creating..." : "Create Editor"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Role</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.profilePhoto && (
                      <img
                        src={user.profilePhoto}
                        alt={user.name || ""}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span>{user.name || "N/A"}</span>
                  </div>
                </td>
                <td className="p-4 text-sm">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === "admin" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" :
                    user.role === "editor" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-muted rounded transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
