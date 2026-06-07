import type { Team } from "../data/teams";

// ────────────────────────────────────────────────────────────────────────────
//  De Voorwaarts WK26-Uitslagengenerator™
//  Produceert volledig onrealistische uitslagen met een onderbouwing die
//  overtuigend KLINKT maar bij nader inzien nergens op slaat.
// ────────────────────────────────────────────────────────────────────────────

export type MatchResult = {
  home: Team;
  away: Team;
  homeScore: number;
  awayScore: number;
  minuteOfDecision: string;
  reasoning: string[];
  confidence: number; // 87 - 312 %
  manOfTheMatch: string;
  weirdStat: string;
};

const rng = () => Math.random();
const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
const between = (min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;

// Schaamteloos onrealistische scores.
function absurdScore(): number {
  const roll = rng();
  if (roll < 0.55) return between(4, 9);
  if (roll < 0.85) return between(10, 17);
  return between(18, 31);
}

const decisionMinutes = [
  "in de 4e minuut, voor de meeste mensen zaten",
  "in de 119e minuut, uit pure koppigheid",
  "in de 73e minuut, exact toen de hotdogkraam sloot",
  "in blessuretijd van de eerste helft, twee keer",
  "ergens tussen de 12e en 12e minuut",
  "tijdens de rust, technisch gezien illegaal",
  "in de 90+8e minuut, met een hakbal vanaf de middenstip",
];

const players = [
  "de reservekeeper",
  "een speler die officieel geblesseerd was",
  "de grensrechter (debuut)",
  "iemand uit publiek vak F",
  "de oudste veldspeler ooit (51)",
  "de teammasseur",
  "een spits die net nee had gezegd tegen de transfer",
  "de aanvoerder, op blote voeten",
  "de vierde official",
];

// "Tactische" bouwstenen — klinken slim, betekenen niets.
const tacticalA = [
  "het lage blok in een hoge ruit",
  "de valse negen die eigenlijk een echte elf bleek",
  "een 2-7-1 die alleen werkt bij oostenwind",
  "de gegenpressing zonder bal én zonder pers",
  "het overlappende centrumverdedigersduo",
  "de inverted spits die naar binnen schiet vanaf de tribune",
  "een man-op-man dekking op de scheidsrechter",
];

const tacticalB = [
  "de barometrische druk in het stadion",
  "het collectieve bioritme van de bezoekende fans",
  "de gemiddelde schoenmaat van de bank",
  "een rusttoespraak die niemand kon verstaan maar iedereen voelde",
  "de hoek waaronder de zon de cornervlag raakte",
  "het feit dat de tegenstander net pasta had gegeten",
  "de vibe, en de vibe alleen",
];

const causal = [
  "Daardoor was het wiskundig onvermijdelijk dat",
  "Hieruit volgt logischerwijs dat",
  "Iedere analist met een hart zag al aankomen dat",
  "De data — die ik zelf heb verzonnen — toont onomstotelijk aan dat",
  "Volgens de oude Voorwaarts-leer van 1907 betekent dit dat",
  "Het is dan ook geen toeval dat",
];

const conclusionTail = [
  "de bal simpelweg vaker het net moest vinden dan goede smaak toestaat.",
  "het doelsaldo persoonlijk beledigd raakte.",
  "de zwaartekracht een uitzondering maakte voor deze ploeg.",
  "het scorebord om genade smeekte.",
  "de keeper psychologisch verhuisde naar een andere provincie.",
  "de marge groter werd dan het toernooireglement aankan.",
];

const weirdStats = [
  "0 schoten op doel, 14 doelpunten — een ratio van oneindig.",
  "balbezit: 3%. Volledig verdiend.",
  "afstand gelopen: 2 km, allemaal achteruit.",
  "passes voltooid: 1, maar het was een héél goede.",
  "corners: -2 (de scheidsrechter is ze kwijtgeraakt).",
  "gele kaarten: 0. Vriendelijkheid: torenhoog.",
  "verwachte goals (xG): 0,04. Werkelijke goals: zie scorebord.",
];

function fmtTeam(t: Team) {
  return `${t.flag} ${t.name}`;
}

export function generateResult(
  home: Team,
  away: Team,
  answers: Record<string, string>,
): MatchResult {
  let h = absurdScore();
  let a = absurdScore();
  // Geen gelijkspel — chaos kent geen genade.
  if (h === a) h += between(1, 4);

  // De "vibes" uit de antwoorden worden plechtig genoemd, doen verder niets.
  const vibeList = Object.values(answers);
  const vibe = vibeList.length ? pick(vibeList) : "ondefinieerbaar";

  const winner = h > a ? home : away;
  const loser = h > a ? away : home;

  const reasoning = [
    `Op basis van jouw antwoorden detecteerde ik een ${vibe} grondhouding. Dat is, en ik kan dit niet genoeg benadrukken, beslissend.`,
    `${fmtTeam(winner)} koos voor ${pick(tacticalA)}, terwijl ${fmtTeam(
      loser,
    )} fataal vertrouwde op ${pick(tacticalB)}.`,
    `${pick(causal)} ${pick(conclusionTail)}`,
    `De wedstrijd werd beslist ${pick(decisionMinutes)} — door ${pick(
      players,
    )}.`,
  ];

  return {
    home,
    away,
    homeScore: h,
    awayScore: a,
    minuteOfDecision: pick(decisionMinutes),
    reasoning,
    confidence: between(87, 312),
    manOfTheMatch: pick(players),
    weirdStat: pick(weirdStats),
  };
}
