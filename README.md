# Signit Intelligence

Post-signature contract intelligence platform for holding companies and enterprise legal teams. Signit surfaces what matters across a contract portfolio — deadlines, risks, contradictions, and negotiation angles — through the lens of the person reviewing it.

**Current stage:** Interactive prototype. Full UI and UX implemented. No backend, no live AI — all data is hardcoded fixtures simulating real extraction outputs.

---

## Live Demo

> https://signit-intelligence.vercel.app

To run locally:

```bash
npm install
npm run dev
```

---

## The Three Personas

The platform adapts everything — briefings, contract readings, portfolio narratives, action priorities — to the active user role. Switch persona at any time using the toggle in the top bar.

| Persona | Focus |
|---|---|
| **Legal Counsel** | Clause risk, liability gaps, confidentiality conflicts, governing law |
| **Procurement Manager** | Renewal deadlines, notice windows, vendor performance, cost control |
| **CFO / COO** | Financial exposure, unfunded obligations, portfolio-level value at risk |

Persona state persists across all screens and navigation.

---

## User Flows

### Flow 1 — Daily Intelligence Briefing
**Start:** Landing screen (`/`)

User selects their persona and receives a prioritised briefing: 2–3 numbered items with delta badges (e.g. "47 days to CloudCRM deadline"). Each item is clickable and navigates directly to the relevant contract. Below the briefing, action bubbles surface the most urgent next steps. Procurement users also see a timeline strip of upcoming critical dates.

---

### Flow 2 — Command Bar Navigation
**Start:** Landing screen — command bar at the top

User types a query (e.g. "show me expiring contracts", "liability cap", "CloudCRM") and gets filtered results with contract labels and risk badges. Selecting a result navigates directly to that contract. Designed to replace menu navigation for power users.

---

### Flow 3 — Scan the Contract Library
**Start:** Contract list (`/contracts`)

User scans a compact list of all contracts. Each row shows counterparty, type, risk level, annual value, days to next critical date, and a signal strip of coloured dots. Hovering a dot shows a tooltip explaining that signal. Clicking a row opens a quick-summary panel from the right — a lightweight preview with the AI summary for the active persona — without leaving the list.

---

### Flow 4 — Deep-Dive a Contract
**Start:** Contract detail (`/contracts/:id`)

User opens a contract and switches between the three persona lenses using the full-width toggle directly below the contract metadata. The left panel shows the AI-generated clause story: extracted fields with confidence bars, risk flags by severity, and negotiation angles. The right panel shows the source reference text. Clicking "view source" on any story item scrolls and highlights the corresponding clause in the right panel. Fields with confidence below 70% disable critical actions.

---

### Flow 5 — Compare Two Contracts
**Start:** Contract list — compare mode (`/contracts?mode=compare`)

User switches to compare mode and selects two contracts. The view renders them side by side, clause by clause, with an AI synthesis paragraph at the top summarising the most significant differences — liability gaps, notice period disparities, governing law conflicts.

---

### Flow 6 — Analyze Portfolio Intelligence
**Start:** Portfolio screen (`/portfolio`)

User reads a persona-tailored AI narrative paragraph at the top — inline phrases are underlined and clickable, navigating to the referenced contract. Below that: four metric cards (total exposure, contracts expiring, contradictions, highest risk score), the eight cross-contract contradictions panel, and a risk matrix mapping vendors against risk types.

---

### Flow 7 — Export a Board Brief
**Start:** Portfolio screen — export modal (`/portfolio?export=board`)

User triggers the board brief export from the portfolio screen. A modal opens with a structured summary formatted for board-level reporting: key metrics, critical actions, and contradiction highlights. Designed to be copy-paste ready for a board pack or investor update.

---

### Flow 8 — Upload a Contract
**Start:** Upload screen (`/upload`)

User drops a PDF (or clicks "Try a demo contract"). The system runs a five-step animated pipeline — reading, identifying contract type, extracting fields, scoring risk signals, building the contract story. The extraction preview shows key fields grouped by confidence (clean / review needed / low confidence), a contradiction banner at the top if the new contract conflicts with an existing one, and a risk signals panel. User can correct any field inline before confirming. Three exit options: Add to portfolio, Correct fields first, or Discard.

---

## Key Features to Notice

- **Signal strip** — Every contract card and list row has coloured dots (red / amber / green). Hover each dot for a tooltip explaining the signal.
- **Persona lens toggle** — On the contract detail screen, the full-width bar switches the entire reading of the contract. Legal, Procurement, and CFO see completely different summaries, risk flags, and negotiation angles for the same document.
- **Clickable portfolio narrative** — On the portfolio screen, underlined phrases within the AI paragraph are navigation links. Click them to jump to the referenced contract.
- **Confidence bars** — Each extracted field shows a confidence score. Amber below 90%, red below 70%. Fields below 70% disable critical actions.
- **Cross-contract contradictions** — The portfolio screen surfaces eight AI-detected conflicts across contracts. These are not per-contract flags — they require reading across the full portfolio.
- **Arabic / RTL support** — A language toggle in the top chrome bar switches the full UI to Arabic with correct RTL layout. All contract content, field labels, AI summaries, risk flags, and negotiation angles have Arabic translations.

---

## The 8 Cross-Contract Contradictions

These appear in the Portfolio screen and represent the core analytical value of the platform:

1. **Data residency conflict** — NexusCloud stores data in US-East-1; CloudCRM specifies UAE/Dubai. Both govern Al-Madar operational data — direct PDPL violation.
2. **Absent liability cap** — Al-Mizan Legal Retainer is the only contract in the portfolio with no defined liability ceiling.
3. **Non-compete asymmetry** — VP Finance has a 6-month non-compete; Senior Director Operations has 12 months, despite lower seniority and less sensitive data access.
4. **Confidentiality cascade gap** — Al-Noor NDA sets a 5-year standard; Legal Retainer has 3 years; Marketing Agency has 2 years. All three cover the same GCC expansion strategy data.
5. **Notice period disparity** — Office Lease requires 120 days; CloudCRM 90 days; NexusCloud 60 days; Marketing Agency 30 days. No consistent standard across the portfolio.
6. **Al-Mizan success fee tail** — The Legal Retainer's 18-month success fee tail may already have been triggered by the Gulf Express JV (potential SAR 147,060 liability).
7. **IP ownership conflict** — Marketing Agency agreement gives the agency 50/50 joint IP ownership; the Senior Director's employment contract vests all IP exclusively in the Company.
8. **Phantom equity unfunded** — VP Finance holds SAR 18.75M notional phantom equity with no reserve fund established.

---

## What Is Real vs. Simulated

| Feature | Status |
|---|---|
| UI, navigation, and all screen layouts | Real |
| Persona lens switching | Real |
| Arabic / RTL rendering | Real |
| Signal strip dots and tooltips | Real |
| Portfolio narrative (clickable phrases) | Simulated — hardcoded per persona |
| Contract AI summaries (persona readings) | Simulated — hardcoded per contract |
| Extracted fields and confidence scores | Simulated — hardcoded fixtures |
| Risk flags and contradictions | Simulated — hardcoded fixtures |
| Compare modal AI synthesis | Simulated — hardcoded text |
| Upload processing animation | Simulated — sequential timeouts |
| Actual PDF parsing | Not implemented |
| Live LLM calls | Not implemented |
| Backend / data persistence | Not implemented |

---

## What's Next — Making the AI Real

| Feature | What's needed |
|---|---|
| Field extraction + confidence scores | Claude vision API or AWS Textract → Claude extraction prompt returning JSON |
| Persona lens readings | Claude API call per contract + persona on open; cache per session |
| Portfolio narrative | Claude API call with all contract summaries + active persona; streamed |
| Contradiction detection | Claude comparison prompt across all extracted contract fields; run on portfolio load |
| Compare synthesis | Claude prompt on modal open with both contracts' clauses |
| Upload processing | Replace timeouts with real pipeline: PDF → text → extraction → risk scoring → contradiction check |
| Backend | Node/Express or Next.js API routes to hold the API key and orchestrate calls |
| Storage | Supabase or Firebase to persist contracts per user |
| Auth | Clerk or Supabase Auth |

The frontend is complete. The AI work is prompt engineering and one backend file per feature.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + Vite + TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Components | shadcn/ui |
| Routing | Wouter |
| Data | Hardcoded fixtures (`src/data/`) |
| Deploy target | Vercel |

---

## Contract Fixture Data

The prototype includes 25 contracts (`c1`–`c25`) covering: SaaS subscriptions, vendor agreements, NDAs, employment contracts, a joint venture, a cloud infrastructure agreement, a legal retainer, a commercial lease, a marketing services agreement, and domain-specific contracts (maintenance, insurance, logistics, construction, training, catering, security, consulting, HRMS, warehousing, AI/NDA, and a legal retainer).

All contracts have full English and Arabic content across all fields.
