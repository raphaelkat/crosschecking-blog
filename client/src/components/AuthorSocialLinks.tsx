import { Mail, Linkedin, Twitter, Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthorSocialLinksProps {
  author: {
    id: number;
    name: string;
    email?: string;
    biography?: string;
    profilePhoto?: string;
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    github?: string;
  };
  variant?: "inline" | "card" | "footer";
}

/**
 * Author Social Links Component
 * Display author contact and social media links
 */
export function AuthorSocialLinks({
  author,
  socialLinks,
  variant = "inline",
}: AuthorSocialLinksProps) {
  if (variant === "card") {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start gap-4">
          {author.profilePhoto && (
            <img
              src={author.profilePhoto}
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">{author.name}</h4>
            {author.biography && (
              <p className="text-sm text-muted-foreground mb-3">
                {author.biography}
              </p>
            )}
            <div className="flex gap-2 flex-wrap">
              {author.email && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  title="Send email"
                >
                  <a href={`mailto:${author.email}`}>
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.twitter && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  title="Follow on Twitter"
                >
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.linkedin && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  title="Connect on LinkedIn"
                >
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.website && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  title="Visit website"
                >
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.github && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  title="View GitHub profile"
                >
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Connect with {author.name}:</span>
        <div className="flex gap-2">
          {author.email && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
              title="Send email"
            >
              <a href={`mailto:${author.email}`}>
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          )}
          {socialLinks?.twitter && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
              title="Follow on Twitter"
            >
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
          )}
          {socialLinks?.linkedin && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
              title="Connect on LinkedIn"
            >
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          )}
          {socialLinks?.website && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
              title="Visit website"
            >
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-4 h-4" />
              </a>
            </Button>
          )}
          {socialLinks?.github && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
              title="View GitHub profile"
            >
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="flex gap-2 items-center">
      {author.email && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          title="Send email"
        >
          <a href={`mailto:${author.email}`}>
            <Mail className="w-4 h-4" />
          </a>
        </Button>
      )}
      {socialLinks?.twitter && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          title="Follow on Twitter"
        >
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </Button>
      )}
      {socialLinks?.linkedin && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          title="Connect on LinkedIn"
        >
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </Button>
      )}
      {socialLinks?.website && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          title="Visit website"
        >
          <a
            href={socialLinks.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="w-4 h-4" />
          </a>
        </Button>
      )}
      {socialLinks?.github && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          title="View GitHub profile"
        >
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
