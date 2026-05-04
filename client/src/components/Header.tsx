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

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Top Row: Logo + Centered Search + Actions */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Logo - Left */}
          <Link href="/" className="flex-shrink-0 cursor-pointer group">
            <img 
              src="/manus-storage/horizontal_618530b1.png" 
              alt="Crosschecking.blog" 
              className="h-10 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Centered Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-center px-4 max-w-md mx-auto">
            <div className="w-full">
              <SearchAutocomplete onSearch={(query) => {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
              }} />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
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

        {/* Mobile Search - Shown only on mobile */}
        <div className="md:hidden mb-4">
          <SearchAutocomplete onSearch={(query) => {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
          }} />
        </div>

        {/* Category Navigation */}
        <nav className={`${mobileMenuOpen ? "block" : "hidden"} md:block`}>
          <div className="flex flex-col md:flex-row gap-1 md:gap-1">
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <button 
                  className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition whitespace-nowrap duration-200"
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
