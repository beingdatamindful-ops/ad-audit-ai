import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { UploadScreen } from "@/components/adaudit/UploadScreen";
import { LoadingScreen } from "@/components/adaudit/LoadingScreen";
import { ReportScreen } from "@/components/adaudit/ReportScreen";
import { Logo } from "@/components/adaudit/Logo";
import {
  MOCK_REPORT,
  normalizeReport,
  type ReportData,
} from "@/components/adaudit/data";

export const Route = createFileRoute("/app")({
  component: AppPage,
});

type Step = "upload" | "loading" | "report";
const AUDIT_ENDPOINT = "http://localhost:5678/webhook/adaudit";

function AppPage() {
  const navigate = useNavigate();
  const { session, status, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: "/login" });
    else if (status === "pending") navigate({ to: "/pending" });
    else if (status === "rejected") navigate({ to: "/login" });
  }, [loading, session, status, navigate]);

  const [step, setStep] = useState<Step>("upload");
  const [accountName, setAccountName] = useState("");
  const [reportData, setReportData] = useState<ReportData>(MOCK_REPORT);

  async function runAudit(name: string, csvData: string) {
    setAccountName(name);
    setReportData(MOCK_REPORT);
    setStep("loading");
    try {
      const res = await fetch(AUDIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_name: name, csv_data: csvData }),
      });
      if (res.ok) {
        const json = await res.json();
        setReportData(normalizeReport(json));
      }
    } catch {
      /* fallback to mock */
    }
  }

  if (loading || !session || status !== "approved") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const inner =
    step === "loading" ? (
      <LoadingScreen onDone={() => setStep("report")} />
    ) : step === "report" ? (
      <ReportScreen
        accountName={accountName}
        data={reportData}
        onRestart={() => {
          setAccountName("");
          setReportData(MOCK_REPORT);
          setStep("upload");
        }}
      />
    ) : (
      <UploadScreen onRun={runAudit} />
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/80 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <button
              onClick={signOut}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-surface"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      {inner}
    </div>
  );
}
