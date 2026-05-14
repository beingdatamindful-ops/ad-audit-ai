import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(err.message);
    else {
      setDone(true);
      setTimeout(() => navigate({ to: "/login" }), 1500);
    }
  }

  return (
    <AuthShell title="Set a new password">
      {done ? (
        <p className="text-sm text-muted-foreground">
          Password updated. Redirecting to login…
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label="New Password"
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
            {busy ? "Updating…" : "Update Password"}
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
