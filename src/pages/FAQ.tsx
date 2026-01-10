import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const FAQs = [
    {
      question: "Do authors incur any charges when publishing with Cambridge Scholars?",
      answer:
        "There are no publishing fees for authors, either explicit or hidden. We do not charge for the review, editing, or publication of accepted manuscripts. All commercial risk associated with an author’s title is borne entirely by ourselves.",
    },
    {
      question: "What kinds of books are considered for publication?",
      answer:
        "We publish academic monographs, edited collections, and works developed from doctoral research. We do not publish journals at this time.",
    },
    {
      question: "Can I submit a book proposal if my manuscript isn’t finished?",
      answer: "Yes, we accept proposals for works in progress as well as completed manuscripts.",
    },
    {
      question: "How long does the publishing process take?",
      answer: "The complete publishing process typically takes around 4 to 6 months.",
    },
    {
      question: "Will I receive royalties?",
      answer: "Yes, royalties are provided from the first sale, with increasing rates at sales milestones.",
    },
    {
      question: "Where are your books sold?",
      answer: "Our books are available globally across libraries, distributors, and online platforms.",
    },
    {
      question: "I ordered a book. How long will delivery take?",
      answer: "Orders are dispatched within two weeks. Delivery time depends on location.",
    },
    {
      question: "Do you accept proposals from first-time authors?",
      answer: "Absolutely — first-time authors and early career researchers are welcome.",
    },
    {
      question: "Do I keep copyright of my work?",
      answer: "Yes. You retain copyright while granting us rights to publish and distribute.",
    },
    {
      question: "I submitted a proposal. When will I hear back?",
      answer: "We typically respond within 4–6 weeks. If delayed, feel free to follow up.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* HEADER */}
      <Header />

      {/* ---------------- SECTION 1: TOP BANNER ---------------- */}
      <div className="bg-[#f9f7f2] py-10 px-6 md:px-16 border-b border-gray-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif text-gray-800 tracking-wide">FAQ</h1>

          <nav className="text-sm text-gray-600">
            <ol className="flex space-x-1 md:space-x-2">
              <li>
                <a href="/" className="hover:underline italic">
                  Home
                </a>
              </li>
              <li>/</li>
              <li className="text-red-500 italic">FAQ</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ---------------- SECTION 2: FAQ SECTION ---------------- */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif text-gray-800 mb-10 text-center">Frequently Asked Questions</h2>

        <div className="space-y-5">
          {FAQs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-2xl p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md bg-white ${
                  isOpen ? "border-red-500 shadow-md" : "border-gray-200"
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>

                  <span
                    className={`text-2xl font-bold text-red-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default FAQ;
