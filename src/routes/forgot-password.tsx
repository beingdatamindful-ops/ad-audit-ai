import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) setError(err.message);
    else setSent(true);
  }

  return (
    <AuthShell title="Reset password">
      {sent ? (
        <p className="text-sm text-muted-foreground">
          Check your email for a reset link.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
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
            {busy ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
      <div className="mt-4 text-xs text-muted-foreground">
        <Link to="/login" className="hover:text-foreground">
          Back to login
        </Link>
      </div>
    </AuthShell>
  );
}
