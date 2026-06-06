import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";


const CATEGORIES = [
  { name: "Tech & Gadgets", slug: "tech-gadgets" },
  { name: "AI Tools & Automation", slug: "ai-tools-automation" },
  { name: "Online Business", slug: "online-business-side-hustles" },
  { name: "E-commerce & Marketing", slug: "ecommerce-marketing" },
  { name: "Web Hosting & Domains", slug: "web-hosting-domains" },
  { name: "Software & SaaS", slug: "software-saas-tools" },
  { name: "Online Courses", slug: "online-courses-education" },
  { name: "Digital Marketing", slug: "digital-marketing-tools" },
  { name: "Payment Solutions", slug: "payment-solutions-mobile-money" },
  { name: "Apps & Mobile", slug: "apps-mobile-tools" },
  { name: "Gaming & Entertainment", slug: "gaming-entertainment-platforms" },
  { name: "Streaming Services", slug: "streaming-services-big-events" },
  { name: "Travel & Booking", slug: "travel-booking-platforms" },
  { name: "Health & Fitness", slug: "health-fitness-apps-tools" },
  { name: "Lifestyle Products", slug: "lifestyle-products-services" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  // Extract category slug from current URL
  const currentCategorySlug = location.startsWith("/category/")
    ? location.split("/category/")[1]
    : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border shadow-sm" style={{ backgroundColor: '#e2e3e8' }}>
      <div className="container mx-auto px-4 py-3">
        {/* Top Row: Logo + Actions */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Logo - Left */}
          <Link href="/" className="flex-shrink-0 cursor-pointer group">
            <img 
              src="/manus-storage/horizontal_618530b1.png" 
              alt="Crosschecking.blog" 
              className="h-10 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Categories Dropdown - Hidden on mobile */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition duration-200"
              >
                Categories
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoriesDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-card border-2 border-border rounded-lg shadow-xl py-1 z-50 max-h-[60vh] overflow-y-auto">
                  {CATEGORIES.map((category) => {
                    const isActive = currentCategorySlug === category.slug;
                    return (
                      <Link 
                        key={category.slug} 
                        href={`/category/${category.slug}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        <button className={`w-full text-left px-4 py-2 text-sm transition duration-150 ${
                          isActive 
                            ? "bg-primary text-primary-foreground font-semibold" 
                            : "text-foreground hover:bg-primary/10 hover:text-primary"
                        }`}>
                          {category.name}
                        </button>
                      </Link>
                    );
                  })}
                  <div className="border-t border-border my-1" />
                  <Link 
                    href="/categories"
                    onClick={() => setCategoriesDropdownOpen(false)}
                  >
                    <button className="w-full text-left px-4 py-2 text-sm text-accent font-semibold hover:bg-accent/10 transition duration-150">
                      View All Categories
                    </button>
                  </Link>
                </div>
              )}
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

        {/* Category Navigation - Mobile */}
        <nav className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden max-h-[70vh] overflow-y-auto`}>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((category) => {
              const isActive = currentCategorySlug === category.slug;
              return (
                <Link key={category.slug} href={`/category/${category.slug}`}>
                  <button 
                    className={`w-full text-left px-3 py-2 text-sm font-medium transition duration-150 rounded-md ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:text-primary hover:bg-primary/10"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </button>
                </Link>
              );
            })}
            <Link href="/search">
              <button 
                className="w-full text-left px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition whitespace-nowrap duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
