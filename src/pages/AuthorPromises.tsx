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
    title: "Royalties from the first sale",
    body: "Authors begin earning royalties from the very first copy sold — there are no minimum thresholds.",
  },
  {
    title: "Editorial respect",
    body: "We provide thorough editorial support while preserving your individual voice and academic integrity.",
  },
  {
    title: "Transparent process",
    body: "We keep authors informed at every stage of the publishing journey, with clear timelines and accessible communication.",
  },
  {
    title: "Quality production",
    body: "Our books are produced to the highest standards in hardback and digital formats, with professional typesetting and cover design.",
  },
  {
    title: "Global distribution",
    body: "Your work is distributed worldwide through Amazon, ProQuest, EBSCO, Ingram and other leading academic channels.",
  },
  {
    title: "Ongoing availability",
    body: "Our Print-on-Time system ensures titles remain continuously available, with no risk of going out of print.",
  },
  {
    title: "Long-term partnership",
    body: "We view publishing as the start of a relationship — supporting authors with marketing, promotion and future projects.",
  },
];

export default function AuthorPromises() {
  return (
    <>
      <Header />

      {/* PAGE HEADER */}
      <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl sm:text-5xl font-baskerville text-gray-800">Our Author Promises</h1>
          <PageBreadcrumb currentPage="Our Author Promises" />
        </div>
      </div>

      {/* CONTENT */}
      <section className="w-full px-6 md:px-20 py-16 bg-white">
        <div className="max-w-5xl mx-auto font-nav text-[15px] text-black leading-relaxed">
          <p className="mb-10">
            We are dedicated to academic publishing and place our authors at the centre of our work. Whether you are an experienced writer or publishing for the first time, in Humanities and Social Sciences, Health Sciences, Physical Sciences or Life Sciences, we make these ten commitments:
          </p>

          <ol className="list-decimal pl-6 space-y-6">
            {promises.map((p, i) => (
              <li key={i}>
                <p className="font-bold mb-2">{p.title}</p>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm text-gray-600">
            * A small contribution towards production costs may be requested in specific circumstances and is always discussed transparently with the author.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}