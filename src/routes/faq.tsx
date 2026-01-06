import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Plus,
  Minus,
  MessageCircle,
  CreditCard,
  Download,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
});

type FAQItem = {
  question: string;
  answer: string;
  category: "General" | "Payments" | "Technical";
};

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: "General",
      question: "What exactly am I buying?",
      answer:
        "You are purchasing high-quality digital assets, which may include E-books (PDF), video tutorials (MP4), or source files depending on the product. Once purchased, these are yours to keep forever.",
    },
    {
      category: "Technical",
      question: "How do I access my downloads?",
      answer:
        "Immediately after checkout, you'll be redirected to a 'Thank You' page with download links. You can also access all your purchased assets anytime through the 'Orders' section in your sidebar menu.",
    },
    {
      category: "Payments",
      question: "What payment methods do you accept?",
      answer:
        "We support all major credit cards, PayPal, and local currencies (PHP/USD) via secure Stripe integration. Your payment data is encrypted and never stored on our servers.",
    },
    {
      category: "General",
      question: "Can I get a refund?",
      answer:
        "Due to the nature of digital products (which are accessible immediately upon purchase), we generally do not offer refunds. However, if there is a technical defect with the file, contact our support within 24 hours.",
    },
    {
      category: "Technical",
      question: "The download link expired. What do I do?",
      answer:
        "Our links are designed to be permanent for registered users. If you are having trouble, simply go to your Orders page and re-generate the link or contact our support team.",
    },
  ];

  const brandGradientClass =
    "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary";

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* --- HEADER --- */}
      <header className="py-20 px-6 border-b border-border/50 bg-card/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Support Center
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
            Common <span className={brandGradientClass}>Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about the EdCommerce platform and your
            digital assets.
          </p>
        </div>
      </header>

      {/* --- FAQ GRID --- */}
      <section className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group border rounded-3xl transition-all duration-300 ${
                openIndex === index
                  ? "bg-card border-primary/40 shadow-xl shadow-primary/5"
                  : "bg-card/50 border-border hover:border-primary/20"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded border transition-colors ${
                      openIndex === index
                        ? "bg-primary text-primary-foreground border-primary"
                        : "text-muted-foreground border-border"
                    }`}
                  >
                    {faq.category}
                  </span>
                  <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`p-2 rounded-full transition-transform duration-300 ${openIndex === index ? "rotate-180 bg-primary/10" : ""}`}
                >
                  <ChevronDown
                    className={`w-5 h-5 ${openIndex === index ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  <div className="pt-2 border-t border-border/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- QUICK CONTACT CARDS --- */}
      <section className="max-w-5xl mx-auto px-6 mt-24">
        <div className="grid md:grid-cols-3 gap-6">
          <ContactCard
            icon={<MessageCircle className="w-6 h-6 text-primary" />}
            title="Live Chat"
            description="Average response time: 2 hours"
            link="#"
          />
          <ContactCard
            icon={<Download className="w-6 h-6 text-primary" />}
            title="Download Help"
            description="Guide on managing your digital files"
            link="#"
          />
          <ContactCard
            icon={<ShieldCheck className="w-6 h-6 text-primary" />}
            title="Security"
            description="How we protect your purchases"
            link="#"
          />
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <div className="mt-24 text-center px-6">
        <p className="text-muted-foreground mb-6">
          Still have questions? We're here to help.
        </p>
        <Link
          to="/about"
          className="text-primary font-black uppercase italic tracking-tighter hover:underline flex items-center justify-center gap-2"
        >
          Contact Support Team <Plus className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  description,
  link,
}: {
  icon: any;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <a
      href={link}
      className="p-8 bg-card border border-border rounded-[2rem] hover:border-primary/50 hover:shadow-lg transition-all flex flex-col items-center text-center group"
    >
      <div className="mb-4 p-3 bg-muted rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-black uppercase italic text-foreground mb-2 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
        {description}
      </p>
    </a>
  );
}
