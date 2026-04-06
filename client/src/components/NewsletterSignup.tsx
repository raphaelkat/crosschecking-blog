import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export interface NewsletterSignupProps {
  variant?: "inline" | "popup" | "sidebar";
  title?: string;
  description?: string;
}

export function NewsletterSignup({
  variant = "inline",
  title = "Stay Updated",
  description = "Get the latest comparison articles and insights delivered to your inbox.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const result = await subscribeMutation.mutateAsync({ email, name });

      if (result.success) {
        setSubmitted(true);
        setEmail("");
        setName("");
        toast.success("Successfully subscribed!");

        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        toast.error("Email already subscribed");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to subscribe");
    }
  };

  if (variant === "inline") {
    return (
      <div className="bg-card border border-border rounded-lg p-8 my-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-accent" />
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <p className="text-muted-foreground mb-6">{description}</p>

          {submitted ? (
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Check your email to confirm your subscription!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={subscribeMutation.isPending}>
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="bg-accent/10 border border-accent rounded-lg p-6">
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {submitted ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
            />
            <Button type="submit" size="sm" className="w-full" disabled={subscribeMutation.isPending}>
              Subscribe
            </Button>
          </form>
        )}
      </div>
    );
  }

  if (variant === "popup") {
    return (
      <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg p-6 max-w-sm z-40">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {submitted ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">Thanks for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={subscribeMutation.isPending}>
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    );
  }

  return null;
}
