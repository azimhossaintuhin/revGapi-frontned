export interface WorkflowPreset {
  id: string;
  name: string;
  lang: string;
  source: string;
  reviewText: string;
  nodes: {
    source: string;
    engine: string;
    targets: { name: string; active: boolean; type: string }[];
  };
  explanation: string;
}

export const WORKFLOW_PRESETS: WorkflowPreset[] = [
  {
    id: "appstore",
    name: "Spanish App Store Review",
    lang: "Spanish",
    source: "App Store API Gateway",
    reviewText: "Excelente sonido pero no incluye baterías para el control remoto.",
    nodes: {
      source: "App Store Trigger",
      engine: "RevGAPI Engine",
      targets: [
        { name: "Translation Engine", active: true, type: "process" },
        { name: "Slack Alert Webhook", active: true, type: "webhook" },
        { name: "Vector Database Cache", active: true, type: "db" },
        { name: "Zendesk priority support queue", active: false, type: "crm" }
      ]
    },
    explanation: "A new Spanish App Store review arrives. RevGAPI detects the language, auto-translates it, scores the sentiment, and simultaneously pings your Slack channel and stores the structured result in the cache to avoid redundant processing on repeat reviews."
  },
  {
    id: "zendesk",
    name: "French Helpdesk Ticket",
    lang: "French",
    source: "Zendesk Webhook",
    reviewText: "Terrible! L'appareil chauffe trop et se déconnecte sans cesse.",
    nodes: {
      source: "Zendesk Trigger",
      engine: "RevGAPI Engine",
      targets: [
        { name: "Translation Engine", active: true, type: "process" },
        { name: "Slack Alert Webhook", active: false, type: "webhook" },
        { name: "Vector Database Cache", active: false, type: "db" },
        { name: "Zendesk priority support queue", active: true, type: "crm" }
      ]
    },
    explanation: "A highly negative French helpdesk ticket arrives. RevGAPI translates the text, identifies the critical hardware issues (overheating, connectivity), scores a high confidence on the negative sentiment, and automatically routes the ticket to your Tier-2 escalation queue."
  },
  {
    id: "email",
    name: "English Support Email",
    lang: "English",
    source: "Mailgun Inbound trigger",
    reviewText: "Absolutely loved it! Fast delivery and amazing quality. Will buy again.",
    nodes: {
      source: "Mailgun Trigger",
      engine: "RevGAPI Engine",
      targets: [
        { name: "Translation Engine", active: false, type: "process" },
        { name: "Slack Alert Webhook", active: false, type: "webhook" },
        { name: "Vector Database Cache", active: true, type: "db" },
        { name: "Customer CRM Dashboard", active: true, type: "crm" }
      ]
    },
    explanation: "An English email review arrives. RevGAPI skips translation (already English), extracts positive pros ('Fast delivery', 'amazing quality'), flags the customer as a repeat buyer, and pushes the structured result directly to your CRM dashboard."
  }
];
