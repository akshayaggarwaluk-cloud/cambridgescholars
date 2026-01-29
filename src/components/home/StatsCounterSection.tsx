import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
interface StatItem {
  value: number;
  suffix: string;
  label: string;
  format?: "k" | "m" | "default";
}
const stats: StatItem[] = [{
  value: 11.7,
  suffix: "+",
  label: "TOTAL TITLES PUBLISHED",
  format: "k"
}, {
  value: 3.7,
  suffix: "+",
  label: "TOTAL PAGES",
  format: "m"
}, {
  value: 867,
  suffix: "",
  label: "BOOKS PUBLISHED IN THE LAST 12 MONTHS",
  format: "default"
}, {
  value: 178,
  suffix: "",
  label: "COUNTRIES OUR BOOKS ARE SOLD IN",
  format: "default"
}];
function AnimatedCounter({
  value,
  suffix,
  format,
  duration = 2000
}: {
  value: number;
  suffix: string;
  format?: "k" | "m" | "default";
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const startTime = Date.now();
      const startValue = 0;
      const endValue = value;
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);

        // Easing function for smooth deceleration
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        setCount(currentValue);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, hasAnimated, value, duration]);
  const formatValue = () => {
    if (format === "k") {
      return `${count.toFixed(1)}K`;
    }
    if (format === "m") {
      return `${count.toFixed(1)}M`;
    }
    return Math.round(count).toString();
  };
  return <span ref={ref} className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-muted-foreground/80">
      {formatValue()}{suffix}
    </span>;
}
export function StatsCounterSection() {
  return <section className="py-20 bg-background md:py-0 pt-0 pb-[50px] text-white">
      <div className="container-wide pb-[40px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => <div key={index} className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} format={stat.format} />
              <p className="mt-4 text-xs md:text-sm tracking-[0.2em] text-muted-foreground/60 font-medium">
                {stat.label}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
}