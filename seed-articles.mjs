import mysql from "mysql2/promise";
import { nanoid } from "nanoid";

// Parse DATABASE_URL properly
const dbUrl = process.env.DATABASE_URL || "";
const url = new URL(dbUrl);

const pool = mysql.createPool({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

const sampleArticles = [
  {
    title: "AI vs Machine Learning: Understanding the Key Differences in 2026",
    slug: "ai-vs-machine-learning-2026",
    excerpt: "Explore the fundamental differences between AI and ML, their applications, and which technology is right for your business.",
    content: "<h2>Introduction</h2><p>Artificial Intelligence and Machine Learning are often used interchangeably, but they represent distinct concepts in the tech world.</p><h2>What is AI?</h2><p>AI refers to the simulation of human intelligence by machines, enabling them to perform tasks that typically require human intelligence.</p><h2>What is Machine Learning?</h2><p>Machine Learning is a subset of AI that focuses on enabling systems to learn and improve from experience without being explicitly programmed.</p>",
    tldr: "AI is the broader field of creating intelligent machines, while ML is a specific approach within AI that uses data to learn patterns and make decisions.",
    categoryId: 1,
    status: "published",
    metaTitle: "AI vs Machine Learning: Key Differences 2026",
    metaDescription: "Understand the differences between AI and ML, their use cases, and which technology suits your needs.",
    focusKeyword: "AI vs machine learning",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Best SaaS Platforms for Small Businesses in 2026",
    slug: "best-saas-platforms-small-business-2026",
    excerpt: "Comprehensive comparison of top SaaS solutions designed specifically for small business growth and efficiency.",
    content: "<h2>Introduction</h2><p>Small businesses need efficient tools to manage operations. Here are the best SaaS platforms available in 2026.</p><h2>HubSpot CRM</h2><p>A leading CRM platform offering excellent features for small teams at competitive pricing.</p><h2>Slack</h2><p>Communication and collaboration tool essential for remote teams.</p>",
    tldr: "The best SaaS platforms for small businesses in 2026 include HubSpot, Slack, and Notion, offering scalability and affordability.",
    categoryId: 2,
    status: "published",
    metaTitle: "Best SaaS Platforms for Small Business 2026",
    metaDescription: "Discover the top SaaS solutions for small business management, productivity, and growth.",
    focusKeyword: "best SaaS platforms small business",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    title: "E-commerce Payment Solutions Comparison: Stripe vs Square vs PayPal",
    slug: "ecommerce-payment-solutions-comparison",
    excerpt: "In-depth comparison of the top payment processors for online stores, analyzing fees, features, and integration.",
    content: "<h2>Introduction</h2><p>Choosing the right payment processor is crucial for e-commerce success. Let's compare the top options.</p><h2>Stripe</h2><p>Stripe offers powerful APIs and competitive pricing, making it ideal for developers and high-volume merchants.</p><h2>Square</h2><p>Square provides an all-in-one solution with point-of-sale and online payment capabilities.</p><h2>PayPal</h2><p>PayPal remains a trusted option with widespread customer recognition.</p>",
    tldr: "Stripe leads for developers, Square for omnichannel businesses, and PayPal for established trust and global reach.",
    categoryId: 3,
    status: "published",
    metaTitle: "Payment Solutions Comparison: Stripe vs Square vs PayPal",
    metaDescription: "Compare top e-commerce payment processors on fees, features, and integration capabilities.",
    focusKeyword: "payment processors comparison",
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
];

async function seedArticles() {
  const connection = await pool.getConnection();

  try {
    console.log("Starting article seeding...");

    for (const article of sampleArticles) {
      const id = nanoid();

      const query = `
        INSERT INTO articles (
          title, slug, excerpt, content, tldr, categoryId, status,
          metaTitle, metaDescription, focusKeyword, authorId,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        article.title,
        article.slug,
        article.excerpt,
        article.content,
        article.tldr,
        article.categoryId,
        article.status,
        article.metaTitle,
        article.metaDescription,
        article.focusKeyword,
        1, // authorId - use first admin user
        article.createdAt,
        article.updatedAt,
      ];

      await connection.execute(query, values);
      console.log(`✓ Created article: ${article.title}`);
    }

    console.log("\n✅ Article seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding articles:", error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedArticles();
