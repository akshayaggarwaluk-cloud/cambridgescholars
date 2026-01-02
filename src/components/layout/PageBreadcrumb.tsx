import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  "/endorsement-submission": "Endorsement Submission",
};

export function PageBreadcrumb({ items, currentPage, className }: PageBreadcrumbProps) {
  const location = useLocation();
  
  // Auto-generate breadcrumb items if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || [];
  const finalPage = currentPage || routeLabels[location.pathname] || "Page";

  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1 hover:text-accent transition-colors">
                <Home className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {breadcrumbItems.map((item, index) => (
            <span key={index} className="contents">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href} className="hover:text-accent transition-colors">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </span>
          ))}
          
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">{finalPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
