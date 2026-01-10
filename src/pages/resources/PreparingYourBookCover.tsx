import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";

export default function PreparingYourBookCover() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif text-gray-800">Preparing Your Book Cover</h1>
          <PageBreadcrumb 
            items={[
              { label: "Resources", href: "/resources" }
            ]} 
            currentPage="Preparing Your Book Cover" 
          />
        </div>
      </div>

      <main className="py-16">
        <section className="container-wide max-w-4xl mx-auto px-6">
          <p className="text-muted-foreground leading-relaxed mb-10">
            Your book cover is an important part of your publication. This section provides guidelines for cover design elements, including images and author information that need to be completed before the book enters production.
          </p>

          <ul className="space-y-4 list-disc list-inside text-foreground">
            <li>
              <span className="font-medium">3.1</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Cover Image Guidelines</Link>
              <span className="text-muted-foreground"> - Requirements for cover images and artwork</span>
            </li>
            <li>
              <span className="font-medium">3.2</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Author Biography Template</Link>
              <span className="text-muted-foreground"> - How to write and format your author biography</span>
            </li>
            <li>
              <span className="font-medium">3.3</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Back Cover Text Guidelines</Link>
              <span className="text-muted-foreground"> - Writing an effective book description for the back cover</span>
            </li>
            <li>
              <span className="font-medium">3.4</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Author Photo Requirements</Link>
              <span className="text-muted-foreground"> - Specifications for author photographs</span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
