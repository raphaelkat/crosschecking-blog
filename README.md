# Crosschecking.Blog - High-Authority Comparative Analysis & Reviews Platform

A professional, SEO-optimized affiliate blog platform built with React 19, Express, tRPC, and MySQL/TiDB. Perfect for creating in-depth comparison articles that rank on Google and convert readers into customers through strategic affiliate recommendations.

## 🎯 Features

### Core Platform
- **Professional Editorial Design** - Sophisticated serif typography (Playfair Display + Lora) with minimal color palette
- **Dark/Light Theme Support** - Full theme switching with CSS variables
- **Responsive Design** - Mobile-first approach with Tailwind CSS 4
- **10 Strategic Categories** - Pre-configured for Tech, AI, Finance, E-commerce, and more

### Content Management
- **Rich Text Editor** - TipTap integration with formatting, lists, links, and images
- **SEO Metadata Fields** - Title, description, keywords, focus keyword
- **Article Status Tracking** - Draft, published, scheduled states
- **Featured Image Upload** - Direct image upload to S3
- **Article Preview** - Modal preview before publishing

### SEO Architecture
- **Dynamic Meta Tags** - Title, description, Open Graph, Twitter Cards
- **JSON-LD Schema Markup** - Article, Review, FAQ, Product, Breadcrumb schemas
- **XML Sitemap** - Automatically generated and updated
- **Robots.txt** - Proper crawling directives
- **Clean URLs** - `/category/article-slug` structure
- **Canonical Tags** - Prevent duplicate content issues

### Monetization Features
- **Affiliate Call-Out Boxes** - "Our Top Choice" and "Best for Beginners" components
- **Comparison Tables** - Side-by-side product comparisons with affiliate links
- **CTA Buttons** - Strategic call-to-action placement
- **Affiliate Link Tracking** - Click tracking and analytics
- **Affiliate Disclosure Banner** - FTC compliance

### Engagement Features
- **Newsletter Subscription** - Inline forms, popups, and sidebar widgets
- **Admin-Moderated Comments** - User comments with admin approval workflow
- **Related Articles** - Automatic recommendations based on content
- **Trending Articles** - Popular posts widget
- **Search Functionality** - Keyword search with category filtering and pagination

### Analytics & Performance
- **View Tracking** - Track article views and trending content
- **Conversion Tracking** - Monitor affiliate clicks and newsletter signups
- **Performance Optimization** - Lazy loading, image optimization, code splitting
- **Web Vitals Monitoring** - LCP, FID, CLS tracking
- **Caching Strategies** - Optimized cache headers for different content types

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm or npm
- MySQL/TiDB database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

### Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
client/
  src/
    pages/          # Page components (Home, Article, Category, Search, Admin)
    components/     # Reusable components (RichTextEditor, ComparisonTable, etc.)
    lib/            # Utilities (SEO, analytics, performance, affiliate tracking)
    contexts/       # React contexts (Theme)
    hooks/          # Custom hooks (useAuth, useTheme)

server/
  routers.ts        # tRPC procedures for all features
  db.ts             # Database query helpers
  routers/          # Feature-specific routers
  _core/            # Framework plumbing (OAuth, context, LLM, storage)

drizzle/
  schema.ts         # Database schema definitions
  migrations/       # SQL migrations

shared/
  const.ts          # Shared constants
  types.ts          # Shared types
```

## 🗄️ Database Schema

### Core Tables
- **users** - User authentication and roles
- **articles** - Blog articles with SEO metadata
- **categories** - Article categories (10 pre-configured)
- **tags** - Article tags for organization
- **article_tags** - Many-to-many relationship
- **comments** - User comments (admin-moderated)
- **newsletter_subscribers** - Email subscribers
- **affiliate_links** - Affiliate products and links

## 🔌 API Routes

### Articles
- `articles.list` - Get articles with pagination
- `articles.getBySlug` - Get single article
- `articles.create` - Create new article (admin)
- `articles.update` - Update article (admin)
- `articles.delete` - Delete article (admin)
- `articles.search` - Search with filters
- `articles.trending` - Get trending articles
- `articles.related` - Get related articles

### Categories
- `categories.list` - Get all categories
- `categories.getBySlug` - Get category details

### Newsletter
- `newsletter.subscribe` - Subscribe to newsletter
- `newsletter.unsubscribe` - Unsubscribe from newsletter
- `newsletter.list` - List subscribers (admin)

### Comments
- `comments.list` - Get article comments
- `comments.create` - Submit comment
- `comments.listPending` - Get pending comments (admin)
- `comments.approve` - Approve comment (admin)
- `comments.reject` - Reject comment (admin)

### Affiliate Links
- `affiliateLinks.create` - Create affiliate link (admin)
- `affiliateLinks.delete` - Delete affiliate link (admin)

## 🎨 Design System

### Typography
- **Headings** - Playfair Display (serif)
- **Body** - Lora (serif)
- **Code** - Monospace

### Colors (OKLCH)
- **Light Mode** - Cream background, dark text
- **Dark Mode** - Dark background, light text
- **Accent** - Sophisticated blue/teal

### Spacing
- Uses Tailwind's default spacing scale
- Container max-width: 1280px

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Test coverage includes:
- Article CRUD operations (19 tests)
- Search functionality (8 tests)
- Newsletter system (4 tests)
- Authentication (1 test)

## 📊 Analytics

The platform includes built-in analytics utilities:

```typescript
import { trackArticleView, trackAffiliateClick, trackNewsletterSignup } from "@/lib/analytics";

// Track article views
trackArticleView(articleId, articleTitle);

// Track affiliate clicks
trackAffiliateClick(linkId, productName, linkType);

// Track newsletter signups
trackNewsletterSignup(email);
```

## 🔐 Security

- **Authentication** - Manus OAuth integration
- **Role-Based Access** - Admin vs. user roles
- **SQL Injection Prevention** - Drizzle ORM with parameterized queries
- **XSS Protection** - React's built-in sanitization
- **CSRF Protection** - Secure session cookies

## 📈 SEO Best Practices

1. **Keyword Optimization** - Focus keyword field in article metadata
2. **Internal Linking** - Related articles component
3. **Schema Markup** - JSON-LD for rich snippets
4. **Meta Tags** - Dynamic title and description
5. **Sitemap** - Automatic XML sitemap generation
6. **Mobile Optimization** - Responsive design
7. **Page Speed** - Performance optimization utilities

## 💰 Monetization Strategy

1. **Affiliate Links** - Strategic placement in comparison tables
2. **Call-Out Boxes** - "Our Top Choice" recommendations
3. **Newsletter** - Email list for promotions
4. **Ad Placeholders** - Ready for Google AdSense integration

## 🚀 Deployment

The platform is ready to deploy to:
- **Manus** - Built-in hosting with custom domains
- **Vercel** - Serverless deployment
- **Railway** - Container-based hosting
- **Self-Hosted** - Docker support available

## 📝 Environment Variables

```env
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-oauth-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📄 License

MIT

## 🎓 Learn More

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [React Documentation](https://react.dev)

## 💬 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for high-authority comparative analysis and affiliate monetization**
