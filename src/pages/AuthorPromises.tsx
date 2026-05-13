import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

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
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Our Author Promises
          </h1>
          <PageBreadcrumb currentPage="Our Author Promises" />
        </div>
      </div>

      <main className="py-16 bg-white">
        <section className="max-w-7xl mx-auto px-6 md:px-16">
          <p
            className="text-[16px] text-[#696969] leading-[1.6] mb-10"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            We are dedicated to academic publishing and place our authors at the centre of our work. Whether you are an experienced writer or publishing for the first time, in Humanities and Social Sciences, Health Sciences, Physical Sciences or Life Sciences, we make these ten commitments:
          </p>

          <ol
            className="space-y-6 text-[16px] text-[#696969] leading-[1.6]"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            {promises.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span className="text-[#C75B2A] font-semibold w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <div>
                  <h2 className="text-[18px] font-semibold text-[#333333] mb-1">
                    {p.title}
                  </h2>
                  <p>{p.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p
            className="text-[14px] text-[#696969] leading-[1.6] mt-10 italic"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            *Where extensive language editing is required, we may suggest an external service. A limited Scholarship Fund is available to assist in cases of financial difficulty.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}