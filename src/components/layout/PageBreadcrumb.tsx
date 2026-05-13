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
  "/product": "Books",
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
  "/book-proposal-form": "Book Proposal Form",
  "/typesetting": "Typesetting",
  "/resources": "Resources",
  "/endorsement-submission": "Endorsement Submission"
};
export function PageBreadcrumb({
  items,
  currentPage,
  className
}: PageBreadcrumbProps) {
  const location = useLocation();

  // When items are explicitly provided, render them as-is (no auto Home prefix / Page suffix)
  const useCustomItems = Array.isArray(items) && items.length > 0;
  const breadcrumbItems: BreadcrumbItem[] = items || [];
  const finalPage = currentPage || routeLabels[location.pathname] || "Page";

  if (useCustomItems) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList className="text-base">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <div key={index} className="flex items-center gap-1.5 sm:gap-2.5">
                {index > 0 && (
                  <BreadcrumbSeparator>
                    <span className="font-baskerville italic text-[#696969]">/</span>
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem>
                  {item.href && !isLast ? (
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
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

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
