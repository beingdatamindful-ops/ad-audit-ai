import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

const SPENDS = ["Under $5K", "$5K–$25K", "$25K–$100K", "$100K+"];

function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [spend, setSpend] = useState(SPENDS[0]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: fullName,
          company_name: company,
          monthly_spend: spend,
        },
      },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <AuthShell title="Request received">
        <p className="text-sm text-muted-foreground">
          Thanks! We'll review your request and email you within 24 hours.
        </p>
        <div className="mt-6">
          <Link to="/login" className="text-sm text-brand hover:text-brand-2">
            Back to login →
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Request Access"
      subtitle="Tell us a bit about you. Approval usually takes under 24 hours."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Full Name" value={fullName} onChange={setFullName} required />
        <Field
          label="Work Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <Field label="Company Name" value={company} onChange={setCompany} required />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Monthly Google Ads Spend
          </span>
          <select
            value={spend}
            onChange={(e) => setSpend(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {SPENDS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
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
          {busy ? "Submitting…" : "Request Access"}
        </button>
      </form>
      <div className="mt-4 text-xs text-muted-foreground">
        <Link to="/login" className="hover:text-foreground">
          Already have access? Login →
        </Link>
      </div>
    </AuthShell>
  );
}
