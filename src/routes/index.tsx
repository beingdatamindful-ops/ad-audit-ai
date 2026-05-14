import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadScreen } from "@/components/adaudit/UploadScreen";
import { LoadingScreen } from "@/components/adaudit/LoadingScreen";
import { ReportScreen } from "@/components/adaudit/ReportScreen";

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

function Index() {
  const [step, setStep] = useState<Step>("upload");
  const [accountName, setAccountName] = useState("");

  if (step === "loading") {
    return <LoadingScreen onDone={() => setStep("report")} />;
  }
  if (step === "report") {
    return (
      <ReportScreen
        accountName={accountName}
        onRestart={() => {
          setAccountName("");
          setStep("upload");
        }}
      />
    );
  }
  return (
    <UploadScreen
      onRun={(name) => {
        setAccountName(name);
        setStep("loading");
      }}
    />
  );
}
