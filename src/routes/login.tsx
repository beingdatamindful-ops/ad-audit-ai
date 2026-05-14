import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchProfileApprovalStatus } from "@/lib/auth";
import { AuthShell, Field } from "@/components/adaudit/AuthShell";

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

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    const status = await fetchProfileApprovalStatus(data.user.id);

    setBusy(false);
    if (status === "approved") navigate({ to: "/app" });
    else if (status === "pending") {
      setError("Your account is pending approval. We'll email you once you're approved.");
    } else {
      setError("Your request was not approved. Email adauditai@gmail.com for help.");
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Login to your AdAudit AI account">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field label="Password" type="password" value={password} onChange={setPassword} required />
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
