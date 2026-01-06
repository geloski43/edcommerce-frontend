import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Target,
  Globe,
  Zap,
  ArrowRight,
  Award,
  Rocket,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const brandGradientClass =
    "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]";

  const stats = [
    {
      label: "Digital Assets",
      value: "500+",
      icon: <Zap className="w-5 h-5 text-primary" />,
    },
    {
      label: "Active Learners",
      value: "10k+",
      icon: <Users className="w-5 h-5 text-secondary" />,
    },
    {
      label: "Global Creators",
      value: "50+",
      icon: <Globe className="w-5 h-5 text-primary" />,
    },
    {
      label: "Success Rate",
      value: "99%",
      icon: <Award className="w-5 h-5 text-secondary" />,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 px-6 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-color-primary)_0%,_transparent_100%)] opacity-5" />

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground uppercase italic">
            Behind <span className={brandGradientClass}>EDCOMMERCE</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We aren't just a marketplace. We are the bridge between expert
            knowledge and the ambitious individuals ready to master it.
          </p>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="py-12 border-b border-border/30 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-2">{stat.icon}</div>
                <span className="text-3xl font-black text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MISSION & VISION --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Our Mission
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Democratizing <span className="text-primary">Premium</span>{" "}
              Digital Education.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In a world flooded with noise, finding quality information is
              harder than ever. EdCommerce was founded to filter that noise. We
              partner with industry leaders to provide assets that aren't just
              informative, but{" "}
              <span className="text-foreground font-bold italic underline decoration-secondary">
                transformative
              </span>
              .
            </p>
            <ul className="space-y-4">
              {[
                "Curated quality over quantity",
                "Frictionless instant-download delivery",
                "Lifetime access to your growth library",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-semibold text-foreground/80"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            {/* Visual element representing a 'Digital Asset' or 'Learning Path' */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl group-hover:opacity-100 opacity-50 transition-opacity" />
            <div className="relative aspect-video bg-card border-2 border-border rounded-3xl p-8 flex flex-col justify-center items-center overflow-hidden">
              <Rocket className="w-20 h-20 text-primary mb-6 animate-bounce" />
              <p className="text-center font-black italic uppercase tracking-tighter text-2xl">
                Your Growth <br />{" "}
                <span className="text-secondary">Accelerated</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-16">
            The EdCommerce <span className="text-primary">Philosophy</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              title="Integrity"
              desc="Every asset is verified for accuracy and practical application before it hits our store."
            />
            <ValueCard
              title="Speed"
              desc="We believe in the power of now. Zero wait times. Instant delivery. Immediate learning."
            />
            <ValueCard
              title="Support"
              desc="We don't just sell files; we support journeys. Our Q&A sessions bridge the gap."
            />
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-card border-2 border-primary/30 p-12 rounded-[3rem] shadow-2xl shadow-primary/10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
            READY TO START YOUR CHAPTER?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of students and creators who are already using
            EdCommerce to build their future.
          </p>
          <Link
            to="/categories"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            EXPLORE THE MARKETPLACE
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors">
      <h4 className="text-xl font-black uppercase italic text-primary mb-4">
        {title}
      </h4>
      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}
