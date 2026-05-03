# Deployment Guide - Crosschecking.Blog

This guide covers deploying the Crosschecking.Blog platform to production.

## Pre-Deployment Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] TypeScript compilation clean (`pnpm check`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Sample content created
- [ ] SEO metadata verified
- [ ] Affiliate links configured
- [ ] Newsletter system tested

## Environment Variables

Required environment variables for production:

```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Owner Information
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key

# Analytics
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Application
VITE_APP_TITLE=Crosschecking
VITE_APP_LOGO=https://your-domain.com/logo.png
```

## Deployment Steps

### 1. Build the Application

```bash
pnpm build
```

This creates:
- `dist/index.js` - Production server bundle
- `client/dist/` - Production frontend bundle

### 2. Deploy to Manus

The platform is built with Manus WebDev and deploys directly through the Management UI:

1. Click the **Publish** button in the Management UI
2. Select the checkpoint to deploy
3. Configure custom domain (optional)
4. Verify deployment

### 3. Post-Deployment Verification

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Articles display with proper formatting
- [ ] Search functionality works
- [ ] Admin dashboard accessible
- [ ] Newsletter signup functional
- [ ] SEO meta tags present
- [ ] Dark/light theme toggle works
- [ ] Mobile responsive design

## Performance Optimization

### Image Optimization

- Use the `ImageUpload` component for featured images
- Images are automatically optimized and stored in S3
- Lazy loading enabled by default

### Caching Strategy

- Static assets cached with long TTL
- Database queries cached with React Query
- API responses cached appropriately

### Core Web Vitals

Monitor these metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Monitoring & Analytics

### Built-in Analytics

Track:
- Page views per article
- User engagement
- Affiliate click-through rates
- Newsletter subscriptions

Access via Admin Dashboard → Analytics

### External Monitoring

Recommended services:
- Google Analytics 4
- Sentry (error tracking)
- Vercel Analytics (performance)

## Scaling Considerations

### Database

- Monitor query performance
- Index frequently searched columns
- Archive old articles if needed

### Content Delivery

- Use CDN for static assets
- Enable gzip compression
- Optimize image sizes

### Traffic Spikes

- Database auto-scaling enabled
- Server auto-scaling available
- Rate limiting for API endpoints

## Troubleshooting

### Common Issues

**Articles not loading:**
- Check database connection
- Verify article status is "published"
- Check browser console for errors

**Search not working:**
- Verify search index updated
- Check database has articles
- Clear browser cache

**Email not sending:**
- Verify newsletter configuration
- Check email provider settings
- Review error logs

### Debug Mode

Enable debug logging:

```bash
DEBUG=* pnpm start
```

## Security

### SSL/TLS

- All connections use HTTPS
- SSL certificate auto-renewed
- Minimum TLS 1.2

### Database Security

- Use strong passwords
- Enable SSL for database connections
- Regular backups enabled
- Access restricted by IP

### API Security

- OAuth 2.0 authentication
- CSRF protection enabled
- Rate limiting active
- Input validation on all endpoints

## Backup & Recovery

### Automated Backups

- Database backed up daily
- Backups retained for 30 days
- Point-in-time recovery available

### Manual Backup

```bash
# Export database
mysqldump -u user -p database > backup.sql

# Export articles as JSON
# Use Admin Dashboard → Export
```

## Rollback Procedure

If deployment issues occur:

1. Go to Management UI → Version History
2. Select previous stable checkpoint
3. Click "Rollback"
4. Verify functionality

## Support & Resources

- **Documentation**: See README.md
- **API Reference**: See API_PROCEDURES.md
- **Database Schema**: See DATABASE_SCHEMA.md
- **Support**: https://help.manus.im

## Next Steps

After successful deployment:

1. Create your first articles
2. Configure affiliate links
3. Set up newsletter campaigns
4. Monitor analytics
5. Optimize based on performance data
