import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full bg-[var(--app-bg-color)]">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
      </div>
      <h2 className="mt-4 text-xs font-black tracking-[0.2em] uppercase text-muted-foreground animate-pulse">
        Ed Commerce
      </h2>
    </div>
  );
}
