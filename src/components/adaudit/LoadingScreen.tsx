import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Logo } from "./Logo";
import { AGENTS } from "./data";

interface Props {
  onDone: () => void;
}

export function LoadingScreen({ onDone }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (active >= AGENTS.length) {
      const t = setTimeout(onDone, 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActive((a) => a + 1), 2000);
    return () => clearTimeout(t);
  }, [active, onDone]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto flex max-w-xl flex-col px-6 pt-16 pb-24">
        <h2 className="mb-1 text-center text-2xl font-semibold tracking-tight">
          Running your audit
        </h2>
        <p className="mb-10 text-center text-sm text-muted-foreground">
          Six specialist agents are inspecting your account in parallel.
        </p>

        <ul className="space-y-3">
          {AGENTS.map((label, i) => {
            const done = i < active;
            const running = i === active;
            const visible = i <= active;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-all duration-500 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0"
                } ${
                  running
                    ? "border-brand/40 bg-brand/5"
                    : done
                      ? "border-border bg-surface"
                      : "border-border bg-surface/40"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                  {done ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-severity-low/20 text-severity-low">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  ) : running ? (
                    <Loader2 className="h-5 w-5 animate-spin text-brand" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-border" />
                  )}
                </span>
                <span
                  className={`text-sm ${done ? "text-muted-foreground line-through decoration-border" : "text-foreground"}`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          This usually takes 20–30 seconds
        </p>
      </main>
    </div>
  );
}
