import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "font-nav inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm uppercase tracking-wider ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-normal",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-foreground",
        link: "text-accent underline-offset-4 hover:underline",
        gold: "bg-accent text-accent-foreground font-semibold shadow-md hover:bg-accent/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        "gold-outline": "border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold transition-all duration-300",
        hero:
          "bg-accent text-accent-foreground font-semibold text-base shadow-md hover:bg-accent/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-500",
        "hero-outline": "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base backdrop-blur-sm transition-all duration-300",
        premium:
          "bg-accent text-accent-foreground font-semibold shadow-md hover:bg-accent/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };