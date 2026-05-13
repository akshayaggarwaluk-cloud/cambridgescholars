import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function ContributorGuidelines() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Contributor Guidelines
          </h1>
          <PageBreadcrumb currentPage="Contributor Guidelines" />
        </div>
      </div>

      <main className="py-16 bg-white">
        <section className="max-w-7xl mx-auto px-6 md:px-16">
          <ul
            className="list-disc pl-6 space-y-3 text-[16px] text-[#333333] leading-[1.6] mb-8"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            <li>
              <a
                href="https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/C1_contributors_agreement.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C75B2A] hover:underline font-normal"
                download
              >
                C1: Contributor&rsquo;s Agreement Form
              </a>{" "}
              &ndash; for edited collections and conference proceedings
            </li>
          </ul>

          <p
            className="text-[16px] text-[#333333] leading-[1.6]"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&rsquo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}