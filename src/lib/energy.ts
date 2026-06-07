// ────────────────────────────────────────────────────────────────────────────
//  De Voorwaarts Energievoetafdruk-Calculator™
//  Schat (met een knipoog, maar op semi-realistische kentallen) hoeveel
//  elektriciteit één gegenereerde uitslag kost over de hele keten —
//  GitHub + Vercel + Gemini API — en zet dat af tegen het importeren van
//  één BYD SUV naar Nederland (productie + zeevracht).
// ────────────────────────────────────────────────────────────────────────────

export type EnergyEstimate = {
  perResultWh: number; // totaal Wh per uitslag
  perResultKwh: number; // idem in kWh
  breakdown: { label: string; wh: number }[];
  bydKwh: number; // totale keten-energie voor één BYD SUV-import
  ratio: number; // aantal uitslagen dat gelijkstaat aan 1 BYD-import
};

// Basiskentallen (Wh per uitslag), toegerekend over de keten.
const BASE = {
  github: 0.02, // repo-opslag + CI/Actions per generatie
  vercel: 0.8, // edge-functie + datatransfer van de assets
  gemini: 0.6, // één LLM-inferentie (flash-klasse)
};

// BYD SUV importeren naar NL (kWh, hele supply chain).
const BYD = {
  manufacturing: 28000, // productie incl. accu
  freight: 1500, // zeevracht China→Rotterdam + binnenlands transport
};

// Lichte ruis zodat elke uitslag nét een ander getal geeft.
const jitter = (v: number, pct = 0.08) =>
  v * (1 + (Math.random() * 2 - 1) * pct);

export function generateEnergy(): EnergyEstimate {
  const breakdown = [
    { label: "GitHub", wh: jitter(BASE.github) },
    { label: "Vercel", wh: jitter(BASE.vercel) },
    { label: "Gemini API", wh: jitter(BASE.gemini) },
  ];
  const perResultWh = breakdown.reduce((s, b) => s + b.wh, 0);
  const bydKwh = jitter(BYD.manufacturing + BYD.freight, 0.05);
  const ratio = (bydKwh * 1000) / perResultWh;
  return {
    perResultWh,
    perResultKwh: perResultWh / 1000,
    breakdown,
    bydKwh,
    ratio,
  };
}
