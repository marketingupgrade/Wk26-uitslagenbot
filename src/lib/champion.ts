import { teams, type Team } from "../data/teams";

// ────────────────────────────────────────────────────────────────────────────
//  De Voorwaarts Wereldkampioen-Projector™
//  Kiest een volstrekt willekeurige wereldkampioen en onderbouwt die met
//  compleet gefabriceerde toernooistatistieken. Niets hiervan is echt.
// ────────────────────────────────────────────────────────────────────────────

export type ChampionResult = {
  champion: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  topScorer: { name: string; goals: number };
  possession: number; // absurd percentage
  xg: number; // "verwachte goals" over het toernooi
  fabricatedStats: string[];
  verdict: string;
  finalLine: string;
};

const rng = () => Math.random();
const pick = <T,>(a: T[]): T => a[Math.floor(rng() * a.length)];
const between = (min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;

const scorerNames = [
  "de derde keeper",
  "een geblesseerde vleugelverdediger",
  "de teambuschauffeur",
  "een 16-jarige op proef",
  "de assistent-kok",
  "iemand die alleen voor het buffet kwam",
  "de aanvoerder, op één schoen",
  "een fan die het veld op rende en bleef",
];

const verdicts = [
  "verdiend, op een manier die geen enkele commissie kan navertellen",
  "tegen alle wetten van de logica, de sport en de zwaartekracht in",
  "met cijfers die accountants tot tranen toe ontroeren",
  "volgens de heilige Voorwaarts-leer van 1907 volkomen onvermijdelijk",
  "ondanks 0% balbezit in elke wedstrijd behalve de rust",
];

const statBanks = [
  () => `Totale loopafstand: ${between(3, 9)} kilometer — als team, het hele toernooi.`,
  () => `Balbezit in de finale: ${between(1, 6)}%. Toch gewonnen met dubbele cijfers.`,
  () => `Corners benut: ${between(8, 14)} uit ${between(2, 5)} genomen. Wiskundig onmogelijk, juridisch waterdicht.`,
  () => `Gele kaarten: ${between(0, 1)}. Vriendelijkste kampioen sinds mensenheugenis.`,
  () => `Aantal keer dat de scheidsrechter "sorry" zei: ${between(4, 19)}.`,
  () => `Buitenspeldoelpunten goedgekeurd: ${between(3, 7)}, na uitgebreid oogcontact.`,
  () => `Hoogste xG in één wedstrijd: 0,03. Eindstand die dag: ${between(6, 12)}-0.`,
  () => `Penalty's gemist én alsnog gescoord: ${between(1, 3)}. Niemand weet hoe.`,
];

export function generateChampion(
  answers: Record<string, string>,
): ChampionResult {
  const champion = pick(teams);

  // Zeven knockout/poule-duels naar de titel, volledig verzonnen.
  const played = 7;
  const won = between(4, 7);
  const lost = between(0, Math.max(0, 7 - won));
  const drawn = Math.max(0, played - won - lost);

  const goalsFor = between(28, 71);
  const goalsAgainst = between(0, 9);

  const topScorer = {
    name: pick(scorerNames),
    goals: between(11, goalsFor),
  };

  const vibeList = Object.values(answers);
  const vibe = vibeList.length ? pick(vibeList) : "ondefinieerbaar";

  const banks = [...statBanks];
  const fabricatedStats: string[] = [];
  for (let i = 0; i < 4 && banks.length; i++) {
    fabricatedStats.push(banks.splice(Math.floor(rng() * banks.length), 1)[0]());
  }

  return {
    champion,
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    topScorer,
    possession: between(2, 9),
    xg: Number((rng() * 1.2).toFixed(2)),
    fabricatedStats,
    verdict: `${champion.name} wordt wereldkampioen — ${pick(verdicts)}.`,
    finalLine: `Doorslaggevend bleek jouw ${vibe} grondhouding. De cijfers volgden gehoorzaam.`,
  };
}
