export interface OneApiField {
  key: string;
  value: string;
  color: string;
  label: string;
  desc: string;
}

export const ONE_CALL_FIELDS: OneApiField[] = [
  {
    key: "feedback_language",
    value: '"German"',
    color: "text-violet-600",
    label: "🌍 Language Detected",
    desc: "Auto-detects the language of the review — no config needed.",
  },
  {
    key: "translation",
    value: '"I found the product to be so-so, but the service was good."',
    color: "text-sky-600",
    label: "🔤 Auto-Translated",
    desc: "Translates mixed-language reviews to English instantly.",
  },
  {
    key: "sentiment",
    value: '"neutral"',
    color: "text-amber-600",
    label: "💬 Sentiment Score",
    desc: "Positive, negative, or neutral — classified automatically.",
  },
  {
    key: "summary",
    value: '"Average product with good customer service."',
    color: "text-teal-600",
    label: "📝 Smart Summary",
    desc: "A concise one-liner that captures the full review meaning.",
  },
  {
    key: "pros",
    value: '["Good service", "Reasonable price"]',
    color: "text-emerald-600",
    label: "✅ Pros Extracted",
    desc: "Automatically surfaces what the customer liked.",
  },
  {
    key: "cons",
    value: '["Product was below expectations"]',
    color: "text-rose-500",
    label: "❌ Cons Extracted",
    desc: "Pinpoints pain points without manual reading.",
  },
  {
    key: "action_items",
    value: '["Improve product quality"]',
    color: "text-orange-500",
    label: "🎯 Action Items",
    desc: "Actionable steps your team can take immediately.",
  },
  {
    key: "confidence_score",
    value: "0.87",
    color: "text-pink-500",
    label: "📊 Confidence Score",
    desc: "How confident the engine is in its analysis — 0 to 1.",
  },
  {
    key: "customer_repeats",
    value: "false",
    color: "text-indigo-500",
    label: "🔁 Repeat Customer",
    desc: "Flags if the reviewer appears to be a returning customer.",
  },
  {
    key: "replay",
    value: '"Thank you for your feedback! We\'re working on improving our product range."',
    color: "text-teal-700",
    label: "🤖 Suggested Reply",
    desc: "A ready-to-send reply drafted by the engine. Just copy and paste.",
  },
];
