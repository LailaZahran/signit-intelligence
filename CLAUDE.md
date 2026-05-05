# Signit Intelligence — Claude Code Context

## What this is
Post-signature contract intelligence platform. React + Vite + TypeScript + Tailwind + shadcn/ui.
3 personas: Legal Counsel · Procurement Manager · CFO/COO.
All data is hardcoded fixtures. No backend. No API calls.
5 screens: Landing · Contract List · Contract Detail · Portfolio · Upload.

---

## Your job in this session
You are a senior front-end engineer doing a QA and UX polish pass.
Do NOT refactor, restructure, or change logic unless explicitly asked.
Fix only what is broken or visually wrong. Ask before making large changes.

---

## The non-negotiables — never remove or simplify these

1. **The Briefing** — landing screen leads with command bar, then briefing below
2. **Signal strip** — colored dots on every contract card/row, hover shows tooltip
3. **Persona lens toggle** — full-width bar on contract detail, 3 readings of same contract
4. **Portfolio narrative** — AI paragraph with clickable inline phrases that navigate
5. **Compare clauses** — /contracts?mode=compare — side-by-side with AI synthesis

---

## QA checklist — run through these every session

### RTL / Arabic rendering
- [ ] Every English value, date, number, company name has `dir="ltr"` applied inline
- [ ] "days 90" must read "90 days" — this is the most common RTL reversal bug
- [ ] Language toggle visible in chrome bar on all screens
- [ ] Full layout mirrors correctly when Arabic active

### Landing screen
- [ ] Command bar appears FIRST (above briefing, not below)
- [ ] Command bar is large and prominent — min 52px height
- [ ] Briefing shows 2–3 numbered items with delta badges
- [ ] All 3 persona views work — switching re-renders briefing, bubbles, footer
- [ ] Procurement view has timeline strip for upcoming dates (not a text list)

### Contract list
- [ ] Rows are compact — around 46px height, not tall cards
- [ ] All 10 contracts visible without excessive scrolling
- [ ] Signal dots visible with hover tooltips on every row
- [ ] Clicking a row opens quick summary panel from the right
- [ ] Persona lens toggle works inside quick summary panel

### Contract detail
- [ ] Persona lens toggle is full-width bar directly below contract metadata
- [ ] Two-panel layout: left = story, right = source reference
- [ ] "view source →" clicks scroll and highlight the right panel clause
- [ ] Confidence bars show amber below 90%, red below 70%
- [ ] Critical actions disabled when confidence < 70%
- [ ] "Extraction wrong?" button visible next to highlighted clauses in source panel
- [ ] Right panel has slightly different background (secondary surface)

### Portfolio screen
- [ ] Narrative paragraph has clickable inline phrases (underline on hover, navigate on click)
- [ ] Metric cards show large numbers (28px) colored by severity
- [ ] Contradictions show title + 1 sentence + contract tags — NOT full paragraphs
- [ ] Risk matrix cells are large enough to read, legend visible
- [ ] All 3 lens views produce completely different content

### Upload flow
- [ ] Contradiction banner appears at TOP of extraction preview — not bottom
- [ ] Fields grouped visually: clean (checkmark) · review needed (amber) · low confidence (red)
- [ ] Three buttons: Add to portfolio · Correct fields first · Discard
- [ ] Processing steps animate sequentially

### General
- [ ] No console errors in browser dev tools
- [ ] No broken navigation — all routes resolve
- [ ] Persona state persists across navigation (don't reset on route change)
- [ ] All contract IDs c1–c10 have fixture data and render without errors
- [ ] Export board brief modal opens from /portfolio?export=board and closes cleanly

---

## The 5 cross-contract contradictions — must appear in portfolio

1. Data residency: NexusCloud (US-East-1) vs CloudCRM (UAE/Dubai) — PDPL conflict
2. Absent liability cap: Al-Mizan vs all other vendor contracts
3. Non-compete asymmetry: VP Finance 6 months vs Senior Director 12 months
4. Confidentiality gap: NDA 5 years → Legal Retainer 3 years → Marketing Agency 2 years
5. Notice period disparity: Lease 120d · CloudCRM 90d · NexusCloud 60d · Marketing 30d

---

## Color reference

| Token | Hex | Used for |
|---|---|---|
| brand-indigo | #4F46E5 | Primary · Legal persona |
| brand-teal | #0D9488 | Procurement persona |
| brand-amber | #D97706 | CFO persona · warnings |
| risk-red | #B91C1C | Critical flags |
| risk-amber | #B45309 | Medium risk |
| risk-green | #15803D | Healthy signals |

---

## How to run

```bash
npm run dev      # development
npm run build    # production build → /dist
npm run preview  # preview build locally
```

Deploy target: Vercel. Framework: Vite. No env variables needed.
