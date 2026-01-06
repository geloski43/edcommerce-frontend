import { createFileRoute } from "@tanstack/react-router";
import {
  Mail,
  MessageSquare,
  Send,
  Clock,
  Globe,
  Twitter,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Add your form submission logic here
  };

  const brandGradient =
    "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary";

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* --- HERO SECTION --- */}
      <header className="py-20 px-6 border-b border-border/50 bg-card/20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
            Get In <span className={brandGradient}>Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a question about a product or need technical assistance? Our
            team is ready to help you level up.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-16 grid lg:grid-cols-3 gap-12">
        {/* --- LEFT: CONTACT INFO --- */}
        <div className="lg:col-span-1 space-y-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">
              Support Channels
            </h2>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Email Support</h4>
                <p className="text-xs text-muted-foreground mb-1">
                  support@edcommerce.com
                </p>
                <p className="text-[10px] text-primary font-black uppercase">
                  24h Response Time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Operating Hours</h4>
                <p className="text-xs text-muted-foreground">
                  Mon - Fri: 9AM - 6PM
                </p>
                <p className="text-[10px] text-muted-foreground uppercase opacity-50">
                  GMT +8 (PST)
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase italic tracking-tight">
              Social Connect
            </h2>
            <div className="flex gap-3">
              <button className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <Globe className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>

        {/* --- RIGHT: CONTACT FORM --- */}
        <div className="lg:col-span-2">
          <div className="bg-card border-2 border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {submitted ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-black uppercase italic mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground mb-8">
                  We've received your request. Check your inbox soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-bold uppercase tracking-widest text-xs hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">
                    Subject
                  </label>
                  <select className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none">
                    <option>Product Question</option>
                    <option>Download Issue</option>
                    <option>Payment/Billing</option>
                    <option>Partnership Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can we help you today?"
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-black uppercase italic tracking-tighter py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                  Transmit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* --- QUICK HELP FOOTER --- */}
      <section className="max-w-4xl mx-auto px-6 mt-20 text-center p-12 border-t border-border/50">
        <MessageSquare className="w-10 h-10 text-secondary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Looking for a faster answer?</h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Our FAQ covers 90% of common technical and billing issues.
        </p>
        <Link
          to="/faq"
          className="inline-block border border-primary text-primary px-8 py-3 rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all"
        >
          View FAQ Database
        </Link>
      </section>
    </div>
  );
}
