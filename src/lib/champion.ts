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

// Hyperspecifieke, volstrekt niet-voetbal "statistieken". Pure onzin met
// een cijfer. Er worden er altijd precies 12 willekeurig uit getrokken.
const statBanks: (() => string)[] = [
  () => `Aantal seconden dat een speler binnen reguliere speeltijd water ging drinken: ${between(3, 247)}.`,
  () => `Keren dat iemand "sorry" zei tegen de cornervlag: ${between(2, 19)}.`,
  () => `Totale tijd besteed aan het strikken van schoenveters: ${between(1, 6)} min ${between(0, 59)} sec.`,
  () => `Grassprieten persoonlijk beledigd: ${between(140, 9100)}.`,
  () => `Aantal keer dat de keeper omhoog staarde zonder reden: ${between(4, 38)}.`,
  () => `High-fives geweigerd op het middenveld: ${between(0, 11)}.`,
  () => `Seconden oogcontact met de assistent-scheidsrechter: ${between(2, 88)}.`,
  () => `Keren dat een speler vergat in welk land hij stond: ${between(1, 7)}.`,
  () => `Diepe zuchten op de reservebank, totaal: ${between(12, 204)}.`,
  () => `Aantal keer dat de bal werd uitgescholden: ${between(3, 27)}.`,
  () => `Stappen achteruit gezet zonder enige aanleiding: ${between(40, 612)}.`,
  () => `Keren dat iemand deed alsof hij telefonisch werd opgeroepen: ${between(1, 9)}.`,
  () => `Geeuwen tijdens een dreigende aanval: ${between(2, 22)}.`,
  () => `Seconden besteed aan het bewonderen van de eigen schaduw: ${between(5, 130)}.`,
  () => `Aantal keer dat het doelnet werd geknuffeld na een goal: ${between(1, 14)}.`,
  () => `Verdwaalde gedachten over het avondeten, geregistreerd: ${between(6, 41)}.`,
  () => `Tijd gebukt om één specifieke graspol te bestuderen: ${between(8, 95)} sec.`,
  () => `Keren dat een speler naar de verkeerde tribune zwaaide: ${between(1, 12)}.`,
  () => `Seconden besteed aan het rechttrekken van de sokken: ${between(11, 176)}.`,
  () => `Aantal niespauzes binnen het strafschopgebied: ${between(0, 6)}.`,
  () => `Keren dat de scheidsrechter aan zijn eigen fluitje rook: ${between(1, 8)}.`,
  () => `Onbedoelde aaibewegingen over de bal: ${between(3, 29)}.`,
  () => `Aantal keer dat iemand "wacht, welke helft is dit?" vroeg: ${between(1, 10)}.`,
  () => `Totale tijd zoekend naar de bal in de eigen broekzak: ${between(4, 52)} sec.`,
  () => `Keren dat een verdediger een meeuw probeerde te dekken: ${between(0, 5)}.`,
  () => `Aantal denkbeeldige doelpunten gevierd: ${between(2, 17)}.`,
];

/** Trek precies `n` unieke onzin-statistieken (default 12). */
function drawStats(n = 12): string[] {
  const banks = [...statBanks];
  const out: string[] = [];
  while (out.length < n && banks.length) {
    out.push(banks.splice(Math.floor(rng() * banks.length), 1)[0]());
  }
  return out;
}

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

  const fabricatedStats = drawStats(12);

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
