# Roadmap & Backlog — Dropshipping Detector

A build roadmap structured as a **Kanban backlog** for a GitHub Project. Every
item below is a ready-to-create issue: copy the title, body (Why / Acceptance
criteria), labels, and estimate into a card.

**Product in one line:** a genuinely free, useful browser extension that
estimates how likely a store is dropshipping — and, for users who *explicitly
opt in*, contributes anonymized aggregate market data that informs our own
future webstore product picks.

> **Data principle (non-negotiable):** opt-in, disclosed, anonymized,
> aggregate, revocable. No covert collection, no per-user browsing logs, no PII.
> This is what keeps us on Chrome Web Store / AMO and GDPR-compliant — and it is
> still a strong market-intelligence funnel.

---

## How to set up the GitHub Project

1. Repo → **Projects** → **New project** → **Board** template.
2. Create columns: **Backlog · To Do · In Progress · In Review · Done**.
3. Create the labels in the legend below.
4. Create one issue per card; drop M1 cards into **To Do**, the rest into
   **Backlog**.
5. Add a single-select **Milestone** field (M1–M4) and a **Estimate** number
   field; set per card from this doc.

### Label legend
`epic` · `feat` · `chore` · `docs` · `legal` · `data` · `bug`
`P0` (blocker) · `P1` (MVP) · `P2` (nice-to-have) · `P3` (later)
`needs-legal-review`

### Milestones
- **M1 — MVP** (client-side detector, shippable unpacked)
- **M2 — Public release + opt-in data foundation**
- **M3 — Market-intelligence backend** (the commercial payoff)
- **M4 — Scale & advanced detection**

---

## Columns (initial board state)

