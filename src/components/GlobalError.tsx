import { AlertTriangle, RotateCcw } from "lucide-react";
import { ErrorComponentProps, useRouter } from "@tanstack/react-router";

export default function GlobalError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  const handleRetry = async () => {
    // 1. Clear the router cache to ensure we don't just reload the error
    await router.invalidate();

    // 2. Reset the error boundary state
    reset();
  };
  return (
    <div className="min-h-150 flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
          System Error
        </h1>

        <p className="text-muted-foreground text-sm font-medium mb-8">
          {error instanceof Error
            ? error.message
            : "An unexpected synchronization or API error occurred."}
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            TRY AGAIN
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
