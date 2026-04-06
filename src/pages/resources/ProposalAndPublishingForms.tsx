import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";

export default function ProposalAndPublishingForms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="bg-[#f4f3ec] min-h-[280px] pt-24 px-6 md:px-16 flex items-center">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <h1 className="text-5xl font-serif text-gray-800">Proposal Stage</h1>
          <PageBreadcrumb items={[{ label: "Resources", href: "/resources" }]} currentPage="Proposal Stage" />
        </div>
      </div>

      <main className="py-16">
        <section className="max-w-7xl mx-auto px-6 md:px-16">
          <p className="text-muted-foreground leading-relaxed mb-10">
            To begin your publishing journey, you will need to submit a proposal and provide some initial documentation.
            This section brings together the key resources and forms that guide you through presenting your ideas for
            consideration and formalising the publication process.
          </p>

          <ul className="space-y-4 list-disc list-inside text-foreground">
            <li>
              <span className="font-medium">1.1</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Book Proposal Form
              </Link>
              <span className="text-muted-foreground"> - Outline and submit your book ideas for consideration</span>
            </li>
            <li>
              <span className="font-medium">1.2</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Guidelines for Adapting PhD Thesis
              </Link>
              <span className="text-muted-foreground"> - How to convert a PhD thesis into a publishable book</span>
            </li>
            <li>
              <span className="font-medium">1.3</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Guidelines for Adapting Conference Proceedings
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - How to convert conference proceedings into a publishable book
              </span>
            </li>
            <li>
              <span className="font-medium">1.4</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Contributor Agreement Form
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - Outlining terms for the publication of a work with Cambridge Scholars Publishing.
              </span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
