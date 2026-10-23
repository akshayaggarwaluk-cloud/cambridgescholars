import { forwardRef } from "react";
import { Button as SiteButton, type ButtonProps as SiteButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<SiteButtonProps, "variant"> & {
  /** "quiet" is a light bordered button for row actions in tables. */
  variant?: SiteButtonProps["variant"] | "quiet";
};

/** The site button with the portal's rounded, tighter styling. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant, className, ...props }, ref) => (
  <SiteButton
    ref={ref}
    variant={variant === "quiet" ? "ghost" : variant}
    className={cn(
      "rounded-md tracking-normal",
      variant === "quiet" && "border border-border bg-white text-foreground hover:bg-[#eef2f8] hover:text-[#1a3e6f]",
      className,
    )}
    {...props}
  />
));
Button.displayName = "PortalButton";
