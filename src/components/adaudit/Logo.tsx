import { Zap } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 shadow-lg shadow-brand/20">
        <Zap className="h-4 w-4 text-background" fill="currentColor" />
      </div>
      <span className="text-lg font-semibold tracking-tight">
        AdAudit <span className="text-brand">AI</span>
      </span>
    </div>
  );
}
