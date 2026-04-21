import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { BackToTop } from "@/components/layout/BackToTop";

const promises = [
  {
    title: "Efficient, fair and constructive review",
    body: "We aim to improve, not exclude. Initial feedback on proposals is usually provided within four to six weeks through our international network of reviewers. Proposals are assessed on merit, and all communication is courteous and constructive. If your work is not a fit, we will suggest alternatives where possible.",
  },
  {
    title: "Commitment to diversity",
    body: "We welcome a wide range of voices and perspectives, recognising that diversity strengthens academic discourse.",
  },
  {
    title: "No publication fees",
    body: "We do not charge authors to publish.*",
  },
  {
    title: "Transparent royalties",
    body: "Our royalty structure is clear, escalating as sales increase. Payments begin from the first copy sold.",
  },
  {
    title: "Global sales and distribution",
    body: "Our titles are available in over 120 countries through major academic channels including EBSCO/GOBI, ProQuest and Amazon.",
  },
  {
    title: "Author discounts",
    body: "Authors receive a 40% discount on their book for personal use or events.",
  },
  {
    title: "Special offers",
    body: "Authors have access to discounts on other titles and support at conferences and events.",
  },
  {
    title: "Continuous availability",
    body: "Our Print-on-Time system ensures your book is always available and never goes out of print.",
  },
  {
    title: "High-quality format",
    body: "All titles are published in hardback and as an eBook, to international standards.",
  },
  {
    title: "Opportunities to contribute",
    body: "Authors may join our Editorial Advisory Groups to help identify and mentor future scholars, supporting the growth and exchange of knowledge.",
  },
];

export default function AuthorPromises() {
  return (
    <>
      <Header />

      {/* PAGE HEADER */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28 px-10 md:px-28 lg:px-40 xl:px-48">
        <div className="w-full max-w-7xl mx-auto h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Our Author Promises</h1>
          <PageBreadcrumb currentPage="Our Author Promises" />
        </div>
      </div>

      {/* CONTENT */}
      <section className="w-full px-6 md:px-20 py-16 bg-white">
        <div className="max-w-5xl mx-auto font-nav text-[16px] font-normal text-[#333333] leading-[1.7]">
          <p className="mb-10">
            We are dedicated to academic publishing and place our authors at the centre of our work. Whether you are an experienced writer or publishing for the first time, in Humanities and Social Sciences, Health Sciences, Physical Sciences or Life Sciences, we make these ten commitments:
          </p>

          <ol className="list-decimal pl-6 space-y-6 marker:font-normal marker:text-[#333333]">
            {promises.map((p, i) => (
              <li key={i} className="pl-2">
                <p className="font-bold text-[16px] mb-2 text-[#333333]">{p.title}</p>
                <p className="font-normal text-[16px] text-[#333333] leading-[1.7]">{p.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-10 pt-6 border-t border-gray-200 text-[16px]">
            *Where extensive language editing is required, we may suggest an external service. A limited Scholarship Fund is available to assist in cases of financial difficulty
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}