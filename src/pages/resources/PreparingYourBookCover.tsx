import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";

export default function PreparingYourBookCover() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Cover Design</h1>
          <PageBreadcrumb
            items={[{ label: "Resources", href: "/resources" }]}
            currentPage="Preparing Your Book Cover"
          />
        </div>
      </div>

      <main className="py-16 bg-white">
        <section className="max-w-7xl mx-auto px-6 md:px-16">
          <p className="text-muted-foreground leading-relaxed mb-10">
            A strong book cover is essential for both professional presentation and wider visibility. In this section,
            you will find the specifications and permissions guidance needed to design and submit your cover in line
            with publishing requirements.
          </p>

          <ul className="space-y-4 list-disc list-inside text-foreground">
            <li>
              <span className="font-medium">3.1</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Cover Guidelines and Specifications
              </Link>
              <span className="text-muted-foreground">
                {" "}
                – Advice on selecting and preparing images suitable for your book cover.
              </span>
            </li>
            <li>
              <span className="font-medium">3.2</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                External Permissions
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - Technical requirements and standards for designing and submitting a book cover.
              </span>
            </li>
            <li>
              <span className="font-medium">3.3</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Cover Image Permissions
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - Forms and instructions for obtaining legal permissions to use images in your book.
              </span>
            </li>
            <li>
              <span className="font-medium">3.4</span>{" "}
              <Link to="#" className="text-red-500 text-primary hover:underline font-medium">
                Cover Image Permissions - Parental Consent Form
              </Link>
              <span className="text-muted-foreground">
                {" "}
                - Parental consent and copyright clearance for cover images featuring children.
              </span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
