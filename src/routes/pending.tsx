import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "./login";

export const Route = createFileRoute("/pending")({
  component: PendingPage,
});

function PendingPage() {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };
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
