import { useState } from "react";
import { ArrowRight } from "lucide-react";
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
    <section className="py-16 md:py-20 bg-white border-y border-border">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-4">
            Sign Up for Mailing List.
          </h2>

          <p className="text-muted-foreground text-base mb-10">Stay up to date</p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative border-b border-muted-foreground/30 focus-within:border-foreground transition-colors">
              <Input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 text-foreground placeholder:text-muted-foreground/50 h-14 px-0 text-center text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                required
                aria-label="Email address for mailing list"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
