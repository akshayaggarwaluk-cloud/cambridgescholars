import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";

export default function PostPublication() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif text-gray-800">Post Publication</h1>
          <PageBreadcrumb 
            items={[
              { label: "Resources", href: "/resources" }
            ]} 
            currentPage="Post Publication" 
          />
        </div>
      </div>

      <main className="py-16">
        <section className="container-wide max-w-4xl mx-auto px-6">
          <p className="text-muted-foreground leading-relaxed mb-10">
            Once your title is published, there are several resources available to help you promote your book and manage your author account. This section covers marketing support, author discounts, and promotional opportunities.
          </p>

          <ul className="space-y-4 list-disc list-inside text-foreground">
            <li>
              <span className="font-medium">4.1</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Marketing Your Book</Link>
              <span className="text-muted-foreground"> - Strategies and tips for promoting your publication</span>
            </li>
            <li>
              <span className="font-medium">4.2</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Author Discount Programme</Link>
              <span className="text-muted-foreground"> - Information on purchasing copies at author rates</span>
            </li>
            <li>
              <span className="font-medium">4.3</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Social Media Guidelines</Link>
              <span className="text-muted-foreground"> - Best practices for promoting your book on social platforms</span>
            </li>
            <li>
              <span className="font-medium">4.4</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Review Copy Requests</Link>
              <span className="text-muted-foreground"> - How to request review copies for academic journals</span>
            </li>
            <li>
              <span className="font-medium">4.5</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Rights and Permissions</Link>
              <span className="text-muted-foreground"> - Information on translation rights and reprint permissions</span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