### TO DO — M1
- [#1 Heuristic detector engine](#1)
- [#2 Content script + per-tab badge](#2)
- [#3 Popup UI: score gauge + signal breakdown](#3)
- [#4 Icons + manifest polish](#4)
- [#5 Test matrix: 5 dropshipping vs 5 legit](#5)
- [#6 README: install, scoring, limitations](#6)

### BACKLOG — M2
- [#7 Onboarding consent screen (opt-in)](#7)
- [#8 Privacy policy + data disclosure](#8)
- [#9 Anonymized event schema + local buffer](#9)
- [#10 Settings page: toggle data sharing, view/delete](#10)
- [#11 Chrome Web Store + AMO submission](#11)
- [#12 Weight tuning from test matrix](#12)
- [#13 Firefox port](#13)

### BACKLOG — M3 (commercial payoff)
- [#14 Ingest API for opted-in aggregate events](#14)
- [#15 Market-intelligence dashboard (trending niches/products)](#15)
- [#16 Reverse-image match vs AliExpress/Temu](#16)
- [#17 Domain-age (WHOIS) + price-gap signals](#17)
- [#18 DPA / data-retention + deletion pipeline](#18)

### BACKLOG — M4
- [#19 Remote-config rule updates](#19)
- [#20 ML scoring model](#20)
- [#21 Crowd "report this store" loop](#21)
- [#22 Shared blocklist](#22)

---

## EPICS

### EPIC A — MVP detector (M1) · `epic` `P1`
Ship a working, client-side-only extension that scores dropshipping likelihood.
Children: #1–#6.

### EPIC B — Public release & consented data foundation (M2) · `epic` `P1` `data`
Get it on the stores with a clean, opt-in data pipeline that is dormant until
the user consents. Children: #7–#13.

### EPIC C — Market-intelligence backend (M3) · `epic` `P2` `data`
Turn opted-in aggregate signals into product/niche intelligence for our own
future stores — the business reason this exists. Children: #14–#18.

### EPIC D — Scale & advanced detection (M4) · `epic` `P3`
Children: #19–#22.

---

## CARDS

<a id="1"></a>
### #1 — Heuristic detector engine · `feat` `P0` `M1` · est 3
**Why:** Core of the product; everything else renders its output.
**Notes:** Reference implementation already exists at `extension/src/detector.js`.
7 weighted rules → confidence % → Low/Med/High.
**Acceptance criteria**
- [ ] `DropshipDetector.analyze(document)` returns `{confidence, verdict, hits, rules}`.
- [ ] Rules: Shopify, dropship-app footprint, shipping language, generic
      descriptions, urgency, free-mail support, inflated discount.
- [ ] Pure function, no network, no DOM mutation.
- [ ] Unit tests cover each rule firing and not firing.

<a id="2"></a>
### #2 — Content script + per-tab badge · `feat` `P0` `M1` · est 2
**Why:** Runs the engine on real pages and surfaces a glanceable result.
**Acceptance criteria**
- [ ] Runs at `document_idle`, calls the engine, messages result to background.
- [ ] Background keys result by `tabId`, sets toolbar badge (green/amber/red + score).
- [ ] Badge clears/updates on navigation.

<a id="3"></a>
### #3 — Popup UI: score gauge + signal breakdown · `feat` `P1` `M1` · est 3
**Why:** Explains the score; transparency is the trust anchor.
**Acceptance criteria**
- [ ] Shows confidence gauge + Low/Med/High verdict.
- [ ] Lists every fired signal with a plain-language "why".
- [ ] States clearly: "likelihood estimate, not an accusation."

<a id="4"></a>
### #4 — Icons + manifest polish · `chore` `P1` `M1` · est 1
**Acceptance criteria**
- [ ] 16/48/128 PNG icons.
- [ ] MV3 manifest loads unpacked with zero warnings.

<a id="5"></a>
### #5 — Test matrix: 5 dropshipping vs 5 legit · `chore` `P1` `M1` · est 2
**Why:** Sanity-check false-positive rate before tuning.
**Acceptance criteria**
- [ ] Documented scores for 5 known dropshipping + 5 mainstream stores.
- [ ] Dropshipping stores ≥ Medium; mainstream retailers = Low.

<a id="6"></a>
### #6 — README: install, scoring, limitations · `docs` `P1` `M1` · est 1
**Acceptance criteria**
- [ ] Load-unpacked steps, how scoring works, explicit limitations/false-positive note.

---

<a id="7"></a>
### #7 — Onboarding consent screen (opt-in) · `feat` `P0` `M2` `data` `legal` · est 3
**Why:** The legal + ethical gate for any data collection. Off by default.
**Acceptance criteria**
- [ ] First-run screen explains exactly what is collected, why, and that it's anonymized & aggregate.
- [ ] Default = OFF. Data pipeline stays dormant until explicit opt-in.
- [ ] Choice persisted; revocable any time from settings.
- [ ] Links to privacy policy (#8).

<a id="8"></a>
### #8 — Privacy policy + data disclosure · `docs` `P0` `M2` `legal` · est 2
**Acceptance criteria**
- [ ] Public privacy policy: data categories, purpose, retention, deletion, contact.
- [ ] Chrome Web Store data-disclosure form fields drafted.
- [ ] GDPR lawful basis (consent) documented; purpose limited to detection-improvement + aggregate market insight.

<a id="9"></a>
### #9 — Anonymized event schema + local buffer · `feat` `P1` `M2` `data` · est 3
**Why:** Defines what "aggregate market data" actually is — and proves there's no PII or browsing log.
**Acceptance criteria**
- [ ] Event = `{coarse_category, platform, price_band, supplier_signals, detector_score, country_coarse, ts_bucket}` — **no URL, no user id, no PII**.
- [ ] Buffered locally; only sent if opted in (#7).
- [ ] Schema documented and reviewed `needs-legal-review`.

<a id="10"></a>
### #10 — Settings page: toggle sharing, view/delete · `feat` `P1` `M2` `data` `legal` · est 2
**Acceptance criteria**
- [ ] Toggle data sharing on/off.
- [ ] "See what we collect" sample + "delete my contributed data" action.

<a id="11"></a>
### #11 — Chrome Web Store + AMO submission · `chore` `P1` `M2` · est 3
**Acceptance criteria**
- [ ] Listing assets, data disclosures match #8.
- [ ] Passes review on both stores.

<a id="12"></a>
### #12 — Weight tuning from test matrix · `chore` `P2` `M2` · est 2
**Acceptance criteria**
- [ ] Adjust rule weights to minimize false positives against an expanded matrix (≥20 stores).

<a id="13"></a>
### #13 — Firefox port · `feat` `P2` `M2` · est 2
**Acceptance criteria**
- [ ] Manifest/background tweaks for Firefox; feature parity verified.

---

<a id="14"></a>
### #14 — Ingest API for opted-in aggregate events · `feat` `P1` `M3` `data` · est 5
**Why:** Receives consented, anonymized events (Supabase/edge function is available in this environment).
**Acceptance criteria**
- [ ] Authenticated, rate-limited ingest endpoint accepting the #9 schema only.
- [ ] Rejects any payload containing URLs/PII (server-side validation).
- [ ] Storage partitioned for easy retention/deletion (#18).

<a id="15"></a>
### #15 — Market-intelligence dashboard · `feat` `P1` `M3` `data` · est 5
**Why:** The business payoff — surfaces trending niches, products, price bands, supplier patterns to inform our own future stores.
**Acceptance criteria**
- [ ] Aggregate views: trending categories, price-band distribution, supplier-signal frequency, by coarse region.
- [ ] Strictly aggregate (k-anonymity threshold; suppress small buckets).

<a id="16"></a>
### #16 — Reverse-image match vs AliExpress/Temu · `feat` `P2` `M3` · est 8
**Why:** Highest-signal detection upgrade; needs backend + budget.
**Acceptance criteria**
- [ ] Given a product image, return likely marketplace matches + source price.
- [ ] Only runs on explicit user action (cost + privacy control).

<a id="17"></a>
### #17 — Domain-age (WHOIS) + price-gap signals · `feat` `P2` `M3` · est 3
**Acceptance criteria**
- [ ] Domain-age and source-vs-retail price-gap added as weighted signals.

<a id="18"></a>
### #18 — DPA / retention + deletion pipeline · `chore` `P0` `M3` `legal` `data` · est 3
**Acceptance criteria**
- [ ] Documented retention window; automated purge.
- [ ] Honors per-user delete (#10) and bulk deletion requests.

---

<a id="19"></a>
### #19 — Remote-config rule updates · `feat` `P3` `M4` · est 3
Push rule/weight updates without a store release (signed config).

<a id="20"></a>
### #20 — ML scoring model · `feat` `P3` `M4` · est 8
Train a classifier on labeled stores; blend with heuristics.

<a id="21"></a>
### #21 — Crowd "report this store" loop · `feat` `P3` `M4` `data` · est 5
Opt-in user feedback to label stores; feeds #20.

<a id="22"></a>
### #22 — Shared blocklist · `feat` `P3` `M4` · est 3
Maintained list of confirmed dropshipping domains.

---

## Sequencing summary

```
M1 (weekend)   #1 → #2 → #3 → #4 → #5 → #6           shippable, client-side only
M2 (1–2 wks)   #7,#8 (legal gate) → #9,#10 → #11 → #12,#13   public + consent foundation
M3 (3–5 wks)   #18 (legal) → #14 → #15  (#16,#17 parallel)   market-intel payoff
M4 (ongoing)   #19–#22
```

**Critical path to revenue insight:** #1–#3 (prove the tool) → #7–#9 (consent +
schema) → #14–#15 (ingest + dashboard). Everything that touches data is gated by
`#7` consent and `#8` policy — those are `P0` blockers, not afterthoughts.
