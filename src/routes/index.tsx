import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/adaudit/Logo";

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
  component: Landing,
});

const FEATURES: { icon: string; title: string; desc: string }[] = [
  { icon: "💸", title: "Wasted Spend", desc: "Pinpoint search terms, keywords and placements draining budget." },
  { icon: "🏗️", title: "Account Structure", desc: "Find campaign and ad-group sprawl that hurts Quality Score." },
  { icon: "📊", title: "Conversion Tracking", desc: "Detect missing, duplicate, or misconfigured conversions." },
  { icon: "🎯", title: "Bid Strategy", desc: "Spot mismatched strategies and underperforming auto-bidding." },
  { icon: "🚫", title: "Negative Keywords", desc: "Surface irrelevant queries that need to be excluded." },
  { icon: "👥", title: "Audience & Device", desc: "Highlight bid adjustment opportunities by device and audience." },
];

const STEPS = [
  { n: 1, title: "Upload your CSV", desc: "Export your Google Ads data and drop it in." },
  { n: 2, title: "6 AI agents analyse in parallel", desc: "Specialists inspect every angle of your account." },
  { n: 3, title: "Get a prioritised report", desc: "Findings, savings, and next actions in 30 seconds." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-background transition hover:bg-brand-2"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          AI-powered Google Ads audits
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Audit Your Google Ads Account in{" "}
          <span className="text-gradient-brand">90 Seconds</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          AI-powered analysis that finds wasted spend, structural issues, and missed
          opportunities — the audit agencies charge $3,000 for, done instantly.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signup"
            className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-brand/30 transition hover:bg-brand-2"
          >
            Request Access
          </Link>
          <a
            href="#how"
            className="rounded-md border border-border bg-surface/50 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-xl border border-border bg-surface p-6 transition hover:border-brand/40"
            >
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
                {s.n}
              </div>
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          What it finds
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 rounded-2xl border border-border bg-surface p-8 sm:grid-cols-3 sm:p-10">
          {[
            { v: "$63,000", l: "Average monthly savings identified" },
            { v: "24", l: "Audit checkpoints" },
            { v: "30 sec", l: "vs 4 hours manual" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-semibold text-gradient-brand sm:text-4xl">
                {s.v}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to see what your account is losing?
        </h2>
        <div className="mt-8">
          <Link
            to="/signup"
            className="inline-flex rounded-md bg-brand px-8 py-4 text-base font-semibold text-background shadow-lg shadow-brand/30 transition hover:bg-brand-2"
          >
            Request Access
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AdAudit AI
      </footer>
    </div>
  );
}
