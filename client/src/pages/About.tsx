import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Target, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-serif font-bold mb-6 text-foreground">
            About CrossChecking
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We believe informed decisions start with rigorous analysis. CrossChecking.blog exists to cut through marketing noise and deliver data-driven comparisons that help you choose the right solution for your needs.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                To provide high-authority, comparative analysis across technology, finance, e-commerce, and emerging markets. We help professionals and consumers make informed decisions by presenting unbiased, data-driven insights.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every comparison is grounded in current market research, user reviews, technical specifications, and real-world testing—not marketing claims.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-8 border border-border">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">What We Do</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Research latest 2026 trends and specifications</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Compare products side-by-side using objective criteria</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Identify pros and cons for each option</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Deliver actionable verdicts and recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-foreground">
            Our Research Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-3xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Deep Research</h3>
              <p className="text-muted-foreground">
                We search for the latest 2026 pricing, features, user reviews, and technical specifications from authoritative sources. No shortcuts, no assumptions.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-3xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Structured Comparison</h3>
              <p className="text-muted-foreground">
                We evaluate each option using consistent criteria: value for money, ease of use, innovation, reliability, and real-world performance.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-3xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Clear Verdict</h3>
              <p className="text-muted-foreground">
                We deliver a definitive conclusion: who should choose Option A vs. Option B, backed by data and reasoning you can verify.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-foreground">
            Why Trust CrossChecking
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <Zap className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Data-Driven Methodology</h3>
                <p className="text-muted-foreground">
                  Every claim is backed by current market research, technical specifications, and verified user feedback. We cite our sources and encourage you to verify.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <Zap className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Transparent Affiliate Disclosure</h3>
                <p className="text-muted-foreground">
                  We clearly disclose affiliate relationships and explain how they work. Our recommendations are based on merit, not commission rates.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <Zap className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Balanced Analysis</h3>
                <p className="text-muted-foreground">
                  We present honest pros and cons for every option. There's rarely a perfect solution—our job is to help you understand the tradeoffs.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <Zap className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Continuously Updated</h3>
                <p className="text-muted-foreground">
                  Markets change. We update our comparisons regularly to reflect new releases, price changes, and emerging competitors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-foreground">
            Who We Serve
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-lg font-bold mb-4 text-foreground">Professionals</h3>
              <p className="text-muted-foreground">
                Tech professionals, business owners, and decision-makers who need to evaluate tools, platforms, and services quickly and confidently.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-lg font-bold mb-4 text-foreground">Consumers</h3>
              <p className="text-muted-foreground">
                Individuals making significant purchases—from smartphones to software subscriptions—who want to make informed choices without marketing bias.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-lg font-bold mb-4 text-foreground">Researchers</h3>
              <p className="text-muted-foreground">
                Analysts and researchers who need reliable comparative data and market insights for reports, articles, and strategic planning.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-lg font-bold mb-4 text-foreground">Investors</h3>
              <p className="text-muted-foreground">
                Investors evaluating market opportunities and competitive landscapes in tech, finance, e-commerce, and emerging sectors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-950/20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">
            Ready to Make Informed Decisions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our latest comparisons, subscribe to our newsletter, or reach out if you have a comparison topic you'd like us to cover.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="gap-2">
                Explore Articles
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
