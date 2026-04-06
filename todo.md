# Crosschecking.Blog - Project TODO

## Database & Backend
- [x] Design and implement database schema (articles, categories, tags, users, comments, newsletter subscribers, affiliate links)
- [x] Create database migration SQL and apply via webdev_execute_sql
- [x] Implement article CRUD procedures in tRPC
- [x] Implement category management procedures
- [x] Implement tag management procedures
- [x] Implement affiliate link management procedures
- [x] Implement newsletter subscription procedures
- [x] Implement comment management procedures (admin-only moderation)
- [x] Implement search functionality with keyword and category filters
- [x] Implement trending/popular articles query

## Frontend - Design System & Layout
- [x] Set up professional editorial magazine design system (serif typography, minimal color palette)
- [x] Configure dark/light theme with CSS variables in index.css
- [ ] Create reusable layout components (header, footer, sidebar)
- [ ] Implement responsive navigation with category menu
- [x] Set up global styling and Tailwind configuration

## Frontend - Homepage
- [x] Build hero section with compelling headline and CTA
- [x] Create featured articles grid (latest, trending, by category)
- [x] Implement category navigation/filter buttons
- [x] Add newsletter subscription CTA section
- [x] Add search bar with autocomplete
- [x] Create sidebar with trending/popular posts widget
- [x] Implement dark/light theme toggle

## Frontend - Article Pages
- [x] Create article page template with SEO-optimized structure
- [x] Implement H1 with publication date
- [x] Add TL;DR (Too Long; Didn't Read) summary section
- [ ] Create dynamic table of contents with anchor links
- [ ] Build comparison table component with affiliate links
- [ ] Create pros/cons list component
- [ ] Implement FAQ section with expandable Q&A
- [x] Add affiliate disclosure banner
- [x] Implement related articles recommendations
- [x] Add newsletter subscription CTA at article end
- [x] Create admin-moderated comments section

## Frontend - Category Pages
- [x] Create category page template
- [x] Implement category-specific article listings
- [ ] Add filtering by subcategories and tags
- [x] Create category hero section with description
- [ ] Add breadcrumb navigation

## Frontend - Search & Discovery
- [ ] Implement search page with keyword and category filters
- [ ] Create search results layout
- [ ] Add pagination for search results
- [ ] Implement search suggestions/autocomplete

## Admin CMS Dashboard
- [ ] Create admin authentication and role-based access control
- [ ] Build main dashboard layout with sidebar navigation
- [ ] Implement article management (create, edit, delete, publish/draft)
- [ ] Integrate rich text editor (support for headings, tables, lists, links, images)
- [ ] Create article form with SEO metadata fields (title, description, keywords, focus keyword)
- [ ] Add featured image upload functionality
- [ ] Implement category management interface
- [ ] Implement tag management interface
- [ ] Create affiliate link management interface
- [ ] Build article preview functionality
- [ ] Implement bulk operations (publish, unpublish, delete)
- [ ] Add article status tracking (draft, published, scheduled)
- [ ] Create comment moderation interface
- [ ] Add newsletter subscriber management interface
- [ ] Implement analytics dashboard (views, engagement, conversions)

## SEO Architecture
- [ ] Implement clean URL structure (/category/article-slug)
- [ ] Set up dynamic meta tags (title, description) for all pages
- [ ] Implement Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Add Twitter Card meta tags
- [ ] Create JSON-LD schema markup for articles (Article schema)
- [ ] Create JSON-LD schema markup for reviews (Review schema)
- [ ] Create JSON-LD schema markup for FAQ (FAQPage schema)
- [ ] Implement breadcrumb schema markup
- [ ] Generate XML sitemap dynamically
- [ ] Create robots.txt with proper directives
- [ ] Implement internal linking system
- [ ] Add canonical tags to prevent duplicate content

## Monetization Features
- [ ] Create "Our Top Choice" call-out box component
- [ ] Create "Best for Beginners" call-out box component
- [ ] Build comparison table with affiliate link integration
- [ ] Implement CTA button component with tracking
- [ ] Create affiliate disclosure banner
- [ ] Add ad placeholder system for Google AdSense
- [ ] Implement affiliate link tracking/analytics

## Email & Newsletter System
- [ ] Create newsletter subscription form component (popup and inline)
- [ ] Implement email capture functionality
- [ ] Build newsletter subscriber management in admin
- [ ] Create newsletter template system
- [ ] Implement double-opt-in verification
- [ ] Add unsubscribe functionality

## Comments System
- [ ] Create comment form component
- [ ] Implement admin-only comment moderation
- [ ] Build comment display with moderation status
- [ ] Add comment notification system
- [ ] Create comment management interface in admin

## Performance & Optimization
- [ ] Implement image optimization and lazy loading
- [ ] Set up code splitting and route-based lazy loading
- [ ] Optimize Core Web Vitals (LCP, FID, CLS)
- [ ] Implement caching strategies
- [ ] Minify and compress assets
- [ ] Test mobile performance and responsiveness

## Testing & Quality Assurance
- [ ] Write vitest tests for article CRUD operations
- [ ] Write vitest tests for search functionality
- [ ] Write vitest tests for SEO metadata generation
- [ ] Write vitest tests for affiliate link management
- [ ] Write vitest tests for newsletter subscription
- [ ] Write vitest tests for comment moderation
- [ ] Test responsive design across devices
- [ ] Test dark/light theme switching
- [ ] Validate SEO implementation (meta tags, schema markup, sitemap)
- [ ] Test affiliate link tracking

## Sample Content & Population
- [ ] Create 20 strategic categories
- [ ] Populate sample articles across categories (3-5 per category)
- [ ] Add affiliate links to sample articles
- [ ] Create comparison tables in sample articles
- [ ] Add FAQ sections to sample articles
- [ ] Create featured images for articles
- [ ] Add tags and metadata to articles

## Documentation & Deployment
- [ ] Create comprehensive README with setup instructions
- [ ] Document API endpoints and tRPC procedures
- [ ] Create deployment guide
- [ ] Document environment variables required
- [ ] Create user guide for admin CMS
- [ ] Add contribution guidelines

## Completed Milestones
- [x] Project initialized with web-db-user scaffold
- [x] Initial project structure created
- [x] Database schema designed and migration generated
- [x] tRPC routers implemented for all core features
- [x] Design system with serif typography and minimal color palette
- [x] Homepage with hero, featured articles, and newsletter CTA
- [x] Article pages with SEO structure, TL;DR, affiliate disclosure, and comments
- [x] Category pages with article listings
- [x] App routing configured
