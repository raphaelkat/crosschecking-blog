import { Link } from "wouter";

const FOOTER_LINKS = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
  resources: [
    { label: "Blog", href: "/" },
    { label: "Search", href: "/search" },
  ],
  categories: [
    { label: "Tech & Gadgets", href: "/category/tech-gadgets" },
    { label: "AI Tools", href: "/category/ai-tools-automation" },
    { label: "Online Business", href: "/category/online-business-side-hustles" },
    { label: "E-commerce", href: "/category/ecommerce-marketing" },
    { label: "SaaS Tools", href: "/category/software-saas-tools" },
    { label: "Travel", href: "/category/travel-booking-platforms" },
  ],
};

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    url: "https://web.facebook.com/profile.php?id=61574703702651",
    icon: "facebook",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/crosschecking.blog",
    icon: "instagram",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@crosscheckingblog",
    icon: "youtube",
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/blogchecking",
    icon: "twitter",
  },
  {
    name: "Substack",
    url: "https://substack.com/@crosschecking",
    icon: "substack",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@crosschecking.blog",
    icon: "tiktok",
  },
];

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "facebook":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.54c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02V8.98l5.92 3.03-5.92 3.01z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-3 1" />
        </svg>
      );
    case "substack":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.539 8.242H1.46V4h21.079v4.242zM1.46 10.042v10.017c0 1.142.9 2.041 2.041 2.041h15.998c1.139 0 2.042-.899 2.042-2.041v-10.017H1.46zm18.682 3.645c.5 0 .9-.406.9-.929s-.4-.928-.9-.928-.899.406-.899.928.399.929.899.929z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20" style={{ backgroundColor: '#e2e3e8' }}>
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Crosschecking</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In-depth, data-driven comparisons across Tech, AI, Finance, E-commerce, and more. Discover the best solutions for your needs with our expert analysis.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-primary transition">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-primary transition">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-primary transition">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-primary transition">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="border-t border-border pt-8 mb-8">
          <h4 className="font-semibold text-foreground mb-4 text-center">Connect With Us</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-[#00F2FF] transition-all duration-300 transform hover:scale-110"
                aria-label={`Visit us on ${social.name}`}
                title={social.name}
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
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
