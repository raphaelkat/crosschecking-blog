import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  connectionLimit: 1,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crosschecking_blog',
});

async function migrateCategories() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting category migration...');
    
    // Apply migration
    await connection.query('ALTER TABLE `categories` ADD COLUMN IF NOT EXISTS `parentCategoryId` int');
    console.log('✓ Added parentCategoryId column');
    
    // Delete existing categories
    await connection.query('DELETE FROM `categories`');
    console.log('✓ Cleared existing categories');
    
    // Insert new categories
    const categories = [
      // 1. Tech & Gadgets
      ['Tech & Gadgets', 'tech-gadgets', 'Latest smartphones, laptops, and tech accessories', 1, null],
      ['Smartphones', 'smartphones', 'Smartphone reviews and comparisons', 2, null],
      ['Laptops', 'laptops', 'Laptop reviews and buying guides', 3, null],
      ['Accessories', 'tech-accessories', 'Tech accessories and gadgets', 4, null],
      
      // 2. AI Tools & Automation
      ['AI Tools & Automation', 'ai-tools-automation', 'AI tools, chatbots, and automation platforms', 5, null],
      
      // 3. Online Business & Side Hustles
      ['Online Business & Side Hustles', 'online-business-side-hustles', 'Dropshipping, freelancing, and passive income tools', 6, null],
      ['Dropshipping', 'dropshipping', 'Dropshipping platforms and tools', 7, null],
      ['Freelancing Platforms', 'freelancing-platforms', 'Freelancing marketplaces and tools', 8, null],
      ['Passive Income Tools', 'passive-income-tools', 'Tools for generating passive income', 9, null],
      
      // 4. E-commerce & Marketing
      ['E-commerce & Marketing', 'ecommerce-marketing', 'E-commerce platforms and marketing tools', 10, null],
      
      // 5. Web Hosting & Domains
      ['Web Hosting & Domains', 'web-hosting-domains', 'Web hosting providers and domain registrars', 11, null],
      
      // 6. Software & SaaS Tools
      ['Software & SaaS Tools', 'software-saas-tools', 'CRM, marketing tools, productivity apps', 12, null],
      ['CRM Tools', 'crm-tools', 'Customer Relationship Management solutions', 13, null],
      ['Marketing Tools', 'marketing-tools', 'Marketing automation and analytics tools', 14, null],
      ['Productivity Apps', 'productivity-apps', 'Productivity and collaboration tools', 15, null],
      
      // 7. Online Courses & Education Platforms
      ['Online Courses & Education Platforms', 'online-courses-education', 'Online learning platforms and courses', 16, null],
      
      // 8. Digital Marketing Tools
      ['Digital Marketing Tools', 'digital-marketing-tools', 'SEO tools, email marketing, ads platforms', 17, null],
      ['SEO Tools', 'seo-tools', 'Search engine optimization tools', 18, null],
      ['Email Marketing', 'email-marketing', 'Email marketing platforms', 19, null],
      ['Ads Platforms', 'ads-platforms', 'Advertising platforms and tools', 20, null],
      
      // 9. Payment Solutions & Mobile Money
      ['Payment Solutions & Mobile Money', 'payment-solutions-mobile-money', 'Payment gateways and mobile money services', 21, null],
      
      // 10. Apps & Mobile Tools
      ['Apps & Mobile Tools', 'apps-mobile-tools', 'Top apps and mobile productivity tools', 22, null],
      
      // 11. Gaming & Entertainment Platforms
      ['Gaming & Entertainment Platforms', 'gaming-entertainment-platforms', 'Gaming platforms and entertainment services', 23, null],
      
      // 12. Streaming Services and Big Events
      ['Streaming Services and Big Events', 'streaming-services-big-events', 'Netflix alternatives and streaming platforms', 24, null],
      
      // 13. Travel & Booking Platforms
      ['Travel & Booking Platforms', 'travel-booking-platforms', 'Flight, hotel, and travel booking tools', 25, null],
      ['Flight Booking', 'flight-booking', 'Flight booking platforms', 26, null],
      ['Hotel Booking', 'hotel-booking', 'Hotel booking platforms', 27, null],
      ['World Travel Tools', 'world-travel-tools', 'International travel tools', 28, null],
      ['African Travel Tools', 'african-travel-tools', 'African travel and booking platforms', 29, null],
      
      // 14. Health & Fitness Apps/Tools
      ['Health & Fitness Apps/Tools', 'health-fitness-apps-tools', 'Wearables, diet apps, and gym tools', 30, null],
      ['Wearables', 'wearables', 'Wearable devices and smartwatches', 31, null],
      ['Diet Apps', 'diet-apps', 'Nutrition and diet tracking apps', 32, null],
      ['Gym Tools', 'gym-tools', 'Fitness and gym management tools', 33, null],
      
      // 15. Lifestyle Products & Services
      ['Lifestyle Products & Services', 'lifestyle-products-services', 'Home tech, personal productivity, real estate', 34, null],
      ['Home Tech', 'home-tech', 'Smart home technology and devices', 35, null],
      ['Personal Productivity', 'personal-productivity', 'Personal productivity tools and services', 36, null],
      ['Real Estate', 'real-estate', 'Real estate platforms and tools', 37, null],
    ];
    
    for (const [name, slug, description, order, parentId] of categories) {
      await connection.query(
        'INSERT INTO `categories` (`name`, `slug`, `description`, `order`, `parentCategoryId`) VALUES (?, ?, ?, ?, ?)',
        [name, slug, description, order, parentId]
      );
    }
    
    console.log(`✓ Inserted ${categories.length} categories`);
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

migrateCategories();
