import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useInView } from "framer-motion";
import { subscribeNewsletter } from "@/services/cspApi";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  format?: "k" | "m" | "default";
}

const stats: StatItem[] = [
  { value: 11.7, suffix: "+", label: "Total titles published", format: "k" },
  { value: 3.7, suffix: "+", label: "Total pages", format: "m" },
  { value: 867, suffix: "", label: "Books published in the last 12 months", format: "default" },
  { value: 178, suffix: "", label: "Countries our books are sold in", format: "default" },
];

function AnimatedCounter({ value, suffix, format, duration = 2000 }: {
  value: number; suffix: string; format?: "k" | "m" | "default"; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const startTime = Date.now();
      const animate = () => {
        const progress = Math.min((Date.now() - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(value * easeOutQuart);
        if (progress < 1) requestAnimationFrame(animate);
        else setCount(value);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, hasAnimated, value, duration]);

  const formatValue = () => {
    if (format === "k") return `${count.toFixed(1)}K`;
    if (format === "m") return `${count.toFixed(1)}M`;
    return Math.round(count).toString();
  };

  return (
    <span ref={ref} className="font-baskerville text-5xl md:text-[56px] font-light text-[#696969]">
      {formatValue()}{suffix}
    </span>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const res = await subscribeNewsletter(email.trim());
      toast.success(res?.message || "Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="mx-4 sm:mx-6 lg:mx-8 bg-white py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        {/* Mailing List */}
        <div className="max-w-4xl mx-auto text-center mb-14 md:mb-20 py-12 md:py-16 px-6 sm:px-10 text-[#8a8a8a] border-4 border-[#d6d7d6]/30">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-4xl font-normal text-foreground mb-4">
            Sign Up for Mailing List.
          </h2>
          <p className="text-muted-foreground text-base mb-10">Stay up to date</p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative border-b border-muted-foreground/30 focus-within:border-foreground transition-colors">
              <Input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-baskerville font-bold w-full bg-transparent border-0 text-foreground placeholder:text-muted-foreground/50 placeholder:font-bold h-14 px-0 text-center text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                required
                aria-label="Email address for mailing list"
              />
              <button
                type="submit"
                disabled={submitting}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Stats Counter */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} format={stat.format} />
              <p className="mt-5 text-base tracking-[0.2em] font-nav font-medium uppercase leading-relaxed text-[#ababab]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
