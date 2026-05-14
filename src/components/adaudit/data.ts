export type Severity = "High" | "Medium" | "Low";
export type Category =
  | "Wasted Spend"
  | "Structure"
  | "Conversion Tracking"
  | "Bid Strategy"
  | "Negative Keywords"
  | "Audience Targeting";

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  savings: number;
  confidence: number;
  category: Category;
  description: string;
  evidence: string;
  action: string;
}

export const FINDINGS: Finding[] = [
  {
    id: "f1",
    title: "Broad match keywords burning budget on irrelevant queries",
    severity: "High",
    savings: 18420,
    confidence: 94,
    category: "Wasted Spend",
    description:
      "32 broad match keywords are triggering on search terms unrelated to your core offering, accounting for 24% of total spend with a 0.4% conversion rate.",
    evidence:
      "Top offenders: 'free crm' (1,240 clicks, 0 conv), 'crm jobs' (890 clicks, 0 conv), 'salesforce alternative' (760 clicks, 2 conv).",
    action:
      "Convert top 10 broad match keywords to phrase match and add 47 negative keywords identified from search term report.",
  },
  {
    id: "f2",
    title: "Conversion tracking missing on 3 key landing pages",
    severity: "High",
    savings: 12100,
    confidence: 98,
    category: "Conversion Tracking",
    description:
      "Three high-traffic landing pages lack conversion tags, meaning Smart Bidding is optimizing toward incomplete signal.",
    evidence:
      "Pages /pricing, /demo-request, and /trial-signup receive 38% of paid traffic but report 0 conversions in GAds.",
    action:
      "Install gtag conversion snippet on all three pages and import enhanced conversions from CRM.",
  },
  {
    id: "f3",
    title: "Single campaign mixing brand and non-brand keywords",
    severity: "High",
    savings: 9800,
    confidence: 91,
    category: "Structure",
    description:
      "Brand terms are competing with non-brand for budget in the same campaign, inflating reported ROAS and starving generic terms.",
    evidence:
      "Campaign 'Search-All' contains 14 brand keywords driving 78% of conversions at $4 CPA alongside non-brand at $87 CPA.",
    action:
      "Split into 'Brand-Search' and 'NonBrand-Search' campaigns with separate budgets and bid strategies.",
  },
  {
    id: "f4",
    title: "Target CPA set 60% below actual conversion value",
    severity: "Medium",
    savings: 7200,
    confidence: 82,
    category: "Bid Strategy",
    description:
      "tCPA of $45 is throttling impression share to 18% on top-performing keywords with $112 actual CPA tolerance.",
    evidence:
      "Lost IS (rank): 64% on 'enterprise crm software'. Auction insights show competitor outranking share at 71%.",
    action:
      "Raise tCPA to $95 and enable 'Maximize Conversions' on highest-intent ad group for 2-week test.",
  },
  {
    id: "f5",
    title: "No negative keyword list applied to 4 of 7 campaigns",
    severity: "Medium",
    savings: 5400,
    confidence: 88,
    category: "Negative Keywords",
    description:
      "Shared negative list 'Universal-Negs' contains 312 vetted terms but is only attached to 3 campaigns.",
    evidence:
      "Campaigns Search-EU, Search-APAC, DSA-Catchall, and Perf-Max-1 are missing the shared list.",
    action:
      "Attach 'Universal-Negs' shared list to all 7 search and PMax campaigns.",
  },
  {
    id: "f6",
    title: "Display Network enabled on Search campaign",
    severity: "Medium",
    savings: 4862,
    confidence: 95,
    category: "Wasted Spend",
    description:
      "'Search Partners' and 'Display Network' toggles are enabled on the main Search campaign, mixing inventory types.",
    evidence:
      "Display placements account for 19% of impressions at 0.08% CTR vs 4.2% on Search.",
    action: "Disable Display Network on all Search campaigns.",
  },
  {
    id: "f7",
    title: "Customer Match audiences stale (last upload 8 months ago)",
    severity: "Low",
    savings: 3100,
    confidence: 76,
    category: "Audience Targeting",
    description:
      "Customer list size has decayed 41% due to email match expiration, weakening Smart Bidding signal.",
    evidence:
      "List 'Existing-Customers' shows 14,200 active members vs 24,100 at upload.",
    action: "Schedule monthly automated upload from CRM via Customer Match API.",
  },
  {
    id: "f8",
    title: "Ad rotation set to 'Optimize' with only 1 ad per group",
    severity: "Low",
    savings: 1900,
    confidence: 70,
    category: "Structure",
    description:
      "67% of ad groups contain only one Responsive Search Ad, preventing meaningful A/B optimization.",
    evidence:
      "42 of 63 ad groups have a single RSA. Avg Ad Strength: 'Average'.",
    action:
      "Add a second RSA with distinct headlines/descriptions to each ad group; aim for Ad Strength 'Good' minimum.",
  },
  {
    id: "f9",
    title: "Geographic bid adjustments missing for top-performing regions",
    severity: "Low",
    savings: 800,
    confidence: 68,
    category: "Audience Targeting",
    description:
      "5 metros convert at 2.3x account average but receive default bids.",
    evidence:
      "NYC: 2.8x, SF: 2.4x, Boston: 2.2x, Seattle: 2.1x, Austin: 2.0x conversion rate vs account avg.",
    action: "Apply +25% location bid adjustment for these 5 metros.",
  },
];

export const TOTAL_SAVINGS = FINDINGS.reduce((s, f) => s + f.savings, 0);
export const HIGH_COUNT = FINDINGS.filter((f) => f.severity === "High").length;
export const AVG_CONFIDENCE = Math.round(
  FINDINGS.reduce((s, f) => s + f.confidence, 0) / FINDINGS.length,
);

export const SUMMARY =
  "Your account is leaking roughly $63K/month, mostly through unmanaged broad match keywords and broken conversion tracking that's misleading Smart Bidding. The core structural issue is one campaign mixing brand and non-brand traffic, which inflates reported ROAS and hides poor non-brand performance. Fixing the top 3 findings alone should recover ~$40K/month within 30 days.";

export const TOP_PRIORITIES = FINDINGS.slice(0, 3);

export const AGENTS = [
  "Analyzing wasted spend...",
  "Reviewing account structure...",
  "Checking conversion tracking...",
  "Auditing bid strategy...",
  "Reviewing negative keywords...",
  "Analyzing audience targeting...",
];
