import { Link } from "@tanstack/react-router";
import { ArrowLeft, Ban } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; // Assuming standard shadcn path

export default function NotFound() {
  return (
    // Use bg-background and text-foreground for the main container
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      {/* Icon */}
      <Ban className="w-20 h-20 text-primary mb-6" aria-hidden="true" />

      {/* Title */}
      <h1 className="text-8xl font-extrabold text-foreground tracking-tight">
        404
      </h1>

      {/* Subtitle */}
      <h2 className="text-3xl font-semibold text-foreground mb-4">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Oops! It looks like you've followed a broken link or entered a URL that
        doesn't exist on EdCommerce.
      </p>

      {/* Primary CTA (Using shadcn's buttonVariants for styling) */}
      <Link
        to="/"
        // Use the buttonVariants helper to apply standard shadcn button styling
        className={buttonVariants({ variant: "default", size: "lg" })}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Go Back Home
      </Link>

      {/* Secondary Information */}
      <div className="mt-8 text-sm text-muted-foreground">
        <p>If you believe this is an error, please contact support.</p>
      </div>
    </div>
  );
}
