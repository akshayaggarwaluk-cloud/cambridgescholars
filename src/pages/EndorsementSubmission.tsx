import { useState } from "react";
import { XCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Reviewer {
  name: string;
  email: string;
}

interface LookupResult {
  found: boolean;
  isbn13_no_dashes?: string;
  title?: string;
  existing_reviewers?: Reviewer[];
}

const LOOKUP_URL = "https://api.cambridgescholars.com/lookup";

const EndorsementSubmission = () => {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    setIsVerifying(true);
    setResult(null);

    try {
      const res = await fetch(`${LOOKUP_URL}?code=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed (${res.status})`);
      }
      const data: LookupResult = await res.json();
      setResult(data);

      if (data.found) {
        toast({
          title: "Code Verified",
          description: data.title ? `Found: ${data.title}` : "Verification successful.",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed.";
      toast({
        title: "Verification Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
                  className="border-border text-left text-lg py-6 font-baskerville bg-[#f0efef] text-black placeholder:font-baskerville placeholder:text-black"
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

              {result?.found && (
                <div className="mt-10 border-t border-border pt-8 text-left space-y-6">
                  <div>
                    <h2 className="text-2xl font-baskerville text-black">{result.title}</h2>
                    {result.isbn13_no_dashes && (
                      <p className="text-[15px] text-[#333333] mt-1" style={{ fontFamily: "Arial, sans-serif" }}>
                        ISBN: {result.isbn13_no_dashes}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-baskerville text-black mb-3">
                      Existing Endorsers ({result.existing_reviewers?.length ?? 0})
                    </h3>
                    {result.existing_reviewers && result.existing_reviewers.length > 0 ? (
                      <ul className="divide-y divide-border border border-border">
                        {result.existing_reviewers.map((r, i) => (
                          <li key={`${r.email}-${i}`} className="px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="text-black" style={{ fontFamily: "Arial, sans-serif" }}>{r.name}</span>
                            <a
                              href={`mailto:${r.email}`}
                              className="text-[#b33000] hover:underline text-sm"
                              style={{ fontFamily: "Arial, sans-serif" }}
                            >
                              {r.email}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[15px] text-[#333333]" style={{ fontFamily: "Arial, sans-serif" }}>
                        No endorsers have been added yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {result && !result.found && (
                <div className="mt-6 border-l-4 border-[#b33000] bg-[#fdecec] px-6 py-4 flex items-center justify-center gap-3">
                  <XCircle className="h-5 w-5 text-[#b33000] flex-shrink-0" aria-hidden="true" />
                  <p className="text-[15px] text-[#b33000]" style={{ fontFamily: "Arial, sans-serif" }}>
                    The authentication code is incorrect. Please try again.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EndorsementSubmission;
