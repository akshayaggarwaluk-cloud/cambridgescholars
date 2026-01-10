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
          <PageBreadcrumb items={[{ label: "Resources", href: "/resources" }]} currentPage="Post Publication" />
        </div>
      </div>

      <main className="py-16">
        <section className="container-wide max-w-4xl mx-auto px-6">
          <p className="text-muted-foreground leading-relaxed mb-10">
            Publication marks the beginning of the next stage in your book’s journey. This section provides resources to
            help you promote your work, extend its reach, and ensure it has the greatest possible impact with your
            intended readership.
          </p>

          <ul className="space-y-4 list-disc list-inside text-foreground">
            <li>
              <span className="font-medium">4.1</span>{" "}
              <Link to="#" className="text-primary hover:underline font-medium">
                Promotion Information Form
              </Link>
              <span className="text-muted-foreground"> - Promotion Information Form</span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
