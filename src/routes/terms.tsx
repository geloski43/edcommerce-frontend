import { createFileRoute } from "@tanstack/react-router";
import { Scale, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  const sections = [
    {
      id: "license",
      title: "1. Digital License",
      legal:
        "Upon purchase, EdCommerce grants you a non-exclusive, non-transferable, revocable license to access and use the digital assets for personal, non-commercial purposes only.",
      plain:
        "You can use what you buy for yourself, but you can't resell it or give it away to others.",
    },
    {
      id: "refunds",
      title: "2. No-Refund Policy",
      legal:
        "Due to the digital nature of the products, all sales are final. Access is granted immediately upon successful payment, constituting full delivery of the service.",
      plain:
        "Because you get the files instantly, we can't 'take them back,' so we don't offer refunds.",
    },
    {
      id: "conduct",
      title: "3. Prohibited Conduct",
      legal:
        "Users are prohibited from attempting to circumvent digital rights management (DRM), scraping site data, or sharing account credentials with third parties.",
      plain:
        "Don't try to hack our system or share your login with your friends.",
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      <header className="py-20 px-6 border-b border-border/50 bg-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <Scale className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-4">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
            Last Updated: January 2026
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-12 space-y-12">
        <div className="grid md:grid-cols-2 gap-8 mb-8 text-xs font-black uppercase tracking-widest opacity-50">
          <span>Formal Legal Terms</span>
          <span className="text-primary">The "Plain English" Version</span>
        </div>

        {sections.map((section) => (
          <div
            key={section.id}
            className="grid md:grid-cols-2 gap-8 p-8 bg-card border border-border rounded-3xl group hover:border-primary/30 transition-colors"
          >
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                {section.legal}
              </p>
            </div>
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex gap-4">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm font-medium text-foreground">
                {section.plain}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
