import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Send, Upload, CheckCircle2 } from "lucide-react";
import { submitProposal, type ProposalAuthor } from "@/services/cspApi";

const TOTAL_STEPS = 7;

const SubmitProposal = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [hasCoAuthors, setHasCoAuthors] = useState<string>("");
  const [coAuthorCount, setCoAuthorCount] = useState("1");
  const [bookType, setBookType] = useState("");
  const [manuscriptStage, setManuscriptStage] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [sampleFiles, setSampleFiles] = useState<File[]>([]);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [country, setCountry] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [coAuthorRoles, setCoAuthorRoles] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateField = (key: string, value: string, type: string): string => {
    const v = (value || "").trim();
    if (!v) return "This field is required.";
    if (type === "email") {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(v)) return "Please enter a valid email address.";
      if (v.length > 255) return "Email must be 255 characters or fewer.";
    } else if (type === "tel") {
      const phoneRe = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRe.test(v)) return "Please enter a valid phone number (digits only, 7–20 chars).";
    } else if (type === "number") {
      if (!/^\d+$/.test(v)) return "Please enter digits only.";
    } else if (type === "date") {
      if (Number.isNaN(Date.parse(v))) return "Please enter a valid date.";
    } else {
      if (v.length > 2000) return "Input is too long.";
    }
    return "";
  };

  const progress = Math.round((currentStep / TOTAL_STEPS) * 100);

  const stepFieldSpecs: Record<number, Array<{ key: string; type: string }>> = {
    1: [
      { key: "fullName", type: "text" },
      { key: "email", type: "email" },
      { key: "phone", type: "tel" },
      { key: "institution", type: "text" },
      { key: "position", type: "text" },
      { key: "qualifications", type: "text" },
    ],
    2: [
      { key: "state", type: "text" },
      { key: "city", type: "text" },
      { key: "address", type: "text" },
      { key: "zip", type: "text" },
    ],
    3: [
      { key: "proposedTitle", type: "text" },
      { key: "proposedSubtitle", type: "text" },
    ],
    4: [
      { key: "briefSummary", type: "text" },
      { key: "keyFeatures", type: "text" },
      { key: "tableOfContents", type: "text" },
      { key: "audience", type: "text" },
      { key: "wordCount", type: "number" },
      { key: "illustrations", type: "number" },
      { key: "languages", type: "text" },
    ],
    5: [
      { key: "competingTitles", type: "text" },
      { key: "uniqueContribution", type: "text" },
    ],
    6: [{ key: "submissionDate", type: "date" }],
    7: [
      { key: "additionalNotes", type: "text" },
      { key: "permissions", type: "text" },
    ],
  };

  const validateCurrentStep = (): boolean => {
    const specs = stepFieldSpecs[currentStep] || [];
    const newErrors: Record<string, string> = {};
    specs.forEach(({ key, type }) => {
      const err = validateField(key, formData[key] || "", type);
      if (err) newErrors[key] = err;
    });
    if (currentStep === 1 && hasCoAuthors === "yes") {
      const count = parseInt(coAuthorCount) || 1;
      for (let i = 0; i < count; i++) {
        const nameErr = validateField(`coauthor-${i}-name`, formData[`coauthor-${i}-name`] || "", "text");
        if (nameErr) newErrors[`coauthor-${i}-name`] = nameErr;
        const emailErr = validateField(`coauthor-${i}-email`, formData[`coauthor-${i}-email`] || "", "email");
        if (emailErr) newErrors[`coauthor-${i}-email`] = emailErr;
        const affErr = validateField(`coauthor-${i}-affiliation`, formData[`coauthor-${i}-affiliation`] || "", "text");
        if (affErr) newErrors[`coauthor-${i}-affiliation`] = affErr;
      }
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Please complete the required fields",
        description: "Some entries are missing or invalid.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Please complete the required fields",
        description: "Some entries are missing or invalid.",
        variant: "destructive",
      });
      return;
    }
    if (!cvFile) {
      toast({ title: "CV is required", description: "Please upload your CV in Step 1.", variant: "destructive" });
      setCurrentStep(1);
      return;
    }
    if (sampleFiles.length === 0) {
      toast({ title: "Sample chapter required", description: "Please upload at least one sample chapter.", variant: "destructive" });
      return;
    }

    // Build authors array
    const splitName = (full: string): { firstName: string; lastName: string } => {
      const parts = (full || "").trim().split(/\s+/);
      if (parts.length <= 1) return { firstName: parts[0] || "", lastName: "" };
      return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
    };

    const primary = splitName(formData.fullName || "");
    const authors: ProposalAuthor[] = [
      {
        role: "author",
        firstName: primary.firstName,
        lastName: primary.lastName,
        email: formData.email || "",
        phone: formData.phone,
        position: formData.position,
        institution: formData.institution,
        country: country || formData.country,
        biography: formData.qualifications,
      },
    ];
    if (hasCoAuthors === "yes") {
      const count = parseInt(coAuthorCount) || 1;
      for (let i = 0; i < count; i++) {
        const n = splitName(formData[`coauthor-${i}-name`] || "");
        const role = (coAuthorRoles[i] || "co-author").replace(/s$/, "") as ProposalAuthor["role"];
        authors.push({
          role: ["author", "co-author", "editor", "contributor", "translator"].includes(role) ? role : "co-author",
          firstName: n.firstName,
          lastName: n.lastName,
          email: formData[`coauthor-${i}-email`] || "",
          institution: formData[`coauthor-${i}-affiliation`] || "",
        });
      }
    }

    const payload = {
      authors,
      mailing: {
        addressLine1: formData.address || "",
        city: formData.city || "",
        state: formData.state || "",
        postalCode: formData.zip || "",
        country: country || "",
      },
      book: {
        title: formData.proposedTitle || "",
        subtitle: formData.proposedSubtitle,
        type: (bookType === "edited" ? "edited" : "monograph") as "monograph" | "edited",
        subject: formData.languages || "General",
        language: "English",
        estimatedWordCount: parseInt(formData.wordCount || "0", 10) || 0,
        estimatedCompletionDate: formData.submissionDate || "",
        isPreviouslyPublished: false,
        hasIllustrations: (parseInt(formData.illustrations || "0", 10) || 0) > 0,
        illustrationCount: parseInt(formData.illustrations || "0", 10) || 0,
        hasTables: false,
      },
      description: {
        abstract: formData.briefSummary || "",
        tableOfContents: formData.tableOfContents || "",
        keyFeatures: formData.keyFeatures || "",
        uniqueSellingPoints: formData.uniqueContribution || "",
      },
      marketing: {
        targetAudience: formData.audience || "",
        competingTitles: formData.competingTitles || "",
      },
      manuscript: {},
      agreement: {
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
        signedBy: formData.fullName || "",
        signedAt: new Date().toISOString(),
      },
    };

    setIsSubmitting(true);
    try {
      const res = await submitProposal(payload, {
        cv: cvFile,
        sampleChapters: sampleFiles,
        additionalFiles: supportingFiles,
      });
      if (res?.data?.referenceNumber) setReferenceNumber(res.data.referenceNumber);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCoAuthorFields = () => {
    const count = parseInt(coAuthorCount) || 1;
    return Array.from({ length: count }, (_, i) => (
      <div key={i} className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-base font-semibold text-foreground">
          Co-authors / Editors / Contributors / Translators {i + 1}
        </h3>
        <div className="space-y-1">
          <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
            Role <span className="text-accent font-normal italic">(Required)</span>
          </Label>
          <RadioGroup
            value={coAuthorRoles[i] || ""}
            onValueChange={(v) => setCoAuthorRoles((prev) => ({ ...prev, [i]: v }))}
            className="flex flex-wrap gap-4 pt-1"
          >
            {["Co-authors", "Editors", "Contributors", "Translators"].map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <RadioGroupItem value={role.toLowerCase()} id={`role-${i}-${role}`} />
                <Label htmlFor={`role-${i}-${role}`} className="font-normal cursor-pointer">
                  {role}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <FieldInput label={`Co-author ${i + 1} Name`} required value={formData[`coauthor-${i}-name`] || ""} onChange={(v) => updateField(`coauthor-${i}-name`, v)} error={errors[`coauthor-${i}-name`]} />
        <FieldInput label={`Co-author ${i + 1} Email`} type="email" required value={formData[`coauthor-${i}-email`] || ""} onChange={(v) => updateField(`coauthor-${i}-email`, v)} error={errors[`coauthor-${i}-email`]} />
        <FieldInput label={`Co-author ${i + 1} Affiliation`} required value={formData[`coauthor-${i}-affiliation`] || ""} onChange={(v) => updateField(`coauthor-${i}-affiliation`, v)} error={errors[`coauthor-${i}-affiliation`]} />
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Book Proposal Form</h1>
          <PageBreadcrumb currentPage="Book Proposal Form" />
        </div>
      </div>

      <main>
        {/* Form Section */}
        <section className="py-12 bg-white">
          {isSubmitted ? (
            <div className="container-wide max-w-3xl mx-auto text-center py-16">
              <p className="text-muted-foreground mb-12 text-sm">
                Please note that we publish in English only and do not provide translation services at this time.
                Submissions in languages other than English will not be considered for publication.
              </p>
              <h2 className="font-baskerville text-[40px] leading-[1.2] text-[#333333] mb-10">Submission Successful</h2>
              <div className="flex justify-center mb-10">
                <CheckCircle2 className="w-24 h-24 text-[#1F9D55] stroke-[1.5]" />
              </div>
              {referenceNumber && (
                <p className="text-[#333333] text-base mb-6">
                  Your reference number: <span className="font-semibold">{referenceNumber}</span>
                </p>
              )}
              <p className="text-[#333333] text-base leading-relaxed mb-8 max-w-2xl mx-auto">
                Once you have completed and submitted your proposal, it will be carefully reviewed by our editorial team.
                We will evaluate its suitability for publication, taking into account factors such as originality,
                scholarly contribution, and alignment with our publishing programme. You can expect to receive a
                response within six weeks of submission. At that stage, we will inform you whether your proposal has
                been accepted for publication, requires further development, or cannot be taken forward.
              </p>
              <p className="text-[#333333] text-base leading-relaxed max-w-2xl mx-auto">
                If your proposal is successful, we will guide you through the next steps, which include formalizing the
                contributor agreement and preparing your manuscript for submission.
              </p>
            </div>
          ) : (
          <div className="container-wide max-w-7xl mx-auto">
            {/* Notice */}
            <p className="text-muted-foreground mb-8 text-sm md:text-sm">
              Please note that we publish in English only and do not provide translation services at this time.
              Submissions in languages other than English will not be considered for publication.
            </p>

            {/* Progress */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
              <div className="relative w-full">
                <Progress value={progress} className="h-6 bg-muted" />
                <span
                  className="absolute inset-0 flex items-center justify-start pl-2 text-xs font-semibold text-primary-foreground"
                  style={{ width: `${progress}%` }}
                >
                  {progress}%
                </span>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === 1 && (
                <>
                  <FieldInput label="Full Name" required value={formData.fullName} onChange={(v) => updateField("fullName", v)} error={errors.fullName} />
                  <FieldInput label="Email Address" type="email" required value={formData.email} onChange={(v) => updateField("email", v)} error={errors.email} />
                  <FieldInput label="Phone Number" type="tel" required value={formData.phone} onChange={(v) => updateField("phone", v)} error={errors.phone} />
                  <FieldInput label="Institution or Organisation" required value={formData.institution} onChange={(v) => updateField("institution", v)} error={errors.institution} />
                  <FieldInput label="Current Position" required value={formData.position} onChange={(v) => updateField("position", v)} error={errors.position} />
                  <FieldInput label="Academic/Professional Qualifications" required value={formData.qualifications} onChange={(v) => updateField("qualifications", v)} error={errors.qualifications} />

                  <div className="space-y-1">
                    <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                      CV Upload (PDF/DOCX) <span className="text-accent font-normal italic">(Required)</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background cursor-pointer hover:bg-muted transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        Choose File
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          className="hidden"
                          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      <span className="text-sm text-muted-foreground">{cvFile ? cvFile.name : "No file chosen"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Max. file size: 10 MB.</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                      Co-authors / Editors / Contributors / Translators{" "}
                      <span className="text-accent font-normal italic">(Required)</span>
                    </Label>
                    <RadioGroup value={hasCoAuthors} onValueChange={setHasCoAuthors} className="flex gap-6 pt-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="coauthors-yes" />
                        <Label htmlFor="coauthors-yes" className="font-normal cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="coauthors-no" />
                        <Label htmlFor="coauthors-no" className="font-normal cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {hasCoAuthors === "yes" && (
                    <>
                      <div className="space-y-1">
                        <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          How many Co-authors / Editors / Contributors / Translators{" "}
                          <span className="text-accent font-normal italic">(Required)</span>
                        </Label>
                        <Select value={coAuthorCount} onValueChange={setCoAuthorCount}>
                          <SelectTrigger className="max-w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {renderCoAuthorFields()}
                    </>
                  )}
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2 className="text-2xl font-serif text-foreground pb-2">Mailing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                      <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                        Country <span className="text-accent font-normal italic">(Required)</span>
                      </Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Please Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Afghanistan","Albania","Algeria","Argentina","Armenia","Australia","Austria","Azerbaijan",
                            "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
                            "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei Darussalam","Bulgaria",
                            "Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Chad","Chile","China","Colombia",
                            "Congo","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti",
                            "Dominican Republic","Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Fiji","Finland",
                            "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala","Guinea","Haiti",
                            "Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
                            "Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan",
                            "Latvia","Lebanon","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malawi",
                            "Malaysia","Maldives","Mali","Malta","Mexico","Moldova","Monaco","Mongolia","Montenegro",
                            "Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua",
                            "Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Panama","Papua New Guinea",
                            "Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russian Federation",
                            "Rwanda","Saudi Arabia","Senegal","Serbia","Sierra Leone","Singapore","Slovakia","Slovenia",
                            "Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Sweden","Switzerland",
                            "Taiwan","Tajikistan","Tanzania","Thailand","Togo","Trinidad and Tobago","Tunisia",
                            "Türkiye","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
                            "Uruguay","Uzbekistan","Venezuela","Viet Nam","Yemen","Zambia","Zimbabwe",
                          ].map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FieldInput label="State / Province / Region / County" required value={formData.state} onChange={(v) => updateField("state", v)} error={errors.state} />
                    <FieldInput label="City" required value={formData.city} onChange={(v) => updateField("city", v)} error={errors.city} />
                    <FieldInput label="Address" required value={formData.address} onChange={(v) => updateField("address", v)} error={errors.address} />
                    <div className="md:col-span-1">
                      <FieldInput label="ZIP / Postal Code" required value={formData.zip} onChange={(v) => updateField("zip", v)} error={errors.zip} />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h2 className="text-2xl font-serif text-foreground pb-2">Book Details</h2>
                  <FieldInput label="Proposed Title" required value={formData.proposedTitle} onChange={(v) => updateField("proposedTitle", v)} error={errors.proposedTitle} />
                  <FieldInput label="Proposed Subtitle" required value={formData.proposedSubtitle} onChange={(v) => updateField("proposedSubtitle", v)} error={errors.proposedSubtitle} />
                  <div className="space-y-1">
                    <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                      Type of Book <span className="text-accent font-normal italic">(Required)</span>
                    </Label>
                    <RadioGroup value={bookType} onValueChange={setBookType} className="flex flex-col gap-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monograph" id="type-monograph" />
                        <Label htmlFor="type-monograph" className="font-normal cursor-pointer">
                          Monograph
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="edited" id="type-edited" />
                        <Label htmlFor="type-edited" className="font-normal cursor-pointer">
                          Edited Collection
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <h2 className="text-2xl font-serif text-foreground pb-2">Book Description</h2>
                  <FieldTextarea label="Brief Summary of the Book (approx. 200–500 words)" required rows={6} value={formData.briefSummary} onChange={(v) => updateField("briefSummary", v)} error={errors.briefSummary} />
                  <FieldTextarea label="Key Features or Selling Points" required rows={4} value={formData.keyFeatures} onChange={(v) => updateField("keyFeatures", v)} error={errors.keyFeatures} />
                  <FieldTextarea label="Table of Contents (chapter list or outline)" required rows={6} value={formData.tableOfContents} onChange={(v) => updateField("tableOfContents", v)} error={errors.tableOfContents} />
                  <FieldTextarea label="Intended Audience" required rows={3} value={formData.audience} onChange={(v) => updateField("audience", v)} error={errors.audience} />
                  <FieldInput label="Estimated final word count (between 35,000 and 200,000 words)" type="number" required value={formData.wordCount} onChange={(v) => updateField("wordCount", v)} error={errors.wordCount} />
                  <FieldInput label="Number of illustrations/figures/tables (if any)" type="number" required value={formData.illustrations} onChange={(v) => updateField("illustrations", v)} error={errors.illustrations} />
                  <FieldInput label="Languages used (if more than English)" required value={formData.languages} onChange={(v) => updateField("languages", v)} error={errors.languages} />
                </>
              )}

              {currentStep === 5 && (
                <>
                  <h2 className="text-2xl font-serif text-foreground pb-2">Marketing and Promotion</h2>
                  <FieldTextarea
                    label="Competing Titles (minimum two examples with author, title, and publisher)"
                    required
                    rows={4}
                    value={formData.competingTitles}
                    onChange={(v) => updateField("competingTitles", v)}
                    error={errors.competingTitles}
                  />
                  <FieldTextarea
                    label="What unique contribution does your book make compared to these existing titles?"
                    required
                    rows={4}
                    value={formData.uniqueContribution}
                    onChange={(v) => updateField("uniqueContribution", v)}
                    error={errors.uniqueContribution}
                  />
                </>
              )}

              {currentStep === 6 && (
                <>
                  <h2 className="text-2xl font-serif text-foreground pb-2">Manuscript Status</h2>
                  <div className="space-y-1">
                    <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                      Current stage of the manuscript <span className="text-accent font-normal italic">(Required)</span>
                    </Label>
                    <Select value={manuscriptStage} onValueChange={setManuscriptStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not yet started</SelectItem>
                        <SelectItem value="in-progress">In progress</SelectItem>
                        <SelectItem value="draft-completed">Draft completed</SelectItem>
                        <SelectItem value="finalised">Finalised</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FieldInput label="When do you expect to submit the final manuscript?" type="date" required value={formData.submissionDate} onChange={(v) => updateField("submissionDate", v)} error={errors.submissionDate} />
                </>
              )}

              {currentStep === 7 && (
                <>
                  <h2 className="text-2xl font-serif text-foreground pb-2">Sample Material</h2>

                  <div className="space-y-1">
                    <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                      Upload at least one sample chapter <span className="text-accent font-normal italic">(Required)</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background cursor-pointer hover:bg-muted transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        Choose Files
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setSampleFiles(Array.from(e.target.files || []))}
                        />
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {sampleFiles.length > 0 ? sampleFiles.map((f) => f.name).join(", ") : "No files chosen"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Max. file size: 2 GB.</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                      Upload additional supporting files <span className="text-accent font-normal italic">(Required)</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background cursor-pointer hover:bg-muted transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        Choose Files
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setSupportingFiles(Array.from(e.target.files || []))}
                        />
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {supportingFiles.length > 0 ? supportingFiles.map((f) => f.name).join(", ") : "No files chosen"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Max. file size: 2 GB.</p>
                  </div>

                  <h2 className="text-2xl font-serif text-foreground pb-2 pt-4">Additional Comments and Permissions</h2>
                  <FieldTextarea label="Any additional notes or context from the author" required rows={4} value={formData.additionalNotes} onChange={(v) => updateField("additionalNotes", v)} error={errors.additionalNotes} />
                  <FieldTextarea
                    label="Are there any permissions you need to obtain from other copyright holders?"
                    required
                    rows={3}
                    value={formData.permissions}
                    onChange={(v) => updateField("permissions", v)}
                    error={errors.permissions}
                  />

                  <p className="text-sm text-muted-foreground pt-4">
                    Please check over your information thoroughly and click the submit button below.
                  </p>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-10 pt-6">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious} className="px-8 py-3 rounded-none text-sm font-semibold tracking-wider">
                  PREVIOUS
                </Button>
              )}

              {currentStep < TOTAL_STEPS ? (
                <Button onClick={handleNext} className="px-8 py-3 rounded-none text-sm font-semibold tracking-wider bg-[#e4573d] hover:bg-[#e4573d]/90 text-white">
                  NEXT
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 rounded-none text-sm font-semibold tracking-wider bg-[#e4573d] hover:bg-[#e4573d]/90 text-white gap-2">
                  {isSubmitting ? (
                    "SUBMITTING..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SUBMIT
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

const FieldInput = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  error,
  maxLength,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  maxLength?: number;
}) => (
  <div className="space-y-1">
    <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
      {label} {required && <span className="text-accent font-normal italic">(Required)</span>}
    </Label>
    <Input
      type={type === "number" ? "text" : type}
      inputMode={type === "tel" ? "tel" : type === "number" ? "numeric" : undefined}
      required={required}
      value={value ?? ""}
      maxLength={maxLength ?? (type === "email" ? 255 : type === "tel" ? 20 : 500)}
      onChange={(e) => {
        let v = e.target.value;
        if (type === "tel") v = v.replace(/[^0-9+\s\-()]/g, "");
        if (type === "number") v = v.replace(/[^0-9]/g, "");
        onChange?.(v);
      }}
      className={`border rounded-none shadow-none focus-visible:ring-0 px-3 py-2 bg-[#f5f5f5] ${error ? "border-destructive" : "border-input"}`}
      aria-invalid={!!error}
    />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

const FieldTextarea = ({
  label,
  required,
  rows = 4,
  value,
  onChange,
  error,
  maxLength = 2000,
}: {
  label: string;
  required?: boolean;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  maxLength?: number;
}) => (
  <div className="space-y-1">
    <Label className="text-[16px] font-bold text-[#696969]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
      {label} {required && <span className="text-accent font-normal italic">(Required)</span>}
    </Label>
    <Textarea
      required={required}
      rows={rows}
      value={value ?? ""}
      maxLength={maxLength}
      onChange={(e) => onChange?.(e.target.value)}
      className={`border rounded-none shadow-none focus-visible:ring-0 px-3 py-2 bg-[#f5f5f5] resize-vertical ${error ? "border-destructive" : "border-input"}`}
      aria-invalid={!!error}
    />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export default SubmitProposal;
