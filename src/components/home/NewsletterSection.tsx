import { useState } from "react";
import { Mail, Send, Sparkles } from "lucide-react";
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
    <section className="py-28 bg-gradient-luxury relative overflow-hidden">
      {/* Premium decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gold accent orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Premium icon container */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/15 backdrop-blur-sm mb-8 border border-accent/20 shadow-gold-glow">
            <Mail className="h-10 w-10 text-accent" />
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground/80 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Exclusive Member Benefits</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-display-sm font-semibold text-primary-foreground mb-6 text-balance">
            Get Exclusive Book Deals
          </h2>
          <p className="text-primary-foreground/70 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed font-light">
            Subscribe to our newsletter for personalized recommendations, 
            exclusive discounts, and early access to new releases.
          </p>

          {/* Premium form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 h-14 pl-5 pr-5 rounded-xl backdrop-blur-sm focus:border-accent focus:ring-accent/30"
                required
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="h-14 px-8 rounded-xl group">
              Subscribe
              <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          {/* Trust text */}
          <p className="text-primary-foreground/40 text-sm mt-6 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            No spam, unsubscribe anytime. Your privacy is protected.
          </p>
        </div>
      </div>
    </section>
  );
}