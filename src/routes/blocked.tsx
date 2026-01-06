import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, Mail, MessageSquare, Info } from "lucide-react";

export const Route = createFileRoute("/blocked")({
  component: BlockedPage,
});

function BlockedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Visual Identity */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-destructive/10 rounded-full animate-ping duration-[3000ms]" />
          <div className="relative w-24 h-24 bg-card border-2 border-destructive/20 text-destructive rounded-[2.5rem] flex items-center justify-center shadow-2xl">
            <ShieldAlert className="w-12 h-12" />
          </div>
        </div>

        {/* Primary Message */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Account <span className="text-destructive">Blocked</span>
          </h1>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Your access has been revoked by the system administrator. For
            security reasons, you have been logged out of all active sessions.
          </p>
        </div>

        {/* Admin Contact Card */}
        <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MessageSquare className="w-12 h-12 rotate-12" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <span className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                <Info className="w-3.5 h-3.5" /> Resolution Center
              </span>
              <h2 className="text-lg font-bold tracking-tight">
                Need to appeal this?
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Please contact the platform administrator to review your account
                status or to resolve pending disputes.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:admin@yourdomain.com?subject=Account Appeal - Blocked User"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase hover:shadow-xl transition-all active:scale-95"
              >
                <Mail className="w-4 h-4" />
                Email Administrator
              </a>

              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest pt-2">
                Typical response time: 24-48 hours
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center justify-center gap-4">
          <span className="w-8 h-px bg-border" />
          Ref: ADM-LOCK-01
          <span className="w-8 h-px bg-border" />
        </div>
      </div>
    </div>
  );
}
