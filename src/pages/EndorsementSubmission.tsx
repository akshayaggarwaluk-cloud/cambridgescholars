import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Page Title */}
          <h1 className="text-3xl font-serif text-gray-800">Endorsement Submission</h1>

          {/* Breadcrumb */}
          <PageBreadcrumb currentPage="Endorsement Submission" />
        </div>
      </div>
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        {/* <section className="bg-[#f9f7f2] py-12">
          <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-display font-normal text-black">Endorsement Submission</h1>

            <nav className="flex items-center gap-2 text-black/80">
              <Link to="/" className="text-black hover:text-black transition-colors">
                Home
              </Link>
              <span className="text-black/60">/</span>
              <span className="text-black ">Endorsement Submission</span>
            </nav>
          </div>
        </section> */}

        {/* Verification Form Section */}
        <section className="py-16 md:py-24">
          <div className="container-wide flex justify-center">
            <div className="w-full max-w-2xl bg-card border border-border rounded-lg p-8 md:p-12">
              <form onSubmit={handleVerify} className="space-y-6 text-center">
                <p className="text-foreground text-lg">
                  To add potential endorsers, enter the verification code emailed at the time of your book's
                  publication.
                </p>

                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code"
                  className="bg-secondary/50 border-border text-center text-lg py-6"
                  required
                />

                <p className="text-muted-foreground">
                  If you have lost your code or experience difficulties accessing your form, please contact{" "}
                  <a
                    href="mailto:admin@cambridgescholars.com"
                    className="text-foreground font-semibold hover:text-accent transition-colors"
                  >
                    admin@cambridgescholars.com
                  </a>
                </p>

                <Button
                  type="submit"
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-lg"
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
