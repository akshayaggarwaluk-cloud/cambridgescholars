import { useState, useRef } from "react";
import { Mail, MapPin, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import contactHero from "@/assets/contact-hero.jpg";

// Google's test site key - replace with your own for production
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "Lady Stephenson Library, Newcastle upon Tyne NE6 2PA, United Kingdom",
  },
  {
    icon: Mail,
    title: "Contact",
    content: "Mail: admin@cambridgescholars.com",
  },
  {
    icon: Clock,
    title: "Hours Of Operation",
    content: "Monday – Friday: 09:00 – 17:00",
  },
];
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValue) {
      toast.error("Please verify that you're not a robot");
      return;
    }
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setCaptchaValue(null);
    recaptchaRef.current?.reset();
    setSubmitted(true);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Contact Us</h1>
          <PageBreadcrumb currentPage="Contact" />
        </div>
      </div>

      <main className="py-16 bg-white">
        {/* Contact Info */}
        <section className="pb-20">
          <div className="container-wide">
            <h2 className="font-serif text-foreground mb-4 text-4xl font-medium tracking-wide">Keep In Touch With Us</h2>
            <p className="mb-12 w-full" style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: "15px", color: "#7E7E7E", marginTop: "14px" }}>
              If you have any questions regarding proposal submissions, book purchases, or any aspect of our publication
              process, we would be happy to hear from you. Please use the contact details below to get in touch, and we
              will respond as promptly as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactInfo.map((info) => (
                <div key={info.title}>
                  <div className="flex items-center gap-3 mb-2">
                    <info.icon className="h-6 w-6 text-mustard shrink-0" />
                    <h3 className="font-semibold text-xl tracking-wider">{info.title}</h3>
                  </div>
                  <p style={{ fontFamily: '"Libre Baskerville", serif', fontSize: "15px", color: "#7E7E7E" }}>{info.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Centered Contact Form */}
        <section className="pb-24">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-20">
              <div
                role="img"
                aria-label="Cambridge Scholars Publishing interior — wooden staircase"
                className="w-full aspect-[3/4] bg-no-repeat"
                style={{
                  backgroundImage: `url(${contactHero})`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: "left center",
                }}
              />
              <div
                role="img"
                aria-label="Cambridge Scholars Publishing interior — seating"
                className="w-full aspect-[3/4] bg-no-repeat"
                style={{
                  backgroundImage: `url(${contactHero})`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: "right center",
                }}
              />
            </div>
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-center mb-12 text-4xl tracking-wide">Send A Message</h2>

              {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input id="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Subject */}
                <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full h-12 border border-input rounded-md px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  >
                    <option value="">Select Purpose</option>
                    <option value="Proposals">Proposals</option>
                    <option value="Mailing">Mailing</option>
                    <option value="Queries">Queries</option>
                </select>

                {/* Message */}
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                {/* reCAPTCHA */}
                <div className="py-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(value) => setCaptchaValue(value)}
                    onExpired={() => setCaptchaValue(null)}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="bg-accent hover:bg-black text-white font-semibold px-12 py-3 rounded-none transition-colors"
                >
                  SUBMIT
                </Button>
              </form>
              ) : (
                <p
                  className="mt-8 text-center"
                  style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: "18px", color: "#7E7E7E" }}
                  role="status"
                  aria-live="polite"
                >
                  Thanks for contacting us! We will get in touch with you shortly.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
