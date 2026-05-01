import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">Crosschecking</h3>
            <p className="text-sm text-muted-foreground">
              In-depth, data-driven comparisons to help you make informed decisions.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/ai-ml">
                  <span className="text-muted-foreground hover:text-foreground transition cursor-pointer">
                    AI & Machine Learning
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/category/saas">
                  <span className="text-muted-foreground hover:text-foreground transition cursor-pointer">
                    SaaS & Productivity
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/category/ecommerce">
                  <span className="text-muted-foreground hover:text-foreground transition cursor-pointer">
                    E-commerce
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/category/payment">
                  <span className="text-muted-foreground hover:text-foreground transition cursor-pointer">
                    Payment Solutions
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search">
                  <span className="text-muted-foreground hover:text-foreground transition cursor-pointer">
                    Search Articles
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Affiliate Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Crosschecking. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for data-driven decisions
          </p>
        </div>
      </div>
    </footer>
  );
}
