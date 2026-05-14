import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/adaudit/Logo";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authErr || !data.user) {
      setBusy(false);
      setError("Incorrect email or password");
      return;
    }
    const { data: prof } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", data.user.id)
      .maybeSingle();

    setBusy(false);
    const status = prof?.status ?? "pending";
    if (status === "approved") navigate({ to: "/app" });
    else if (status === "pending") {
      setError(
        "Your account is pending approval. We'll email you once you're approved.",
      );
    } else {
      setError(
        "Your request was not approved. Email adauditai@gmail.com for help.",
      );
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Login to your AdAudit AI account">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        {error && (
          <p className="rounded-md border border-severity-high/40 bg-severity-high/10 px-3 py-2 text-sm text-severity-high">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-background transition hover:bg-brand-2 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Login"}
        </button>
      </form>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <Link to="/forgot-password" className="hover:text-foreground">
          Forgot password?
        </Link>
        <Link to="/signup" className="hover:text-foreground">
          Don't have access? Request it →
        </Link>
      </div>
    </AuthShell>
  );
}

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
