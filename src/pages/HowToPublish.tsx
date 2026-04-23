import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";

import submitProposalIcon from "@/assets/timeline/submit-proposal.png";
import editorialReviewIcon from "@/assets/timeline/editorial-review.png";
import contractOnboardingIcon from "@/assets/timeline/contract-onboarding.png";
import manuscriptPreparationIcon from "@/assets/timeline/manuscript-preparation.png";
import productionIcon from "@/assets/timeline/production.png";
import publicationIcon from "@/assets/timeline/publication.png";
import distributionRoyaltiesIcon from "@/assets/timeline/distribution-royalties.png";
import postPublicationIcon from "@/assets/timeline/post-publication.png";
import ongoingSupportIcon from "@/assets/timeline/ongoing-support.png";

interface TimelineStep {
  icon: string;
  title: string;
  description?: string;
  bullets?: string[];
  additionalText?: string;
}

const HowToPublish = () => {
  const timelineSteps: TimelineStep[] = [
    {
      icon: submitProposalIcon,
      title: "Submit a Proposal",
      description:
        "Begin by completing our proposal form, available online or as a downloadable Word document. Please include at least one sample chapter and an academic CV. The more detailed your submission, the more effectively our team can assess it.",
    },
    {
      icon: editorialReviewIcon,
      title: "Editorial Review",
      description:
        "Your proposal will be reviewed by our editorial panel. We aim to provide a decision within four to six weeks. If successful, you will receive a publishing contract and begin the onboarding process.",
    },
    {
      icon: contractOnboardingIcon,
      title: "Contract and Onboarding",
      description:
        "Upon signing the contract, you will receive all the necessary forms, templates and style guidelines. A dedicated member of our team will be assigned to support you through the next stages of the process.",
    },
    {
      icon: manuscriptPreparationIcon,
      title: "Manuscript Preparation",
      description:
        "You will submit your complete manuscript in accordance with our formatting and referencing guidelines. If your work includes third-party materials, it is your responsibility to secure the appropriate permissions. Our team is ready to assist at any point in the process.",
    },
    {
      icon: productionIcon,
      title: "Production",
      description: "Your manuscript will undergo a comprehensive production process, including:",
      bullets: [
        "Professional copyediting",
        "Typesetting and layout",
        "Proof review and author approval",
        "Final cover design",
      ],
      additionalText:
        "You will be closely consulted throughout to ensure your work is presented with accuracy and professionalism.",
    },
    {
      icon: publicationIcon,
      title: "Publication",
      description:
        "Your book will be published in both hardback and eBook formats. Titles are made available through major academic and commercial channels, including Amazon, ProQuest, EBSCO and Ingram.",
    },
    {
      icon: distributionRoyaltiesIcon,
      title: "Distribution and Royalties",
      description:
        "We operate a Print-on-Time model, ensuring your title is always available and never out of stock. Royalties are paid from the first sale, and increase with volume. Authors also benefit from generous discounts on their own titles.",
    },
    {
      icon: postPublicationIcon,
      title: "Post-Publication Marketing and Promotion",
      description:
        "Following publication, your book will be promoted through our global distribution partners and academic channels. Marketing support includes:",
      bullets: [
        "Metadata distribution to libraries and retailers",
        "Online listing and feature on our website",
        "Author discounts and conference materials",
        "Opportunities to share news and reviews via our blog and newsletters",
      ],
      additionalText:
        "We also encourage authors to promote their work through their networks and at academic events. Our team is available to provide guidance on outreach strategies.",
    },
    {
      icon: ongoingSupportIcon,
      title: "Ongoing Author Support",
      description: "Our relationship with authors continues beyond publication. You will have access to:",
      bullets: [
        "Regular royalty statements and sales data",
        "Promotional opportunities",
        "Discussions about future publishing projects",
      ],
      additionalText:
        "At Cambridge Scholars Publishing, we view publishing as a long-term partnership grounded in transparency, trust, and a shared commitment to scholarly excellence.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">How to Publish</h1>
          <PageBreadcrumb currentPage="How to Publish" />
        </div>
      </div>

      <main>
        <section className="py-16 bg-white">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-normal text-foreground mb-6 md:text-4xl">
                Academic Publishing Timeline
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-base">
                Cambridge Scholars Publishing offers a clear and well-supported process from initial proposal to global
                distribution. Below is an overview of each stage in the publishing journey.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
                    {index < timelineSteps.length - 1 && (
                      <div className="absolute left-7 top-14 w-0.5 h-[calc(100%-3.5rem)] bg-black" />
                    )}

                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <img src={step.icon} alt={step.title} className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-display text-foreground mb-3 font-semibold tracking-wider">{step.title}</h3>
                      {step.description && (
                        <p className="leading-relaxed mb-3 text-base text-black">{step.description}</p>
                      )}
                      {step.bullets && (
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-3 ml-1">
                          {step.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                      {step.additionalText && (
                        <p className="text-muted-foreground leading-relaxed">{step.additionalText}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-12 py-6 text-accent border-accent hover:bg-accent hover:text-accent-foreground font-semibold"
              >
                <Link to="/submit-proposal">GET STARTED</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowToPublish;
