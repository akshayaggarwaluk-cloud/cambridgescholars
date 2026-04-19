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
            <Link to="/" className="text-red-500 hover:text-red-600">
              <span className="font-baskerville italic text-[#696969]">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 sm:gap-2.5">
            <BreadcrumbSeparator>
              <span className="font-baskerville italic text-[#696969]">/</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href} className="font-baskerville italic text-[#696969] hover:text-[#e5573e]">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-baskerville italic text-[#e5573e]">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
        
        <BreadcrumbSeparator>
          <span className="font-baskerville italic text-[#696969]">/</span>
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