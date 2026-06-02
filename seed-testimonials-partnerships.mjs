import { drizzle } from "drizzle-orm/mysql2";
import { testimonials, partnerships } from "./drizzle/schema.js";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const url = new URL(DATABASE_URL);

async function seed() {
  const connection = await mysql.createConnection({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const db = drizzle(connection);

  console.log("🌱 Seeding testimonials...");

  // Sample testimonials
  const sampleTestimonials = [
    {
      authorName: "Sarah Johnson",
      authorTitle: "Product Manager at TechCorp",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      content:
        "Crosschecking.blog has become my go-to resource for making informed purchasing decisions. Their in-depth comparisons save me hours of research.",
      rating: 5,
      isActive: true,
      order: 1,
    },
    {
      authorName: "Michael Chen",
      authorTitle: "Founder of StartupXYZ",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      content:
        "The affiliate recommendations are honest and well-researched. I've implemented several tools they suggested and seen real ROI.",
      rating: 5,
      isActive: true,
      order: 2,
    },
    {
      authorName: "Emma Williams",
      authorTitle: "Digital Marketing Specialist",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      content:
        "Finally, a comparison blog that doesn't just list features. The data-driven insights and verdicts are exactly what I need.",
      rating: 5,
      isActive: true,
      order: 3,
    },
    {
      authorName: "David Martinez",
      authorTitle: "CTO at Innovation Labs",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      content:
        "The technical depth combined with accessibility makes this blog invaluable for both technical and non-technical decision makers.",
      rating: 5,
      isActive: true,
      order: 4,
    },
  ];

  for (const testimonial of sampleTestimonials) {
    await db.insert(testimonials).values(testimonial);
  }

  console.log("✅ Testimonials seeded successfully!");

  console.log("🌱 Seeding partnerships...");

  // Sample partnerships
  const samplePartnerships = [
    {
      partnerName: "TechCrunch",
      partnerLogo: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
      partnerUrl: "https://techcrunch.com",
      description: "Leading tech news and analysis",
      isActive: true,
      order: 1,
    },
    {
      partnerName: "ProductHunt",
      partnerLogo: "https://api.dicebear.com/7.x/initials/svg?seed=PH",
      partnerUrl: "https://producthunt.com",
      description: "Discover new products daily",
      isActive: true,
      order: 2,
    },
    {
      partnerName: "Indie Hackers",
      partnerLogo: "https://api.dicebear.com/7.x/initials/svg?seed=IH",
      partnerUrl: "https://indiehackers.com",
      description: "Community for indie entrepreneurs",
      isActive: true,
      order: 3,
    },
    {
      partnerName: "Y Combinator",
      partnerLogo: "https://api.dicebear.com/7.x/initials/svg?seed=YC",
      partnerUrl: "https://ycombinator.com",
      description: "Startup accelerator and funding",
      isActive: true,
      order: 4,
    },
    {
      partnerName: "Stripe",
      partnerLogo: "https://api.dicebear.com/7.x/initials/svg?seed=ST",
      partnerUrl: "https://stripe.com",
      description: "Payment processing platform",
      isActive: true,
      order: 5,
    },
    {
      partnerName: "Vercel",
      partnerLogo: "https://api.dicebear.com/7.x/initials/svg?seed=VL",
      partnerUrl: "https://vercel.com",
      description: "Frontend deployment platform",
      isActive: true,
      order: 6,
    },
  ];

  for (const partnership of samplePartnerships) {
    await db.insert(partnerships).values(partnership);
  }

  console.log("✅ Partnerships seeded successfully!");

  await connection.end();
  console.log("🎉 Seeding completed!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
