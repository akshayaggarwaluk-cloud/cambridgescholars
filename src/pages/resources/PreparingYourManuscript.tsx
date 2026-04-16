import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";

export default function PreparingYourManuscript() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-800">Manuscript Preparation</h1>
          <PageBreadcrumb
            items={[{ label: "Resources", href: "/resources" }]}
            currentPage="Preparing Your Manuscript"
          />
        </div>
      </div>

      <main className="py-16">
        <section className="max-w-7xl mx-auto px-6 md:px-16">
          <p className="text-muted-foreground leading-relaxed mb-10">
            When your proposal has been approved, the next step is to prepare your manuscript for submission. Here you
            will find guidance on formatting, referencing, permissions, and best practices to ensure your work meets
            professional publishing standards.
          </p>

          <ul className="space-y-4 list-disc list-inside text-foreground">
            <li>
              <span className="font-medium">2.1</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Submission Checklist
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - To ensure all necessary materials and requirements are completed before submitting a manuscript.
              </span>
            </li>
            <li>
              <span className="font-medium">2.2</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Manuscript Guidelines
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - Instructions and a sample layout for preparing manuscripts according to our publishing standards.
              </span>
            </li>
            <li>
              <span className="font-medium">2.3</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Referencing and Proofreading Guide
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - Guidance on proper citation, referencing, and best practices for thorough proofreading.
              </span>
            </li>
            <li>
              <span className="font-medium">2.4</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Marketing Your Book: Guidelines
              </Link>
              <span className="text-muted-foreground">
                {" "}
                – Advice and strategies for promoting and marketing your book effectively.
              </span>
            </li>
            <li>
              <span className="font-medium">2.5</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Copyright and Permissions Pack
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - Information and forms for securing copyright and permissions for content used in your book.
              </span>
            </li>
            <li>
              <span className="font-medium">2.6</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                BIC Codes
              </Link>
              <span className="text-muted-foreground"> - BIC codes to classify your book</span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
