# Work Order — Dropshipping Detector (Browser Extension)

**Status:** Draft / ready to scope
**Owner:** _TBD_
**Target repo:** _new standalone repo (to be created)_
**Date:** 2026-06-09

---

## 1. Summary

Build a browser extension (Manifest V3) that, on any product/store page,
estimates the **probability that the site is a dropshipping operation** and
surfaces a confidence score with the signals behind it. The MVP runs **entirely
client-side** — no backend, no data leaves the user's machine.

The output is a *probability*, never a verdict. Legitimate small businesses use
the same tooling as dropshippers, so the UI must communicate likelihood, not
accusation.

---

## 2. Goals & non-goals

### Goals
- One-click, at-a-glance signal: Low / Medium / High likelihood + % confidence.
- Transparent: show **which** signals fired and why.
- Zero infrastructure for MVP (all heuristics run in the content script).
- Loadable unpacked in Chrome/Edge/Brave; Firefox with minor manifest tweaks.

### Non-goals (explicitly out of scope for v1)
- Reverse-image matching against AliExpress/Temu (Phase 2 — needs a backend).
- ML classifier / training pipeline.
- Crowd-sourced blocklist or shared database.
- Mobile browsers.

---

## 3. Detection signals (MVP rule set)

Each rule is a weighted vote. Score = Σ(weights of fired rules); confidence =
score / maxScore × 100. **No single rule is decisive.**

| # | Signal | Weight | How detected (client-side) |
|---|--------|--------|----------------------------|
| 1 | Runs on Shopify | 2 | `cdn.shopify.com`, `/cdn/shop/`, `Shopify.*` globals, meta tags |
| 2 | Dropshipping/supplier app footprint | 3 | DSers, Oberlo, Spocket, Zendrop, AutoDS, CJ, AliExpress, Printful/Printify… in DOM/scripts |
| 3 | Long / overseas shipping language | 2 | Regex: "10–20 business days", "ships from overseas", "processing time…" |
| 4 | Copy-pasted marketplace descriptions | 1 | AliExpress boilerplate: "package includes", manual-measurement disclaimers |
| 5 | Manufactured urgency / scarcity | 1 | "only 3 left", countdowns, live-viewer counts |
| 6 | Free-mail support address | 1 | support@gmail/outlook/yahoo/qq |
| 7 | Inflated discount + charm pricing | 1 | Big % off paired with .97/.99 prices |

**Verdict bands:** `<25%` Low · `25–55%` Medium · `>55%` High.

> A reference implementation of this rule engine already exists at
> `extension/src/detector.js` in the WK26 repo — lift it as the starting point.

---

## 4. Architecture (MVP)

```
extension/
  manifest.json          # MV3
  src/
    detector.js          # pure heuristic engine — DropshipDetector.analyze(doc)
    content.js           # gathers DOM, calls detector, sends result to background
    background.js        # service worker — stores result per tab, sets badge
    popup.html/js/css    # verdict UI: score gauge + fired-signal list
  icons/                 # 16/48/128 png
```

- **content.js** runs at `document_idle`, calls `DropshipDetector.analyze(document)`.
- Result is messaged to **background.js**, which keys it by `tabId` and sets the
  toolbar **badge** (e.g. green/amber/red + score).
- **popup** reads the active tab's result and renders the gauge + signal
  breakdown.
- detector.js + content.js share the isolated-world global, so no bundler is
  required for MVP.

---

## 5. Deliverables

1. `manifest.json` (MV3) loadable unpacked.
2. `detector.js` heuristic engine with the 7 rules above + unit tests.
3. `content.js` / `background.js` wiring with per-tab badge.
4. Popup UI: confidence gauge, Low/Med/High verdict, expandable signal list
   with "why this fired" detail.
5. Icons (16/48/128).
6. `README.md`: install (load unpacked), how scoring works, limitations.
7. A short test matrix: 5 known dropshipping stores + 5 legit stores, with
   observed scores (to sanity-check false-positive rate).

---

## 6. Milestones & estimate

| Phase | Scope | Estimate |
|-------|-------|----------|
| **M1 — MVP** | DOM heuristics, badge, popup, README. Client-side only. | ~1 weekend |
| **M2 — Hardening** | Tune weights against test matrix, reduce false positives, Firefox port, store packaging | ~1 week |
| **M3 — Reverse image (optional)** | Backend service: match product images vs AliExpress/Temu; domain-age (WHOIS) signal; price-gap detection | ~2–4 weeks + running cost |
| **M4 — Scale (optional)** | Maintained blocklist, ML scoring, store-listing polish | ongoing |

---

## 7. Acceptance criteria (M1)

- [ ] Loads unpacked in Chrome with no manifest errors.
- [ ] On any HTTPS page, badge reflects a 0–100 score within ~1s of load.
- [ ] Popup lists every fired signal with a plain-language reason.
- [ ] Known dropshipping test stores score Medium/High; mainstream retailers
      (Amazon, a known brand's own store) score Low.
- [ ] No network requests made by the extension (verifiable in DevTools).
- [ ] UI states it is a *likelihood estimate*, not an accusation.

---

## 8. Risks & notes

- **False positives are the core risk.** "Shopify + an app" describes many
  legitimate SMBs. Weighting and the Low/Med/High framing matter more than
  adding rules.
- **Arms race:** public rules get evaded (stores hide shipping times, rewrite
  copy). Keep the rule set easy to update; consider remote-config in M2+.
- **Reverse-image search is the highest-signal feature but the first thing that
  needs a backend + budget** — defer to M3 and gate on MVP validation.
- **Privacy is a selling point:** keep MVP 100% local; if M3 adds a backend,
  only send image hashes/URLs the user explicitly opts into.

---

## 9. Open questions for the new repo

- Distribution: unpacked dev only, or publish to Chrome Web Store / AMO?
- Brand/name and icon design.
- Do we want a "report this store" feedback loop (implies a backend sooner)?
