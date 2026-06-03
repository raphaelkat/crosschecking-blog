import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MessageSquare, Briefcase, Users } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "support",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Message sent successfully. We'll respond within 24 hours.");
      setFormData({ name: "", email: "", category: "support", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "support", label: "Support & Feedback", icon: MessageSquare },
    { value: "partnerships", label: "Partnerships & Sponsorships", icon: Briefcase },
    { value: "media", label: "Media & Press Inquiries", icon: Users },
    { value: "business", label: "Business Inquiries", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-serif font-bold mb-6 text-foreground">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground">
            Have a question, suggestion, or partnership opportunity? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-foreground">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a href="mailto:hello@crosschecking.blog" className="text-blue-600 hover:underline">
                        hello@crosschecking.blog
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Response Time</p>
                      <p className="text-muted-foreground text-sm">Within 24 hours (business days)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-border">
                <h4 className="font-bold mb-3 text-foreground">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/about" className="text-blue-600 hover:underline">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="/disclaimer" className="text-blue-600 hover:underline">
                      Disclaimer
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3 text-foreground">
                    How can we help?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: value })}
                        className={`p-4 rounded-lg border-2 transition text-left ${
                          formData.category === value
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
                            : "border-border hover:border-blue-300"
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <p className="text-sm font-medium">{label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Full Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Subject *
                    </label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more..."
                      rows={6}
                      className="w-full border border-border rounded-md p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-serif font-bold mb-8 text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2 text-foreground">How long does it take to respond?</h3>
                <p className="text-muted-foreground">
                  We aim to respond to all inquiries within 24 business hours. During peak periods, it may take up to 48 hours.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-foreground">Can I suggest a comparison topic?</h3>
                <p className="text-muted-foreground">
                  Absolutely! We're always looking for new comparison ideas. Use the "Support & Feedback" category to share your suggestions.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-foreground">Do you accept partnership inquiries?</h3>
                <p className="text-muted-foreground">
                  Yes. We're open to partnerships, sponsorships, and collaborations that align with our mission of providing unbiased, data-driven analysis. Use the "Partnerships" category.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-foreground">How can I report an error or inaccuracy?</h3>
                <p className="text-muted-foreground">
                  Please use the "Support & Feedback" category with details about the error. We take accuracy seriously and will investigate promptly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
