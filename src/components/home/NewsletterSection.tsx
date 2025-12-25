import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-charcoal-light text-primary-foreground">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Get Exclusive Book Deals
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for personalized recommendations, 
            exclusive discounts, and early access to new releases.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12"
              required
            />
            <Button type="submit" variant="gold" size="lg" className="h-12">
              Subscribe
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-primary-foreground/50 text-sm mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
