import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Target, Zap, Award } from "lucide-react";

export default function Careers() {
  const values = [
    {
      icon: Target,
      title: "Analytical Rigor",
      description: "We don't accept assumptions. Every claim must be backed by data and verifiable sources.",
    },
    {
      icon: Zap,
      title: "Truth-Seeking",
      description: "We prioritize accuracy and objectivity over marketing narratives. Integrity is non-negotiable.",
    },
    {
      icon: Award,
      title: "High Standards",
      description: "We hold ourselves and our work to the highest professional standards. Excellence is expected.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Every decision we make is guided by what serves our readers best, not what maximizes profits.",
    },
  ];

  const openPositions = [
    {
      title: "Senior Comparative Analyst",
      category: "Content",
      description: "Lead research and writing for complex technology and finance comparisons. Requires 5+ years of analytical experience.",
      skills: ["Research", "Writing", "Data Analysis", "Technical Knowledge"],
    },
    {
      title: "Content Editor",
      category: "Content",
      description: "Ensure all published content meets our standards for accuracy, clarity, and objectivity. Manage editorial calendar.",
      skills: ["Editing", "Project Management", "Fact-Checking", "Style Guide Mastery"],
    },
    {
      title: "Full-Stack Developer",
      category: "Engineering",
      description: "Build and maintain our platform. Work with React, Node.js, and databases. Contribute to product strategy.",
      skills: ["React", "Node.js", "Databases", "System Design"],
    },
    {
      title: "SEO & Growth Specialist",
      category: "Growth",
      description: "Optimize our content for search engines and drive organic growth. Analyze metrics and propose data-driven strategies.",
      skills: ["SEO", "Analytics", "Content Strategy", "Data Analysis"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-serif font-bold mb-6 text-foreground">
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground">
            Help us build the most trusted comparative analysis platform on the internet. We're looking for analytical minds who value truth over trends.
          </p>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-foreground">
            Our Culture
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <Icon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-foreground">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-foreground">
            Who We're Looking For
          </h2>
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-foreground">Analytical Thinkers</h3>
              <p className="text-muted-foreground mb-4">
                You approach problems systematically. You ask questions before drawing conclusions. You're comfortable with ambiguity and enjoy digging into data to find truth.
              </p>
              <p className="text-muted-foreground">
                Whether you're a researcher, engineer, or marketer, you think critically and challenge assumptions—including our own.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-foreground">Integrity-Driven</h3>
              <p className="text-muted-foreground mb-4">
                You believe that honesty and accuracy matter more than convenience or profit. You're willing to say "I don't know" or "we were wrong."
              </p>
              <p className="text-muted-foreground">
                You won't compromise on quality or objectivity, even under pressure. This is foundational to who we are.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-foreground">Continuous Learners</h3>
              <p className="text-muted-foreground mb-4">
                Technology and markets evolve constantly. You stay curious and adapt. You read widely, experiment, and share knowledge with the team.
              </p>
              <p className="text-muted-foreground">
                You're not satisfied with surface-level understanding. You dig deeper.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-foreground">Collaborative</h3>
              <p className="text-muted-foreground mb-4">
                You communicate clearly and listen actively. You give constructive feedback and accept it gracefully. You celebrate team wins.
              </p>
              <p className="text-muted-foreground">
                We're small and growing. Everyone's contribution matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-foreground">
            Open Positions
          </h2>
          <div className="space-y-6">
            {openPositions.map((position) => (
              <div key={position.title} className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{position.title}</h3>
                    <p className="text-sm text-blue-600 font-medium mt-1">{position.category}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{position.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {position.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Button variant="outline">Learn More</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-foreground">
            How to Apply
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
              <h3 className="font-bold mb-2 text-foreground">Browse Positions</h3>
              <p className="text-sm text-muted-foreground">
                Find a role that matches your skills and interests.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">2</div>
              <h3 className="font-bold mb-2 text-foreground">Submit Application</h3>
              <p className="text-sm text-muted-foreground">
                Send your resume and a brief cover letter explaining why you're interested.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">3</div>
              <h3 className="font-bold mb-2 text-foreground">Interview</h3>
              <p className="text-sm text-muted-foreground">
                We'll discuss your experience and how you approach problems.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">4</div>
              <h3 className="font-bold mb-2 text-foreground">Join Us</h3>
              <p className="text-sm text-muted-foreground">
                If it's a good fit, let's build something great together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-950/20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Send your application to careers@crosschecking.blog with the position title in the subject line.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
