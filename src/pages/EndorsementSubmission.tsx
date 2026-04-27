import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const EndorsementSubmission = () => {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifying(true);

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Code Verified",
      description: "You can now proceed to submit your endorsement.",
    });

    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Endorsement Submission</h1>
          <PageBreadcrumb currentPage="Endorsement Submission" />
        </div>
      </div>

      <main className="flex-1">

        {/* Verification Form Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-wide flex justify-center">
            <div className="w-full max-w-2xl bg-card border border-border rounded-lg p-8 md:p-12">
              <form onSubmit={handleVerify} className="space-y-6 text-center">
                <p className="text-[16px] text-black" style={{ fontFamily: "Arial, sans-serif" }}>
                  To add potential endorsers, enter the verification code emailed at the time of your book's
                  publication.
                </p>

                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code"
                  className="border-border text-left text-lg py-6 font-baskerville bg-[#f0efef] placeholder:font-baskerville"
                  required
                />

                <p className="text-[16px] text-black" style={{ fontFamily: "Arial, sans-serif" }}>
                  If you have lost your code or experience difficulties accessing your form, please contact{" "}
                  <a
                    href="mailto:admin@cambridgescholars.com"
                    className="text-black font-bold hover:text-accent transition-colors"
                  >
                    admin@cambridgescholars.com
                  </a>
                </p>

                <Button
                  type="submit"
                  size="lg"
                  className="text-accent-foreground px-12 py-6 text-lg bg-[#b33000] hover:bg-white hover:text-[#b33000] border border-[#b33000]"
                  disabled={isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EndorsementSubmission;
