import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { XCircle, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
const SUBMIT_URL = "https://api.cambridgescholars.com/api/website/submissions/endorsement";
const RECAPTCHA_SITE_KEY = "6Lc1CNssAAAAABy9UcNw4Q07PY-eW9HMvIOGewHT";

interface ReviewerForm {
  title: string;
  forename: string;
  surname: string;
  email: string;
}

const emptyReviewer = (): ReviewerForm => ({ title: "", forename: "", surname: "", email: "" });
const TITLE_OPTIONS = ["Prof", "Dr", "Mr", "Mrs", "Ms", "Mx"];

const EndorsementSubmission = () => {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [activeTab, setActiveTab] = useState<"submit" | "previous">("submit");
  const [reviewers, setReviewers] = useState<ReviewerForm[]>([emptyReviewer()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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
        setReviewers([emptyReviewer()]);
        setActiveTab("submit");
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

  const updateReviewer = (i: number, key: keyof ReviewerForm, value: string) => {
    setReviewers((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  };

  const addReviewer = () => setReviewers((prev) => [...prev, emptyReviewer()]);
  const removeReviewer = (i: number) =>
    setReviewers((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const resetVerification = () => {
    setResult(null);
    setCode("");
    setReviewers([emptyReviewer()]);
  };

  const handleSubmitReviewers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const incomplete = reviewers.some(
      (r) => !r.title.trim() || !r.forename.trim() || !r.surname.trim() || !r.email.trim()
    );
    if (incomplete) {
      toast({
        title: "Missing details",
        description: "Please complete every field for each reviewer.",
        variant: "destructive",
      });
      return;
    }
    if (!captchaValue) {
      toast({
        title: "Verify reCAPTCHA",
        description: "Please confirm you are not a robot.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        book_title: result?.title || "",
        isbn: result?.isbn13_no_dashes || "",
        reviewers: reviewers.map((r) => ({
          title: r.title.trim().replace(/\.$/, "") + ".",
          forename: r.forename.trim(),
          surname: r.surname.trim(),
          email: r.email.trim(),
        })),
      };
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Too many submissions. Please try again in an hour.");
        }
        throw new Error(data?.error || `Submission failed (${res.status})`);
      }
      toast({
        title: "Reviewers submitted",
        description: `${data?.rows_added ?? reviewers.length} reviewer${(data?.rows_added ?? reviewers.length) > 1 ? "s" : ""} submitted successfully.`,
      });
      setReviewers([emptyReviewer()]);
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
    } catch (err) {
      toast({
        title: "Submission Error",
        description: err instanceof Error ? err.message : "Submission failed.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
        {!result?.found && (
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
        )}

        {/* Endorser submission form (after successful verification) */}
        {result?.found && (
          <section className="py-12 md:py-16 bg-white">
            <div className="container-wide flex justify-center">
              <div className="w-full max-w-3xl bg-card border border-border rounded-lg p-8 md:p-12 space-y-8">
                <div className="space-y-4 text-[16px] text-black" style={{ fontFamily: "Arial, sans-serif" }}>
                  <p>Following publication, we advise to prioritise securing scholarly endorsements for your book.</p>
                  <p>Please complete the form below with details of academic contacts in your field whom we may approach to request an endorsement.</p>
                  <p>Please note that we do not provide print copies for evaluation; a complimentary electronic copy will be supplied instead.</p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-baskerville text-black">Book Details</h2>

                  <div className="space-y-2">
                    <Label className="text-black" style={{ fontFamily: "Arial, sans-serif" }}>Title</Label>
                    <Input
                      readOnly
                      disabled
                      tabIndex={-1}
                      value={result.title || ""}
                      className="bg-[#f0efef] text-[#555555] font-baskerville text-lg py-6 cursor-default pointer-events-none disabled:opacity-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-black" style={{ fontFamily: "Arial, sans-serif" }}>ISBN-13</Label>
                    <Input
                      readOnly
                      disabled
                      tabIndex={-1}
                      value={result.isbn13_no_dashes || ""}
                      className="bg-[#f0efef] text-[#555555] font-baskerville text-lg py-6 cursor-default pointer-events-none disabled:opacity-100"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-3 border-b border-border">
                  <button
                    type="button"
                    onClick={() => setActiveTab("submit")}
                    className={`px-[15px] py-2 text-[14px] ${
                      activeTab === "submit"
                        ? "bg-[#DDD9D4] text-black"
                        : "bg-transparent text-black hover:bg-[#f0efef]"
                    }`}
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    Submit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("previous")}
                    className={`px-[15px] py-2 text-[14px] ${
                      activeTab === "previous"
                        ? "bg-[#DDD9D4] text-black"
                        : "bg-transparent text-black hover:bg-[#f0efef]"
                    }`}
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    Previous Submissions
                  </button>
                  {activeTab === "submit" && (
                    <Button
                      type="button"
                      onClick={addReviewer}
                      className="ml-auto bg-[#b33000] hover:bg-white hover:text-[#b33000] border border-[#b33000] text-white rounded-none"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      Add Reviewer <Plus className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>

                {activeTab === "submit" ? (
                  <form onSubmit={handleSubmitReviewers} className="space-y-8">
                    {reviewers.map((rev, idx) => (
                      <div key={idx} className="space-y-4 pb-6 border-b border-border last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[18px] text-[#333333]" style={{ fontFamily: "Arial, sans-serif" }}>Reviewer {idx + 1}</h3>
                          {reviewers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeReviewer(idx)}
                              className="text-[#b33000] hover:opacity-80 inline-flex items-center gap-1 text-sm"
                              style={{ fontFamily: "Arial, sans-serif" }}
                            >
                              <Trash2 className="h-4 w-4" /> Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="text-black" style={{ fontFamily: "Arial, sans-serif" }}>
                              Reviewer Title <span className="text-[#b33000]">*</span>
                            </Label>
                            <Select value={rev.title} onValueChange={(v) => updateReviewer(idx, "title", v)}>
                              <SelectTrigger className="bg-white text-black h-11">
                                <SelectValue placeholder="Reviewer Title" />
                              </SelectTrigger>
                              <SelectContent>
                                {TITLE_OPTIONS.map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-black" style={{ fontFamily: "Arial, sans-serif" }}>
                              Reviewer Forename <span className="text-[#b33000]">*</span>
                            </Label>
                            <Input
                              value={rev.forename}
                              onChange={(e) => updateReviewer(idx, "forename", e.target.value)}
                              className="bg-white text-black h-11"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-black" style={{ fontFamily: "Arial, sans-serif" }}>
                              Reviewer Surname <span className="text-[#b33000]">*</span>
                            </Label>
                            <Input
                              value={rev.surname}
                              onChange={(e) => updateReviewer(idx, "surname", e.target.value)}
                              className="bg-white text-black h-11"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-black" style={{ fontFamily: "Arial, sans-serif" }}>
                              Reviewer Email <span className="text-[#b33000]">*</span>
                            </Label>
                            <Input
                              type="email"
                              value={rev.email}
                              onChange={(e) => updateReviewer(idx, "email", e.target.value)}
                              className="bg-white text-black h-11"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 flex justify-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(v) => setCaptchaValue(v)}
                      />
                    </div>

                    <div className="flex justify-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={resetVerification}
                        className="w-[160px] h-14 text-[18px] font-medium bg-white text-black border border-border hover:bg-[#f0efef]"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-[160px] h-14 text-[18px] font-medium bg-[#b33000] text-white border border-[#b33000] hover:bg-white hover:text-[#b33000] disabled:opacity-70"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-[18px] text-[#333333]" style={{ fontFamily: "Arial, sans-serif" }}>Previously submitted details</h3>
                    <p className="text-[15px]" style={{ fontFamily: "Arial, sans-serif" }}>
                      <span className="font-bold text-[#E4573D]">Please note:</span>{" "}
                      <span className="text-[#E4573D]">
                        Newly submitted reviewer details may take up to 24 hours to appear in this list.
                      </span>
                    </p>

                    {result.existing_reviewers && result.existing_reviewers.length > 0 ? (
                      <div className="overflow-x-auto border border-border">
                        <table className="w-full border-collapse text-[16px]" style={{ fontFamily: "Arial, sans-serif" }}>
                          <thead>
                            <tr className="bg-[#F8F8F8]">
                              <th className="text-left px-2 py-2 border border-border text-[#333333] font-bold w-[18%]">
                                Reviewer Title
                              </th>
                              <th className="text-left px-2 py-2 border border-border text-[#333333] font-bold w-[24%]">
                                Reviewer Forename
                              </th>
                              <th className="text-left px-2 py-2 border border-border text-[#333333] font-bold w-[24%]">
                                Reviewer Surname
                              </th>
                              <th className="text-left px-2 py-2 border border-border text-[#333333] font-bold">
                                Reviewer Email
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.existing_reviewers.map((r, i) => {
                              // Try to split "Title Forename Surname" from API "name"
                              const parts = (r.name || "").trim().split(/\s+/);
                              const titleMatch = /^(Prof|Dr|Mr|Mrs|Ms|Mx)\.?$/i.test(parts[0] || "");
                              const title = titleMatch ? parts[0] : "";
                              const rest = titleMatch ? parts.slice(1) : parts;
                              const forename = rest[0] || "";
                              const surname = rest.slice(1).join(" ");
                              return (
                                <tr key={`${r.email}-${i}`}>
                                  <td className="px-2 py-2 border border-border text-[#696969]">{title}</td>
                                  <td className="px-2 py-2 border border-border text-[#696969]">{forename}</td>
                                  <td className="px-2 py-2 border border-border text-[#696969]">{surname}</td>
                                  <td className="px-2 py-2 border border-border text-[#696969] break-all">{r.email}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-[15px] text-[#333333]" style={{ fontFamily: "Arial, sans-serif" }}>
                        No previous submissions yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EndorsementSubmission;
