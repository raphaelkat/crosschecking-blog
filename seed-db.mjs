import mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  port: parseInt(url.port || "3306"),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: {
    rejectUnauthorized: false,
  },
};

async function seed() {
  const connection = await mysql.createConnection(config);

  try {
    // Read and execute migration SQL
    const migrationPath = path.join(process.cwd(), "drizzle", "0001_next_magneto.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
    
    // Split by statement-breakpoint and execute each statement
    const statements = migrationSQL.split("--> statement-breakpoint").filter(s => s.trim());
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        try {
          console.log("Executing:", trimmed.substring(0, 50) + "...");
          await connection.execute(trimmed);
        } catch (err) {
          if (err.code === "ER_TABLE_EXISTS_ERROR") {
            console.log("Table already exists, skipping...");
          } else {
            throw err;
          }
        }
      }
    }

    console.log("✓ Database tables created");

    // Seed categories
    const categories = [
      { name: "AI & Machine Learning", slug: "ai-machine-learning", description: "Comparisons of AI tools, LLMs, and ML platforms" },
      { name: "SaaS & Productivity", slug: "saas-productivity", description: "Business software and productivity tools" },
      { name: "E-commerce", slug: "ecommerce", description: "E-commerce platforms and solutions" },
      { name: "Payment Solutions", slug: "payment-solutions", description: "Payment processors and fintech tools" },
      { name: "Web Development", slug: "web-development", description: "Web frameworks and development tools" },
      { name: "Cloud Hosting", slug: "cloud-hosting", description: "Cloud platforms and hosting services" },
      { name: "Analytics & BI", slug: "analytics-bi", description: "Data analytics and business intelligence tools" },
      { name: "Marketing Tools", slug: "marketing-tools", description: "Marketing automation and tools" },
      { name: "Design & Creative", slug: "design-creative", description: "Design tools and creative software" },
      { name: "Finance & Accounting", slug: "finance-accounting", description: "Financial tools and accounting software" },
    ];

    for (const cat of categories) {
      try {
        await connection.execute(
          "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)",
          [cat.name, cat.slug, cat.description]
        );
        console.log(`✓ Created category: ${cat.name}`);
      } catch (err) {
        if (err.code !== "ER_DUP_ENTRY") throw err;
      }
    }

    // Seed tags
    const tags = [
      { name: "2026", slug: "2026" },
      { name: "Comparison", slug: "comparison" },
      { name: "Review", slug: "review" },
      { name: "Pricing", slug: "pricing" },
      { name: "Features", slug: "features" },
      { name: "Enterprise", slug: "enterprise" },
      { name: "Startup", slug: "startup" },
      { name: "Open Source", slug: "open-source" },
    ];

    for (const tag of tags) {
      try {
        await connection.execute(
          "INSERT INTO tags (name, slug) VALUES (?, ?)",
          [tag.name, tag.slug]
        );
        console.log(`✓ Created tag: ${tag.name}`);
      } catch (err) {
        if (err.code !== "ER_DUP_ENTRY") throw err;
      }
    }

    console.log("✓ Database seeding completed successfully");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
