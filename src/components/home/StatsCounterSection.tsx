import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  format?: "k" | "m" | "default";
}

const stats: StatItem[] = [
  {
    value: 11.7,
    suffix: "+",
    label: "Total titles published",
    format: "k",
  },
  {
    value: 3.7,
    suffix: "+",
    label: "Total pages",
    format: "m",
  },
  {
    value: 867,
    suffix: "",
    label: "Books published in the last 12 months",
    format: "default",
  },
  {
    value: 178,
    suffix: "",
    label: "Countries our books are sold in",
    format: "default",
  },
];

function AnimatedCounter({
  value,
  suffix,
  format,
  duration = 2000,
}: {
  value: number;
  suffix: string;
  format?: "k" | "m" | "default";
  duration?: number;
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
    <span
      ref={ref}
      className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-muted-foreground/70"
    >
      {formatValue()}
      {suffix}
    </span>
  );
}

export function StatsCounterSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                format={stat.format}
              />
              <p className="mt-4 text-xs md:text-sm tracking-[0.15em] text-muted-foreground/60 font-medium uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
