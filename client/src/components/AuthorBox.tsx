import { Link } from "wouter";

interface AuthorBoxProps {
  author: {
    id: number;
    name: string | null;
    profilePhoto: string | null;
    biography: string | null;
  };
}

export function AuthorBox({ author }: AuthorBoxProps) {
  if (!author) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 my-8">
      <div className="flex gap-4">
        {author.profilePhoto && (
          <img 
            src={author.profilePhoto} 
            alt={author.name || "Author"}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {author.name || "Anonymous Author"}
          </h3>
          {author.biography && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {author.biography}
            </p>
          )}
          <Link href={`/author/${author.id}`}>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition">
              View all articles by {author.name?.split(" ")[0] || "author"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
