import { useRef, useState } from "react";
import { Upload, FileText, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

interface Props {
  onRun: (accountName: string, csvData: string) => void;
}

export function UploadScreen({ onRun }: Props) {
  const [accountName, setAccountName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (f) setFile(f);
  };

  const fileName = file?.name ?? null;
  const canRun = accountName.trim().length > 0 && !!file;

  const handleRun = async (name: string, f: File | null) => {
    const csvData = f ? await f.text() : "";
    onRun(name, csvData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-12 pb-24 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          AI-powered Google Ads audit
        </span>
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Audit your Google Ads account in 90 seconds
        </h1>
        <p className="mt-4 max-w-lg text-balance text-base text-muted-foreground sm:text-lg">
          AI-powered analysis that finds wasted spend, structural issues, and missed opportunities.
        </p>

        <div className="mt-10 w-full text-left">
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Account name
          </label>
          <input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Acme Inc — Search & Performance Max"
            className="mb-5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
              dragging
                ? "border-brand bg-brand/5"
                : "border-border bg-surface/40 hover:border-brand/60 hover:bg-surface"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
            />
            {fileName ? (
              <>
                <FileText className="mb-3 h-8 w-8 text-brand" />
                <p className="text-sm font-medium">{fileName}</p>
                <p className="mt-1 text-xs text-muted-foreground">Click to replace</p>
              </>
            ) : (
              <>
                <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Drop your Google Ads CSV here</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  or click to browse — exports from Google Ads Editor work best
                </p>
              </>
            )}
          </label>

          <button
            disabled={!canRun}
            onClick={() => onRun(accountName.trim())}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand to-brand-2 px-5 py-3.5 text-sm font-semibold text-background shadow-lg shadow-brand/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:from-surface-2 disabled:to-surface-2 disabled:text-muted-foreground disabled:shadow-none"
          >
            Run Audit
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => onRun("Sample Account — TechCo SaaS")}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground transition hover:text-brand"
          >
            Or try a sample account <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
