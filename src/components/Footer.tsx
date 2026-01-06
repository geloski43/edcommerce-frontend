import { Mail, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Define footer link groups (Unchanged)
  const links = [
    {
      title: "Company",
      items: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
      ],
    },
    {
      title: "Products",
      items: [
        { name: "All Courses", href: "/categories" },
        { name: "E-Books", href: "/cart" },
        { name: "Tutorials", href: "/cart" },
      ],
    },
    {
      title: "Support",
      items: [
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Terms & Privacy", href: "/terms" },
      ],
    },
  ];

  // Custom text color lookup for the main brand text (Assumes primary/secondary gradient)
  const brandTextColorClass =
    "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary";

  return (
    <footer
      // Use bg-card (footer surface) and text-muted-foreground (subdued text color)
      className="w-full bg-card text-muted-foreground border-t border-border pt-16 pb-8 px-6"
    >
      <div className="container mx-auto max-w-7xl">
        <div
          // Use border-border for the divider
          className="grid grid-cols-2 gap-8 md:grid-cols-5 border-b border-border pb-12"
        >
          {/* Brand and Mission Statement */}
          <div className="col-span-2 md:col-span-2 pr-8">
            <h3
              // Use text-foreground for prominent white/dark text
              className="text-3xl font-extrabold text-foreground mb-4"
            >
              <span className="text-foreground opacity-70">ED</span>
              <span className={brandTextColorClass}>COMMERCE</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The marketplace for premium digital learning. Empowering creators
              and lifelong learners with instant access to high-quality
              resources.
            </p>
          </div>

          {/* Navigation Link Columns */}
          {links.map((group) => (
            <div key={group.title} className="col-span-1">
              <h4
                // Use text-foreground for heading titles
                className="text-lg font-semibold text-foreground mb-4"
              >
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      // Hover uses the primary accent color
                      className="text-sm hover:text-primary transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright and Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8">
          <p className="text-sm mb-4 md:mb-0 text-muted-foreground">
            &copy; {currentYear} EdCommerce. All rights reserved.
          </p>

          {/*<div className="flex space-x-6">
            <a
              href="#"
              aria-label="GitHub"
              // Social icons use subdued text with primary hover
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>*/}
        </div>
      </div>
    </footer>
  );
}
