export interface ComparisonRow {
  feature: string;
  manual: { text: string; pain: boolean };
  revgapi: { text: string; gain: boolean };
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Setup time",
    manual: { text: "Days to weeks", pain: true },
    revgapi: { text: "Under 5 minutes", gain: true },
  },
  {
    feature: "Translation support",
    manual: { text: "Custom integration needed", pain: true },
    revgapi: { text: "Built-in, 50+ languages", gain: true },
  },
  {
    feature: "Structured output",
    manual: { text: "Manual parsing & regex", pain: true },
    revgapi: { text: "10+ JSON fields, every call", gain: true },
  },
  {
    feature: "Suggested reply",
    manual: { text: "Not included", pain: true },
    revgapi: { text: "Ready-to-send, every response", gain: true },
  },
  {
    feature: "Sentiment analysis",
    manual: { text: "Separate ML model required", pain: true },
    revgapi: { text: "Automatic, positive / negative / neutral", gain: true },
  },
  {
    feature: "Pros & cons extraction",
    manual: { text: "Prompt engineering + post-processing", pain: true },
    revgapi: { text: "Extracted and labeled out of the box", gain: true },
  },
  {
    feature: "Maintenance",
    manual: { text: "Ongoing — model updates, infra, bugs", pain: true },
    revgapi: { text: "Zero — we handle everything", gain: true },
  },
  {
    feature: "Cost",
    manual: { text: "Engineering hours + cloud infra", pain: true },
    revgapi: { text: "Pay per API call, free tier included", gain: true },
  },
];
