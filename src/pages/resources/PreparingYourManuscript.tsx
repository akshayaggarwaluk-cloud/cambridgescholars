import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";

export default function PreparingYourManuscript() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif text-gray-800">Preparing Your Manuscript</h1>
          <PageBreadcrumb 
            items={[
              { label: "Resources", href: "/resources" }
            ]} 
            currentPage="Preparing Your Manuscript" 
          />
        </div>
      </div>

      <main className="py-16">
        <section className="container-wide max-w-4xl mx-auto px-6">
          <p className="text-muted-foreground leading-relaxed mb-10">
            Once your proposal has been accepted, you will need to prepare your manuscript for submission. This section provides all the guidance and templates you need to format and finalise your work according to our publishing standards.
          </p>

          <ul className="space-y-4 list-disc list-inside text-foreground">
            <li>
              <span className="font-medium">2.1</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Manuscript Formatting Guidelines</Link>
              <span className="text-muted-foreground"> - Detailed instructions on formatting your manuscript</span>
            </li>
            <li>
              <span className="font-medium">2.2</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Style Guide</Link>
              <span className="text-muted-foreground"> - Comprehensive style guidelines for academic writing</span>
            </li>
            <li>
              <span className="font-medium">2.3</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Reference and Citation Guidelines</Link>
              <span className="text-muted-foreground"> - How to format references and citations correctly</span>
            </li>
            <li>
              <span className="font-medium">2.4</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Manuscript Submission Checklist</Link>
              <span className="text-muted-foreground"> - Ensure your manuscript is complete before submission</span>
            </li>
            <li>
              <span className="font-medium">2.5</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">Image and Table Guidelines</Link>
              <span className="text-muted-foreground"> - Requirements for including images and tables in your manuscript</span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
