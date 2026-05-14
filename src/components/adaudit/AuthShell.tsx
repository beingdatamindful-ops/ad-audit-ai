import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/adaudit/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-6 py-5">
        <Link to="/">
          <Logo />
        </Link>
      </header>
      <main className="mx-auto flex max-w-md flex-col px-6 pt-12 pb-24">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
        <div className="mt-8 rounded-xl border border-border bg-surface p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
      />
    </label>
  );
}
