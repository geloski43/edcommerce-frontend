import { FolderOpen, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  actionTo?: string;
}

export default function EmptyState({
  title = "No items found",
  message = "It looks like there's nothing here yet.",
  icon: Icon = FolderOpen,
  actionLabel,
  actionTo,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground/40" />
      </div>

      <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">
        {title}
      </h3>

      <p className="text-muted-foreground max-w-xs mx-auto mb-8 text-sm font-medium">
        {message}
      </p>
      {/*to be replaced for admin users view only*/}
      {actionLabel && actionTo && (
        <a
          href="https://authentic-virtue-ebbd26e6cd.strapiapp.com/admin"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </a>
      )}
    </div>
  );
}
