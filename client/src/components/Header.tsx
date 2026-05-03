import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import SearchAutocomplete from "./SearchAutocomplete";

const CATEGORIES = [
  { name: "AI & ML", slug: "ai-ml" },
  { name: "SaaS", slug: "saas" },
  { name: "E-commerce", slug: "ecommerce" },
  { name: "Payment", slug: "payment" },
  { name: "Web Dev", slug: "web-dev" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryHover, setCategoryHover] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">✓</span>
            </div>
            <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition">
              Crosschecking
            </h1>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:block w-56">
              <SearchAutocomplete onSearch={(query) => {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
              }} />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href={getLoginUrl()}>
                <Button size="sm">Login</Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className={`${mobileMenuOpen ? "block" : "hidden"} md:block`}>
          <div className="flex flex-col md:flex-row gap-1 md:gap-1">
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <button 
                  className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition whitespace-nowrap duration-200"
                  onMouseEnter={() => setCategoryHover(category.slug)}
                  onMouseLeave={() => setCategoryHover(null)}
                >
                  {category.name}
                </button>
              </Link>
            ))}
            <Link href="/search">
              <button className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition whitespace-nowrap duration-200">
                Search
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
