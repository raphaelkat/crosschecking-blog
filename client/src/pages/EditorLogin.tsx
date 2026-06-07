import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function EditorLogin() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "editor")) {
      window.location.href = "/admin/articles/new";
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <h1 className="text-3xl font-bold text-center mb-2 text-foreground">Editor Login</h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in to create and manage articles
          </p>

          <a href={getLoginUrl("/admin/articles/new")}>
            <Button className="w-full" size="lg">
              Sign In with Manus
            </Button>
          </a>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Only editors and administrators can access this area.
          </p>
        </div>
      </div>
    </div>
  );
}
