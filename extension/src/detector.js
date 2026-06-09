/*
 * Dropshipping Detector — heuristic engine.
 *
 * Pure, dependency-free scoring logic. Lives in the content-script isolated
 * world and exposes a single global, `DropshipDetector.analyze(doc)`, which
 * content.js calls. Kept separate from content.js so the rules are easy to
 * unit-test and tune in isolation.
 *
 * Philosophy: no single signal is proof. Each rule contributes a weighted
 * vote; we sum the hits and normalise to a confidence percentage. The output
 * is a *probability that this is a dropshipping store*, never a verdict.
 */
(function () {
  "use strict";

  // Known dropshipping / print-on-demand app + supplier fingerprints. These
  // strings show up in script URLs, class names, or inline config when a store
  // is wired to a dropshipping backend.
  const DROPSHIP_APP_SIGNATURES = [
    "dsers",
    "oberlo",
    "spocket",
    "autods",
    "auto-ds",
    "zendrop",
    "cjdropshipping",
    "cj-dropshipping",
    "aliexpress",
    "alibaba",
    "dropshipman",
    "eprolo",
    "modalyst",
    "importify",
    "topdser",
    "trackingmore",
    "aftership", // not exclusive to dropshipping, but common in the stack
    "printful",
    "printify",
    "gelato",
  ];

  // Phrases that betray long, overseas fulfilment windows.
  const SHIPPING_TIME_PATTERNS = [
    /\b(\d{1,2})\s*[-–to]+\s*(\d{1,2})\s*(?:business\s+)?(?:days|weeks)\b/i,
    /\bship(?:s|ping|ped)?\s+from\s+(?:our\s+)?(?:overseas|china|international|asia)/i,
    /\bprocessing\s+time[:\s]+\d/i,
    /\b(?:please\s+)?allow\s+\d{1,2}\s*[-–]\s*\d{1,2}\s*(?:business\s+)?(?:days|weeks)/i,
    /\bdelivery\s+(?:takes|time)[:\s]+\d{1,2}\s*[-–]/i,
  ];

  // AliExpress-style boilerplate that gets pasted straight into descriptions.
  const GENERIC_DESCRIPTION_PATTERNS = [
    /\bpackage\s+(?:includes?|contents?)\s*:?\s*\d?\s*x?\b/i,
    /\bdue\s+to\s+(?:manual|hand)\s+measurement/i,
    /\b\d\s*[-–]?\s*\d?\s*cm\s+(?:error|difference|deviation)\b/i,
    /\bdue\s+to\s+(?:the\s+)?(?:light|screen|monitor).{0,30}(?:color|colour)\s+may\b/i,
    /\bnote\s*:\s*please\s+allow/i,
  ];

  // Manufactured urgency / scarcity.
  const URGENCY_PATTERNS = [
    /\bonly\s+\d{1,2}\s+(?:left|remaining|in\s+stock)\b/i,
    /\b(?:sale|offer|deal)\s+ends?\s+(?:in|soon|today)\b/i,
    /\bhurry[!,]?\s+(?:limited|while\s+stocks?)/i,
    /\bselling\s+(?:fast|out)\b/i,
    /\b\d+\s+people\s+are\s+(?:viewing|looking)\b/i,
  ];

  function getText(doc) {
    // Body innerText is expensive but gives us rendered, visible copy.
    return (doc.body && doc.body.innerText ? doc.body.innerText : "").slice(0, 200000);
  }

  function getHtml(doc) {
    return (doc.documentElement ? doc.documentElement.outerHTML : "").slice(0, 1000000);
  }

  function anyPattern(patterns, text) {
    for (const p of patterns) if (p.test(text)) return true;
    return false;
  }

  function countMatches(substrings, haystackLower) {
    const found = new Set();
    for (const s of substrings) {
      if (haystackLower.includes(s)) found.add(s);
    }
    return found;
  }

  // --- Individual rules. Each returns { hit, weight, label, detail }. ---

  function ruleShopify(html) {
    const hit =
      /cdn\.shopify\.com/i.test(html) ||
      /<meta[^>]+name=["']shopify-/i.test(html) ||
      /Shopify\.(?:shop|theme|routes)/i.test(html) ||
      /\/cdn\/shop\//i.test(html);
    return {
      id: "shopify",
      hit,
      weight: 2,
      label: "Runs on Shopify",
      detail: hit
        ? "Built on Shopify — the platform most dropshipping stores use. Not proof on its own, but raises the prior."
        : "No Shopify fingerprint detected.",
    };
  }

  function ruleDropshipApps(html) {
    const found = countMatches(DROPSHIP_APP_SIGNATURES, html.toLowerCase());
    const hit = found.size > 0;
    return {
      id: "dropship_apps",
      hit,
      weight: 3,
      label: "Dropshipping/supplier app footprint",
      detail: hit
        ? "Found references to: " + Array.from(found).join(", ") + "."
        : "No known dropshipping app or supplier (AliExpress, DSers, Zendrop, …) referenced.",
    };
  }

  function ruleShippingTimes(text) {
    const hit = anyPattern(SHIPPING_TIME_PATTERNS, text);
    return {
      id: "shipping_times",
      hit,
      weight: 2,
      label: "Long / overseas shipping language",
      detail: hit
        ? "Page mentions multi-week or overseas fulfilment windows — typical of drop-shipped goods."
        : "No long-shipping-window language found.",
    };
  }

  function ruleGenericDescriptions(text) {
    const hit = anyPattern(GENERIC_DESCRIPTION_PATTERNS, text);
    return {
      id: "generic_desc",
      hit,
      weight: 1,
      label: "Copy-pasted marketplace descriptions",
      detail: hit
        ? "Contains AliExpress-style boilerplate ('package includes', manual-measurement disclaimers, …)."
        : "No marketplace-boilerplate descriptions detected.",
    };
  }

  function ruleUrgency(text) {
    const hit = anyPattern(URGENCY_PATTERNS, text);
    return {
      id: "urgency",
      hit,
      weight: 1,
      label: "Manufactured urgency / scarcity",
      detail: hit
        ? "Uses scarcity or countdown tactics ('only 3 left', 'sale ends soon', live viewer counts)."
        : "No obvious scarcity/urgency tactics found.",
    };
  }

  function ruleSupportEmail(html) {
    // Free-mail support address = no real corporate domain.
    const hit = /(?:mailto:)?[a-z0-9._%+-]+@(?:gmail|outlook|hotmail|yahoo|qq|163)\.com/i.test(html);
    return {
      id: "free_email",
      hit,
      weight: 1,
      label: "Free-mail support address",
      detail: hit
        ? "Customer support uses a free email provider rather than a company domain."
        : "No free-mail support address found.",
    };
  }

  function ruleFakeDiscount(text) {
    // Big strikethrough discounts ("$199 $39", "70% OFF") paired with .99/.97 prices.
    const bigPercent = /\b(?:[5-9]\d|\d{3})%\s*(?:off|korting|discount)\b/i.test(text);
    const oddPrice = /[$€£]\s?\d+[.,](?:97|99)\b/.test(text);
    const hit = bigPercent && oddPrice;
    return {
      id: "fake_discount",
      hit,
      weight: 1,
      label: "Inflated discount + charm pricing",
      detail: hit
        ? "Large advertised discount combined with .99/.97 charm pricing — a classic inflated-MSRP pattern."
        : "No inflated-discount pattern detected.",
    };
  }

  function analyze(doc) {
    const text = getText(doc);
    const html = getHtml(doc);

    const rules = [
      ruleShopify(html),
      ruleDropshipApps(html),
      ruleShippingTimes(text),
      ruleGenericDescriptions(text),
      ruleUrgency(text),
      ruleSupportEmail(html),
      ruleFakeDiscount(text),
    ];

    const maxScore = rules.reduce((sum, r) => sum + r.weight, 0);
    const score = rules.reduce((sum, r) => sum + (r.hit ? r.weight : 0), 0);
    const confidence = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    let verdict;
    if (confidence >= 55) verdict = "high";
    else if (confidence >= 25) verdict = "medium";
    else verdict = "low";

    return {
      confidence, // 0–100
      score, // raw weighted hits
      maxScore,
      verdict, // "low" | "medium" | "high"
      hits: rules.filter((r) => r.hit),
      misses: rules.filter((r) => !r.hit),
      rules,
      url: doc.location ? doc.location.href : "",
      analyzedAt: Date.now(),
    };
  }

  const api = { analyze, version: "0.1.0" };

  // Expose for content.js (shared isolated-world global) and for testing.
  if (typeof window !== "undefined") window.DropshipDetector = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
