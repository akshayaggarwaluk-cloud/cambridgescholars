import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const faqs = [
  {
    question: "Do authors incur any charges when publishing with Cambridge Scholars?",
    answer:
      "Our publishing programme includes English-language academic monographs, edited collections, and works developed from doctoral research across the arts, humanities, social sciences, and STEM disciplines. We specialise in books for scholarly research market, and we would generally not consider books aimed at a consumer market, fiction, autobiographies, or dictionaries. We do not publish journals. ",
  },
  {
    question: "What is the minimum and maximum word length for a book?
",
    answer:
      "Minimum word length is 35,000 and maximum is 200,000.
",
  },
  {
    question: "Do you publish books in languages other than English?
",
    answer:
      "We are an English-language publisher. Words, phrases or passages in languages other than English may be used in context. 

",
  },
  {
    question: "Are books peer reviewed?
",
    answer:
      "All proposals are independently reviewed, and a contract offered based on the proposal. Normally, we do not go out to a second formal external review when we receive a manuscript, unless there are concerns, or a manuscript differs significantly from what was proposed. 

",
  },
  {
    question: "I submitted a proposal. When will I hear back?
",
    answer:
      "We aim to respond to all proposals within four to six weeks. If you have not received a response by then, please feel free to follow up using the contact information provided in your confirmation email. 

",
  },
  {
    question: "Do authors incur any charges when publishing with Cambridge Scholars?
",
    answer:
      "There are no publishing fees for authors or editors. We do not charge for the review, editing or publication of accepted manuscripts. All commercial risk associated with an author´s title is carried by us. 

",
  },
  {
    question: "Can I submit a book proposal if my manuscript isn’t finished?
",
    answer:
      "Yes, we accept proposals for works in development and completed manuscripts. Proposal guidelines and downloadable templates are available on our Publish with Us page. 

",
  },
  {
    question: "Do you accept proposals from first-time authors?
",
    answer:
      "Absolutely, we welcome submissions from early-career researchers as well as experienced academics.

",
  },
  {
    question: "Do I keep copyright of my work?
",
    answer:
      "Yes, authors retain copyright ownership, while granting Cambridge Scholars Publishing the right to publish and distribute the work under our standard publishing agreement.

",
  },
  {
    question: "How long does the publishing process take?
",
    answer:
      "Typically, the process from submitted manuscript to publication takes 3 to 6 months, depending on the complexity of the project. 

",
  },
  {
    question: "Will I receive royalties?
",
    answer:
      "Yes, we offer royalties from the first sale, with rates that increase as sales volumes reach certain thresholds.

",
  },
  {
    question: "Where are your books sold?
",
    answer:
      "Our titles are distributed globally through academic libraries, distributors, and online platforms. They are accessible in over 100 countries.

",
  },
  {
    question: "I ordered a book. How long will delivery take?
",
    answer:
      "Once your order is confirmed, it will usually be dispatched within two working days. Delivery times may vary depending on your location.

",
  },
    
  
];
export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">FAQS</h1>
          <PageBreadcrumb currentPage="FAQs" />
        </div>
      </div>

      <main className="pb-16 bg-white">
        <section className="container-wide py-16">
          <div className="max-w-7xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-[#E5E5E5] rounded-md bg-[#F8F8F8] px-5"
                >
                  <AccordionTrigger className="text-left font-nav font-normal text-[#333333] hover:text-accent hover:no-underline py-5 text-[17px] leading-[1.6] [&[data-state=open]>svg]:rotate-180">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-nav text-[#696969] leading-[1.6] pb-5 text-[16px]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Final line after FAQs */}
          <div className="max-w-7xl mx-auto mt-12 text-center">
            <p className="text-lg md:text-lg text-justify text-black">
              If your question is not addressed here, please do not hesitate to contact us at{" "}
              <a href="mailto:admin@cambridgescholars.com" className="text-red-500 hover:underline">
                admin@cambridgescholars.com
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
