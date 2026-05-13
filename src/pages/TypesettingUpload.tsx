import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function TypesettingUpload() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-[#f4f3ec] py-16 md:py-24">
        <div className="container-wide flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="font-serif text-[#333333] text-4xl md:text-6xl">
            Typesetting Upload
          </h1>
          <PageBreadcrumb currentPage="Typesetting Upload" />
        </div>
      </section>

      <section className="container-wide pb-16 bg-white">
        <div className="max-w-4xl mx-auto pt-12">
          <ul className="list-disc pl-6 space-y-3 text-base">
            <li>
              <a
                href="/typesetting"
                className="text-[#C75B2A] hover:underline"
              >
                Comprehensive Overview of the Publication Process
              </a>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
