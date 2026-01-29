import { useState } from "react";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
const contactInfo = [{
  icon: MapPin,
  title: "Address",
  content: "Lady Stephenson Library, Newcastle upon Tyne NE6 2PA, United Kingdom"
}, {
  icon: Mail,
  title: "Contact",
  content: "Mail: admin@cambridgescholars.com"
}, {
  icon: Clock,
  title: "Hours Of Operation",
  content: "Monday – Friday: 09:00 – 17:00"
}];
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isNotRobot, setIsNotRobot] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNotRobot) {
      toast.error("Please verify that you're not a robot");
      return;
    }
    toast.success("Message sent successfully!");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    setIsNotRobot(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };
  return <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif text-gray-800">Contact Us</h1>
          <PageBreadcrumb currentPage="Contact" />
        </div>
      </div>

      <main className="py-16">
        {/* Contact Info */}
        <section className="pb-20">
          <div className="container-wide">
            <h2 className="font-serif text-foreground mb-4 text-5xl">Keep In Touch With Us</h2>
            <p className="text-muted-foreground max-w-5xl mb-12 text-lg">
              If you have any questions regarding proposal submissions, book purchases, or any aspect of our publication process, we would be happy to hear from you. Please use the contact details below to get in touch, and we will respond as promptly as possible.

            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactInfo.map(info => <div key={info.title} className="flex items-start gap-4">
                  <info.icon className="h-6 w-6 text-accent" />
                  <div>
                    <h3 className="font-semibold mb-2 text-2xl">{info.title}</h3>
                    <p className="text-muted-foreground text-lg">{info.content}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Centered Contact Form */}
        <section className="pb-24">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-center mb-12 text-5xl">Send A Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input id="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                  <Input id="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>

                {/* Subject */}
                <select id="subject" value={formData.subject} onChange={handleChange} className="w-full h-12 border border-input rounded-md px-3 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required>
                  <option value="">Select Purpose</option>
                  <option value="Proposals">Proposals</option>
                  <option value="Mailing">Mailing</option>
                  <option value="Queries">Queries</option>
                </select>

                {/* Message */}
                <Textarea id="message" rows={6} placeholder="Message" value={formData.message} onChange={handleChange} required />

                {/* I'm not a robot */}
                <div className="flex items-center gap-4 p-4 border border-input rounded-md bg-muted/30 w-fit">
                  <Checkbox 
                    id="not-robot" 
                    checked={isNotRobot}
                    onCheckedChange={(checked) => setIsNotRobot(checked === true)}
                    className="h-6 w-6"
                  />
                  <label htmlFor="not-robot" className="text-sm font-medium cursor-pointer select-none">
                    I'm not a robot
                  </label>
                </div>

                {/* Submit */}
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-3 rounded-none">
                  SUBMIT
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}