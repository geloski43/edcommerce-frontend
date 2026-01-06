import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Video,
  Download,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});
import { Link } from "@tanstack/react-router";

function HomePage() {
  const features = [
    {
      // Use shadcn's text-primary (main accent)
      icon: <BookOpen className="w-10 h-10 text-primary" />,
      title: "High-Quality Learning Materials",
      description:
        "Access curated ebooks, PDFs, and guides designed to help you learn faster and smarter, instantly available for download.",
      span: "col-span-2",
    },
    {
      // Use shadcn's text-secondary (secondary accent, if configured) or stick to a primary tint
      icon: <Video className="w-10 h-10 text-secondary" />,
      title: "Actionable Video Tutorials",
      description:
        "Practical, real-world topics you can apply immediately to boost your proficiency.",
      span: "col-span-1",
    },
    {
      icon: <Zap className="w-10 h-10 text-primary" />,
      title: "Live Expert Q&A Sessions",
      description:
        "Connect directly with creators for personalized guidance and deep dives into complex topics.",
      span: "col-span-1",
    },
    {
      icon: <Download className="w-10 h-10 text-secondary" />,
      title: "Instant Digital Delivery",
      description:
        "Purchase once and download instantly, with lifetime access guaranteed.",
      span: "col-span-1",
    },
    {
      icon: <CreditCard className="w-10 h-10 text-primary" />,
      title: "Secure & Seamless Checkout",
      description:
        "Protected by modern encryption standards for peace of mind.",
      span: "col-span-1",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-secondary" />,
      title: "Reliable & Trustworthy Platform",
      description:
        "Built with modern technology to ensure reliability and performance.",
      span: "col-span-2",
    },
    {
      icon: <Sparkles className="w-10 h-10 text-primary" />,
      title: "Empowering Creators",
      description:
        "A platform designed to support digital creators and monetize their knowledge.",
      span: "col-span-4",
    },
  ];

  // Define the core branding gradient (primary/secondary)
  const brandGradientClass =
    "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(163,230,53,0.7)]";

  return (
    <>
      {/* HERO SECTION - Now fully using shadcn classes */}
      <section
        // Replace inline style with bg-background class (inherited from <body> in root)
        className="relative py-32 px-6 overflow-hidden
                   border-b border-border/50 bg-background"
      >
        {/* Background gradient maintained, but using shadcn colors (muted/background)
            Note: You may need to define indigo-950 and black in your shadcn colors
            if you want this exact gradient, otherwise, using black/background is safer.
        */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-color-muted)_0%,_var(--tw-color-background)_100%)] opacity-80" />

        <div className="relative max-w-5xl mx-auto text-center md:text-left">
          <div className="mb-8">
            {/* Main Title Text - Use text-foreground (main text color) */}
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-none text-foreground">
              <span className="text-foreground/80">ED</span>{" "}
              {/* COMMERCE: Accent gradient */}
              <span className={brandGradientClass}>COMMERCE</span>
            </h1>
          </div>

          {/* Tagline uses text-foreground */}
          <p className="text-2xl md:text-4xl mb-6 font-semibold md:max-w-4xl opacity-90 text-foreground/90">
            Digital products for learning, growth, and mastery
          </p>

          {/* Description text uses text-muted-foreground */}
          <p className="text-lg max-w-3xl mx-auto md:mx-0 mb-12 text-muted-foreground">
            Ed Commerce is your curated marketplace for premium learning
            materials, expert tutorials, and digital resources—instantly
            available upon purchase and designed for success.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5">
            {/* Primary CTA: Use standard shadcn Button classes or build custom
                using bg-primary and text-primary-foreground
            */}
            <Link to="/categories">
              <span
                // Primary button style: bg-primary, text-primary-foreground
                className="group flex items-center justify-center gap-2 px-10 py-4
                         bg-primary text-primary-foreground font-bold text-lg rounded-xl transition-all duration-300
                         shadow-[0_0_25px_rgba(163,230,53,0.7)] hover:shadow-[0_0_35px_rgba(163,230,53,1)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Browse Products
                <ArrowRight className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            {/* Secondary CTA: Use border-primary/20 and hover:border-secondary */}
            <Link to="/about">
              <span
                className="px-10 py-4 border-2 border-border hover:border-secondary
                         text-foreground font-semibold text-lg rounded-xl transition-colors duration-300 opacity-80"
              >
                Learn About Us
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION: Puzzle Grid Layout */}
      <section
        // Replace inline style with bg-background class
        className="py-24 px-6 max-w-7xl mx-auto bg-background"
      >
        {/* Title uses text-foreground */}
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
          EdCommerce Core Advantages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                // Use bg-card (surface), border-border, and primary hover states
                bg-card/50 border border-border rounded-2xl p-8
                transition-all duration-500 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/20 flex flex-col justify-between

                ${feature.span === "col-span-2" ? "lg:col-span-2" : ""}
                ${feature.span === "col-span-4" ? "lg:col-span-4 text-center" : "lg:col-span-1"}

                sm:col-span-2
              `}
            >
              <div>
                <div className="mb-4">{feature.icon}</div>
                {/* Title and Description Text use text-foreground and text-muted-foreground */}
                <h3 className="text-xl font-bold mb-2 tracking-wide text-foreground">
                  {feature.title}
                </h3>
                <p className="leading-relaxed opacity-70 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              {feature.span !== "col-span-4" && (
                <ArrowRight className="w-5 h-5 mt-4 text-secondary self-end opacity-75" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        // Use bg-card/secondary/background and primary border accent
        className="py-20 px-6 bg-secondary/10 border-t-4 border-primary/50 text-center"
      >
        {/* Title uses text-foreground */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
          Level Up Your Skills Today
        </h2>
        {/* Description uses text-muted-foreground */}
        <p className="text-xl max-w-3xl mx-auto mb-10 opacity-80 text-muted-foreground">
          Explore our growing catalog of professional digital products and
          achieve mastery in your field at your own pace.
        </p>
        <Link
          to="/cart"
          // Button uses primary/secondary gradient with text-primary-foreground
          className="inline-block px-12 py-4 text-xl bg-gradient-to-r from-primary to-secondary
                     text-primary-foreground font-extrabold rounded-lg shadow-2xl shadow-primary/50
                     hover:opacity-90 transition-all duration-300 hover:scale-[1.05]"
        >
          Visit the Digital Store
        </Link>
      </section>
    </>
  );
}
