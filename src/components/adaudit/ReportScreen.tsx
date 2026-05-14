import { useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Logo } from "./Logo";
import {
  type Severity,
  type Category,
  type Finding,
  type ReportData,
} from "./data";

interface Props {
  accountName: string;
  data: ReportData;
  onRestart: () => void;
}

const SEVERITIES: ("All" | Severity)[] = ["All", "High", "Medium", "Low"];
const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Wasted Spend",
  "Structure",
  "Conversion Tracking",
  "Bid Strategy",
  "Negative Keywords",
  "Audience Targeting",
];

const sevStyles: Record<Severity, string> = {
  High: "bg-severity-high/15 text-severity-high border-severity-high/30",
  Medium: "bg-severity-med/15 text-severity-med border-severity-med/30",
  Low: "bg-severity-low/15 text-severity-low border-severity-low/30",
};

const fmt = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function ReportScreen({ accountName, data, onRestart }: Props) {
  const {
    findings,
    totalSavings,
    highCount,
    avgConfidence,
    summary,
    topPriorities,
  } = data;
  const [sev, setSev] = useState<(typeof SEVERITIES)[number]>("All");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      findings.filter(
        (f) =>
          (sev === "All" || f.severity === sev) &&
          (cat === "All" || f.category === cat),
      ),
    [findings, sev, cat],
  );

  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <button
            onClick={onRestart}
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
          >
            <RotateCcw className="h-3.5 w-3.5" /> New audit
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {/* Top banner */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Audit Report
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {accountName}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-severity-low/30 bg-severity-low/10 px-3 py-1 text-severity-low">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Audit Complete
            </span>
            <span className="text-muted-foreground">{date}</span>
          </div>
        </div>

        {/* Hero card */}
        <section className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/90 via-brand to-brand-2 p-8 text-background shadow-2xl shadow-brand/10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-background/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
              <Sparkles className="h-4 w-4" />
              Estimated Monthly Savings Identified
            </div>
            <div className="mt-3 text-6xl font-bold tracking-tight sm:text-7xl">
              {fmt(totalSavings)}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { label: "Total Findings", value: findings.length },
                { label: "High Severity", value: highCount },
                { label: "Avg Confidence", value: `${avgConfidence}%` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-background/15 bg-background/10 p-4 backdrop-blur"
                >
                  <div className="text-2xl font-semibold">{s.value}</div>
                  <div className="mt-0.5 text-xs opacity-80">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Executive summary */}
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Executive Summary
          </h2>
          <p className="text-base leading-relaxed text-foreground/90">
            {summary}
          </p>
        </section>

        {/* Top 3 priorities */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Top 3 Priorities
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {TOP_PRIORITIES.map((p, i) => (
              <div
                key={p.id}
                className="group relative rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-sm font-bold text-background">
                  {i + 1}
                </div>
                <h3 className="mb-3 font-semibold leading-snug">{p.title}</h3>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">Action:</span>{" "}
                  {p.action}
                </p>
                <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Impact
                  </span>
                  <span className="text-lg font-semibold text-brand">
                    {fmt(p.savings)}/mo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Findings table */}
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              All Findings ({filtered.length})
            </h2>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <FilterGroup
              label="Severity"
              options={SEVERITIES}
              value={sev}
              onChange={(v) => setSev(v as typeof sev)}
            />
            <FilterGroup
              label="Category"
              options={CATEGORIES}
              value={cat}
              onChange={(v) => setCat(v as typeof cat)}
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="hidden grid-cols-12 gap-3 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid">
              <div className="col-span-1">Severity</div>
              <div className="col-span-5">Finding</div>
              <div className="col-span-2 text-right">Savings</div>
              <div className="col-span-2">Confidence</div>
              <div className="col-span-2">Category</div>
            </div>
            {filtered.map((f) => (
              <FindingRow
                key={f.id}
                finding={f}
                open={openId === f.id}
                onToggle={() => setOpenId(openId === f.id ? null : f.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No findings match these filters.
              </div>
            )}
          </div>
        </section>

        {/* Bottom actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand to-brand-2 px-5 py-3 text-sm font-semibold text-background shadow-lg shadow-brand/20 transition hover:brightness-110">
            <Download className="h-4 w-4" />
            Download PDF Report
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition hover:border-brand/40 hover:bg-surface-2"
          >
            <RotateCcw className="h-4 w-4" />
            Run Another Audit
          </button>
        </div>
      </main>
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-brand bg-brand text-background"
                  : "border-border bg-surface text-muted-foreground hover:border-brand/40 hover:text-foreground"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FindingRow({
  finding,
  open,
  onToggle,
}: {
  finding: Finding;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="grid w-full grid-cols-1 gap-3 px-5 py-4 text-left transition hover:bg-surface-2 sm:grid-cols-12 sm:items-center"
      >
        <div className="col-span-1">
          <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${sevStyles[finding.severity]}`}
          >
            {finding.severity}
          </span>
        </div>
        <div className="col-span-5">
          <div className="font-medium leading-snug">{finding.title}</div>
        </div>
        <div className="col-span-2 text-right text-base font-semibold text-brand sm:text-base">
          {fmt(finding.savings)}
        </div>
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2"
                style={{ width: `${finding.confidence}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {finding.confidence}%
            </span>
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{finding.category}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className="space-y-4 border-t border-border bg-background/40 px-5 py-5 text-sm">
          <Detail label="Description" value={finding.description} />
          <Detail label="Evidence" value={finding.evidence} />
          <Detail label="Recommended Action" value={finding.action} accent />
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <p className={accent ? "text-brand" : "text-foreground/90"}>{value}</p>
    </div>
  );
}
