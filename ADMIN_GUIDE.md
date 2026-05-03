# Admin User Guide - Crosschecking.Blog CMS

Complete guide for managing the Crosschecking.Blog platform as an administrator.

## Accessing the Admin Dashboard

1. Navigate to `https://your-domain.com/admin`
2. Log in with your Manus account (must have admin role)
3. You'll see the main admin dashboard

## Dashboard Overview

The admin dashboard contains:

- **Article Management** - Create, edit, publish articles
- **Categories** - Manage blog categories
- **Tags** - Create and organize tags
- **Comments** - Moderate user comments
- **Affiliate Links** - Manage affiliate products
- **Newsletter** - View subscribers
- **Analytics** - Track performance metrics

## Creating Articles

### Step 1: Start New Article

1. Click **"New Article"** button
2. Enter article title
3. Select category
4. Add excerpt (optional)

### Step 2: Write Content

Use the rich text editor to write your article:

- **Bold**: Ctrl+B
- **Italic**: Ctrl+I
- **Heading 2**: Ctrl+Alt+2
- **Heading 3**: Ctrl+Alt+3
- **Bullet List**: Ctrl+Shift+8
- **Numbered List**: Ctrl+Shift+7
- **Code Block**: Ctrl+Alt+C

### Step 3: Add SEO Metadata

Fill in SEO fields:

- **Meta Title**: 50-60 characters
- **Meta Description**: 150-160 characters
- **Focus Keyword**: Main keyword for ranking
- **Meta Keywords**: Comma-separated keywords

### Step 4: Upload Featured Image

1. Click **"Upload Image"**
2. Select image from computer
3. Image auto-optimizes and uploads to S3
4. Appears as featured image

### Step 5: Add Affiliate Links

1. Scroll to **"Affiliate Links"** section
2. Click **"Add Affiliate Link"**
3. Enter:
   - Product name
   - Affiliate URL
   - Link type (Top Choice, Best for Beginners, etc.)
4. Save link

### Step 6: Publish Article

1. Select status:
   - **Draft**: Save for later
   - **Published**: Live immediately
   - **Scheduled**: Set publish date/time
2. Click **"Publish"**
3. Article appears on website

## Editing Articles

1. Go to **Article Management**
2. Find article in list
3. Click **"Edit"**
4. Make changes
5. Click **"Update"**

## Managing Categories

### Create Category

1. Go to **Categories**
2. Click **"New Category"**
3. Enter:
   - Category name
   - Slug (URL-friendly)
   - Description
4. Click **"Create"**

### Edit Category

1. Find category in list
2. Click **"Edit"**
3. Update information
4. Click **"Save"**

## Managing Tags

### Create Tag

1. Go to **Tags**
2. Click **"New Tag"**
3. Enter tag name
4. Click **"Create"**

### Add Tags to Articles

1. Edit article
2. Scroll to **"Tags"** section
3. Select tags from list
4. Save article

## Moderating Comments

### View Pending Comments

1. Go to **Comments**
2. Filter by "Pending"
3. Review comment content

### Approve Comment

1. Click comment
2. Review content
3. Click **"Approve"**
4. Comment appears on article

### Reject Comment

1. Click comment
2. Click **"Reject"**
3. Comment removed

### Delete Comment

1. Click comment
2. Click **"Delete"**
3. Confirm deletion

## Managing Affiliate Links

### Add Affiliate Link

1. Go to **Affiliate Links**
2. Click **"New Link"**
3. Enter:
   - Product name
   - Affiliate URL
   - Link type
   - Commission rate (optional)
4. Click **"Create"**

### Track Affiliate Clicks

1. Go to **Analytics**
2. View **"Affiliate Clicks"** section
3. See click-through rates by product
4. Monitor conversion rates

## Newsletter Management

### View Subscribers

1. Go to **Newsletter**
2. See subscriber list
3. Filter by subscription status

### Send Newsletter

1. Click **"New Newsletter"**
2. Enter subject and content
3. Select recipient list
4. Schedule send time
5. Click **"Send"**

### Export Subscribers

1. Go to **Newsletter**
2. Click **"Export"**
3. Download CSV file

## Analytics Dashboard

### Key Metrics

- **Total Articles**: Number of published articles
- **Total Views**: Cumulative page views
- **Average Views**: Average views per article

### Top Articles

See which articles get most traffic:

1. Go to **Analytics**
2. View **"Top Articles"** chart
3. Sort by views, engagement, or date

### Performance Tracking

Monitor:
- Views over time
- Affiliate click-through rates
- Newsletter engagement
- Comment activity

## Best Practices

### Writing Articles

1. **Use clear headlines** - Help readers scan content
2. **Include images** - Break up text with visuals
3. **Link internally** - Reference related articles
4. **Optimize for SEO** - Use focus keyword naturally
5. **Add affiliate links** - Place strategically, not excessively

### Content Strategy

1. **Plan topics** - Use keyword research
2. **Maintain consistency** - Regular publishing schedule
3. **Update old content** - Keep evergreen articles fresh
4. **Monitor analytics** - See what resonates
5. **Engage readers** - Respond to comments

### SEO Optimization

1. **Meta titles**: Include primary keyword
2. **Meta descriptions**: Compelling, action-oriented
3. **Headers**: Use H2 and H3 for structure
4. **Images**: Add descriptive alt text
5. **Links**: Internal and external linking

### Affiliate Strategy

1. **Be transparent** - Always disclose affiliates
2. **Recommend genuinely** - Only promote products you believe in
3. **Strategic placement** - Put links where relevant
4. **Variety**: Mix different link types
5. **Track performance** - Monitor which products convert

## Troubleshooting

### Article won't save

- Check all required fields filled
- Verify database connection
- Try saving as draft first

### Images not uploading

- Check file size (max 10MB)
- Verify file format (JPG, PNG, WebP)
- Check S3 storage available

### Comments not appearing

- Verify comment approved
- Check article published
- Clear browser cache

### Analytics not updating

- Wait 5-10 minutes for data sync
- Check article has views
- Verify tracking enabled

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save article |
| Ctrl+P | Preview article |
| Ctrl+B | Bold text |
| Ctrl+I | Italic text |
| Ctrl+K | Insert link |
| Escape | Close modal |

## Support

For issues or questions:

1. Check this guide
2. Review README.md
3. Contact support: https://help.manus.im

## Security Tips

- **Change password regularly**
- **Use strong passwords**
- **Log out when done**
- **Don't share admin link**
- **Review access logs**

## Next Steps

1. Create your first article
2. Set up affiliate links
3. Configure newsletter
4. Monitor analytics
5. Optimize based on performance
