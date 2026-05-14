import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/adaudit/AuthShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/pending")({
  component: PendingPage,
});

function PendingPage() {
  const navigate = useNavigate();
  const { session, status, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    if (status === "approved") navigate({ to: "/app" });
  }, [loading, session, status, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading || !session || status === "approved") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <AuthShell title="Access pending">
      <p className="text-sm text-muted-foreground">
        Your access is pending approval. We'll email you when you're approved.
      </p>
      <button
        onClick={signOut}
        className="mt-6 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-surface"
      >
        Sign out
      </button>
    </AuthShell>
  );
}
