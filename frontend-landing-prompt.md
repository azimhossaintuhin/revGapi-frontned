# RevGAPI — Frontend Landing Page Build Prompt (Next.js)

A reusable spec + AI-generator prompt for building the RevGAPI marketing landing
page and interactive API sandbox. Built for **Next.js (App Router)** with
**server-side-only** API calls.

---

## 1. Product summary

**RevGAPI** is an AI-powered **Review & Feedback Analysis API**. Businesses send any
customer review, comment, or feedback (in any language) and instantly get back
structured, actionable intelligence as clean JSON.

For a single piece of feedback, the API returns:

| Field | Description |
|-------|-------------|
| `feedback_language` | Detected language of the input |
| `translation` | English translation (if input isn't English) |
| `sentiment` | `positive` \| `negative` \| `neutral` |
| `summary` | Short summary of the feedback |
| `pros` | List of positive points |
| `cons` | List of negative points |
| `action_items` | Concrete things the business should do |
| `suggestions` | Improvement suggestions |
| `customer_repeats` | Boolean — will this customer likely return? |
| `confidence_score` | Model confidence (0–1) |

**Selling points**

- Multilingual: understands and auto-translates feedback in any language
- Structured output: always clean, typed JSON — easy to drop into dashboards
- Consistent & cost-efficient: identical reviews return cached results (no wasted quota)
- Simple auth: one API key in an `X-API-Key` header
- Fair usage: per-day request limits per API key
- Developer-friendly: REST endpoint, predictable schema, fast integration

**Endpoint:** `POST /api/v1/reviews/agent-review`
**Auth header:** `X-API-Key: <your-key>`

---

## 2. Architecture rule (most important)

The RevGAPI key must **never** reach the browser.

```
Browser ──> Next.js (server: Route Handler / Server Action) ──> RevGAPI
                         ^ API key lives here only
```

- All RevGAPI calls go through **Server Components**, **Route Handlers**, or **Server Actions**.
- API key lives in `.env.local` as a **server-only** variable (no `NEXT_PUBLIC_` prefix).
- The browser talks only to *your* Next.js server, which proxies to RevGAPI.
- The sandbox client calls your internal route (e.g. `/api/reviews`), never RevGAPI directly.

---

## 3. Recommended packages

| Package | Why | How |
|--------|-----|-----|
| `tailwindcss` | Styling | `npx create-next-app@latest --tailwind` |
| `shadcn/ui` | Accessible, enterprise components | `npx shadcn@latest init` → `npx shadcn@latest add button card tabs input` |
| `lucide-react` | Icons | `import { Send } from "lucide-react"` |
| `framer-motion` | Subtle animations (client only) | wrap with `"use client"` |
| `zod` | Server-side body validation | parse body before calling RevGAPI |
| `@tanstack/react-query` | Client state for calls to *your own* route | never call RevGAPI directly |
| `next-themes` | Dark/light mode | wrap root layout in `ThemeProvider` |
| `react-syntax-highlighter` / `shiki` | Pretty JSON in sandbox | render response |
| `server-only` | Prevents server code leaking to client | `import "server-only"` in RevGAPI client |

Install:

```bash
npm i zod @tanstack/react-query framer-motion next-themes lucide-react react-syntax-highlighter server-only
npx shadcn@latest init
```

---

## 4. Recommended folder structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # landing page (server component)
│   ├── sandbox/
│   │   └── page.tsx              # sandbox page
│   ├── api/
│   │   └── reviews/
│   │       └── route.ts          # Route Handler -> calls RevGAPI (server only)
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn components
│   ├── landing/                  # Hero, Features, Pricing, Footer, etc.
│   ├── sandbox/                  # RequestPanel, ResponseViewer, Presets
│   └── demo/                     # ReviewsDashboard mock
├── lib/
│   ├── revgapi/
│   │   ├── client.ts             # "server-only" RevGAPI fetch wrapper
│   │   └── types.ts              # AgentOutput type
│   ├── validations/
│   │   └── review.ts             # zod schemas
│   └── utils.ts                  # cn(), helpers
├── server/
│   └── actions/
│       └── analyze-review.ts     # Server Action (alternative to route.ts)
└── config/
    └── site.ts                   # nav links, metadata, constants
```

Environment (`.env.local`, never commit):

```
REVGAPI_BASE_URL=https://api.revgapi.com/api/v1
REVGAPI_API_KEY=your-secret-key
```

---

## 5. Reference implementation pattern

`src/lib/revgapi/client.ts`

```ts
import "server-only";

export async function analyzeReview(review: string) {
  const res = await fetch(`${process.env.REVGAPI_BASE_URL}/reviews/agent-review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.REVGAPI_API_KEY!, // stays on server
    },
    body: JSON.stringify({ review }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RevGAPI error: ${res.status}`);
  return res.json();
}
```

`src/app/api/reviews/route.ts`

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeReview } from "@/lib/revgapi/client";

const schema = z.object({ review: z.string().min(1).max(5000) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const data = await analyzeReview(parsed.data.review);
  return NextResponse.json(data);
}
```

---

## 6. Copy-paste AI generator prompt

> Paste everything in the block below into v0 / Lovable / Bolt / Cursor.

```
Build an enterprise-grade marketing landing page + interactive API sandbox for a
SaaS product called "RevGAPI" using Next.js (App Router) + TypeScript + Tailwind +
shadcn/ui + framer-motion + zod + next-themes.

PRODUCT: RevGAPI is an AI-powered Review & Feedback Analysis API. Send any customer
review (any language), get structured JSON back: feedback_language, translation,
sentiment (positive|negative|neutral), summary, pros[], cons[], action_items[],
suggestions[], customer_repeats (bool), confidence_score (0–1). Selling points:
multilingual + auto-translate, always-clean typed JSON, cached/consistent results
that save quota, simple X-API-Key auth, per-day limits, developer-friendly.

ARCHITECTURE RULES (critical):
- ALL RevGAPI calls MUST be server-side only. The API key must never be exposed to
  the browser. Use a Route Handler at app/api/reviews/route.ts (or a Server Action)
  that reads REVGAPI_API_KEY from process.env and proxies to RevGAPI.
- Put the RevGAPI fetch wrapper in lib/revgapi/client.ts and add `import "server-only"`
  at the top so it can never be bundled into client code.
- Validate request bodies on the server using zod before calling RevGAPI.
- Client components only talk to the internal Next.js route, never to RevGAPI directly.
- For this demo, mock the RevGAPI response inside the server route (realistic
  AgentOutput matching the input sentiment, ~800ms latency) so it runs without a backend.

FOLDER STRUCTURE: use app/ (pages + api), components/ (ui, landing, sandbox, demo),
lib/ (revgapi client+types, validations, utils), config/ (site constants).

DESIGN: enterprise-grade, business-centric, polished, minimal but attractive
(Stripe/Linear/Vercel quality). Responsive, accessible (WCAG AA), light+dark mode
via next-themes. Refined primary color, generous whitespace, subtle motion.

SECTIONS:
1. Sticky navbar (logo, Product/Sandbox/Docs/Pricing, "Get API Key" CTA, theme toggle)
2. Hero (what it is + value, animated JSON preview, CTAs)
3. What is RevGAPI (value cards)
4. Why use RevGAPI (benefit grid)
5. How it works (3 steps: send → analyze → JSON)
6. POSTMAN-LIKE SANDBOX (most important):
   - Request panel: POST locked, URL prefilled, editable headers (X-API-Key: demo),
     JSON body editor prefilled with a sample review, Send button with loading state.
   - Response panel: status pill, response time, Pretty/Raw tabs, syntax-highlighted
     JSON, copy button.
   - 3–4 clickable sample review presets (angry English, happy multilingual, neutral).
   - The Send button calls the internal /api/reviews route (server-side), NOT RevGAPI.
   - Show "Served from cache — no quota used" badge when same review is sent twice.
   - Show "Requests remaining today: N" counter that decrements only on new requests.
7. Example app demo: a "Customer Reviews Dashboard" showing sentiment badges,
   summaries, pros/cons, action items, and a sentiment-breakdown + repeat-customer widget.
8. Integration code section: tabs for cURL, Python (requests), JS (fetch) using
   X-API-Key header and the real endpoint.
9. Pricing (Starter/Growth/Enterprise by daily limits)
10. Trust band + final CTA + footer.

DELIVERABLE: production-quality, typed, reusable components. Write concrete marketing
copy yourself. Everything runs locally with the mocked server route. Include a .env.local
example with REVGAPI_BASE_URL and REVGAPI_API_KEY (server-only, no NEXT_PUBLIC_).
```

---

## 7. Sample sandbox presets (optional, for realism)

**Mixed / multilingual (German):**
```json
{ "review": "Ich fand das Produkt so-lala, aber der Service war gut." }
```

**Angry (English):**
```json
{ "review": "Terrible experience. The order arrived late and the item was broken." }
```

**Happy (English):**
```json
{ "review": "Absolutely loved it! Fast delivery and amazing quality. Will buy again." }
```

**Neutral (English):**
```json
{ "review": "The product is okay. Nothing special but it works as described." }
```
