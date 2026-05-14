import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadScreen } from "@/components/adaudit/UploadScreen";
import { LoadingScreen } from "@/components/adaudit/LoadingScreen";
import { ReportScreen } from "@/components/adaudit/ReportScreen";
import {
  MOCK_REPORT,
  normalizeReport,
  type ReportData,
} from "@/components/adaudit/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AdAudit AI — Audit your Google Ads in 90 seconds" },
      {
        name: "description",
        content:
          "AI-powered Google Ads audit that finds wasted spend, structural issues, and missed opportunities in under two minutes.",
      },
      { property: "og:title", content: "AdAudit AI" },
      {
        property: "og:description",
        content:
          "AI-powered Google Ads audit that finds wasted spend and missed opportunities.",
      },
    ],
  }),
  component: Index,
});

type Step = "upload" | "loading" | "report";

const AUDIT_ENDPOINT = "http://localhost:5678/webhook/adaudit";

function Index() {
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
      // Network unreachable (e.g. local n8n offline) — fall back to mock data.
    }
  }

  if (step === "loading") {
    return <LoadingScreen onDone={() => setStep("report")} />;
  }
  if (step === "report") {
    return (
      <ReportScreen
        accountName={accountName}
        data={reportData}
        onRestart={() => {
          setAccountName("");
          setReportData(MOCK_REPORT);
          setStep("upload");
        }}
      />
    );
  }
  return <UploadScreen onRun={runAudit} />;
}
