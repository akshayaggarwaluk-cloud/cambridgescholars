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
  
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-base">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1 text-red-500 hover:text-red-600">
              <Home className="h-4 w-4" />
              <span className="font-baskerville italic">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href} className="text-red-500 hover:text-red-600">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-muted-foreground">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
        
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium text-base font-baskerville italic text-[#e5573e]">
            {finalPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}