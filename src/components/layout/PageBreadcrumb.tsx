import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
interface BreadcrumbItem {
  label: string;
  href?: string;
}
interface PageBreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
  className?: string;
}

// Route to label mapping
const routeLabels: Record<string, string> = {
  "/": "Home",
  "/books": "Books",
  "/about": "About Us",
  "/contact": "Contact",
  "/faq": "FAQs",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/wishlist": "Wishlist",
  "/orders": "Orders",
  "/profile": "Profile",
  "/auth": "Sign In",
  "/publish": "Publish a Book",
  "/how-to-publish": "How to Publish",
  "/submit-proposal": "Submit a Proposal",
  "/resources": "Resources",
  "/endorsement-submission": "Endorsement Submission"
};
export function PageBreadcrumb({
  items,
  currentPage,
  className
}: PageBreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumb items if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || [];
  const finalPage = currentPage || routeLabels[location.pathname] || "Page";
  return;
}