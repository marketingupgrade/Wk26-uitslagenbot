// ────────────────────────────────────────────────────────────────────────────
//  Procedurele vragen-generator.
//  Geen vaste vragenlijst: elke sessie worden 5–7 hyper-sarcastische,
//  volstrekt niet-voetbal vragen samengesteld uit woordbanken. De antwoord-
//  opties horen bij de vraag (zelfde onderwerp) — geen losse non-sequiturs.
//  Daarnaast: een gestructureerde sentiment-opbouw voor de Waarheidsmeter.
// ────────────────────────────────────────────────────────────────────────────

export type Choice = { label: string; vibe: string };
export type Question = { id: string; prompt: string; choices: Choice[] };

const rng = () => Math.random();
const pick = <T,>(a: T[]): T => a[Math.floor(rng() * a.length)];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Een set willekeurige, unieke elementen uit een array.
function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  }
  return out;
}

// ── Woordbanken ─────────────────────────────────────────────────────────────
const objects = [
  "een lauwe tomatensoep",
  "de holle kant van een lepel",
  "een plak kaas zonder gaten",
  "een roltrap die de verkeerde kant op gaat",
  "een onbeantwoorde voicemail uit 2014",
  "een te strak zittende coltrui",
  "de stilte vlak na een niesbui",
  "een verdwaalde sok in de wasmachine",
  "een knäckebröd zonder beleg",
  "het laatste blokje van een chocoladereep",
  "een paraplu die binnenstebuiten klapt",
  "een vergeten wachtwoord",
  "de geur van een gloednieuwe printer",
  "een tuinkabouter met ambities",
  "een kruimel die je niet kunt pakken",
  "de pauzestand van een magnetron",
];

const entities = [
  "jouw oma",
  "een duif met een persoonlijke hekel aan jou",
  "de manager van een tankstation",
  "een teleurgestelde aardappel",
  "je vroegere gymleraar",
  "een pratende koelkast",
  "de buurman die nooit groet",
  "een mysterieuze man in een trenchcoat",
  "het kind dat altijd wint met Stratego",
];

const states = [
  "emotioneel",
  "juridisch",
  "spiritueel",
  "thermisch",
  "ongemakkelijk",
  "verdacht kalm",
  "structureel",
  "diep vanbinnen",
];

const scaleLow = [
  "lauwe tomatensoep",
  "een uitgebluste batterij",
  "een natte krant",
  "nul komma nul",
  "een vermoeide zucht",
];

const scaleHigh = [
  "een onverwerkt jeugdtrauma",
  "volledige wereldheerschappij",
  "een staande ovatie",
  "spontane verlichting",
  "een voltallig gospelkoor",
];

// Vibe-bouwstenen: interne 'sfeer' die de uitslag-onderbouwing voedt.
const vibeAdjs = [
  "voorwaardelijk", "ijskoud", "autoritair", "clandestien", "erfelijk",
  "structureel", "spiritueel", "fatalistisch", "numerologisch", "thermisch",
  "juridisch", "ongeneeslijk", "dreigend", "transparant", "veerkrachtig",
  "ongebonden", "psychologisch", "mythisch",
];
const vibeNouns = [
  "dominant", "briljant", "kalm", "chaotisch", "toegewijd", "explosief",
  "helder", "twijfelend", "grandioos", "paniekerig", "ambitieus", "onverstoorbaar",
];

// ── Vraag-specs ─────────────────────────────────────────────────────────────
// Elke spec bouwt zowel de vraag als een POOL passende antwoorden uit dezelfde
// slots, zodat de opties echt over de vraag gaan.
type Slots = {
  object: string;
  entity: string;
  state: string;
  scaleA: string;
  scaleB: string;
};

type QuestionSpec = {
  prompt: (s: Slots) => string;
  answers: (s: Slots) => string[];
};

function makeSlots(): Slots {
  return {
    object: pick(objects),
    entity: pick(entities),
    state: pick(states),
    scaleA: pick(scaleLow),
    scaleB: pick(scaleHigh),
  };
}

const questionSpecs: QuestionSpec[] = [
  {
    prompt: (s) =>
      `Op een schaal van ${s.scaleA} tot ${s.scaleB}: hoe ${s.state} voel jij je vandaag?`,
    answers: (s) => [
      `Eerder ${s.scaleA}, eerlijk gezegd.`,
      `Helemaal richting ${s.scaleB}.`,
      `Precies in het midden, maar wél ${s.state}.`,
      `Voorbij ${s.scaleB}. Van de schaal af.`,
      `Vandaag puur ${s.scaleA}.`,
      `${cap(s.state)}. Pijnlijk ${s.state}.`,
    ],
  },
  {
    prompt: (s) => `Diep ademhalen. Dit bepaalt alles. Wat zou jij doen met ${s.object}?`,
    answers: () => [
      `Negeren tot het vanzelf weggaat.`,
      `Aanbidden. Onvoorwaardelijk.`,
      `Opeten. Sorry, niet sorry.`,
      `Inlijsten en boven de bank hangen.`,
      `Eraan ruiken en doorlopen.`,
      `Begraven in de achtertuin.`,
    ],
  },
  {
    prompt: (s) => `Snel, niet nadenken: welke relatie heb jij precies met ${s.object}?`,
    answers: () => [
      `Het is ingewikkeld.`,
      `Wij praten niet meer.`,
      `Diepe, wederzijdse haat.`,
      `Puur platonisch.`,
      `Wij zijn praktisch getrouwd.`,
      `Co-ouderschap, vreedzaam.`,
    ],
  },
  {
    prompt: (s) =>
      `Stel: ${s.entity} kijkt jou recht aan en fluistert iets over ${s.object}. Wat fluistert ${s.entity}?`,
    answers: () => [
      `"Het weet wat je deed."`,
      `"Vertrouw het nooit."`,
      `"Het is al begonnen."`,
      `"Loop. Nu. Niet omkijken."`,
      `"Jij bent de uitverkorene."`,
      `"Wij praten hier later over."`,
    ],
  },
  {
    prompt: (s) =>
      `Cruciale kwalificatievraag: hoe ${s.state} is ${s.object} volgens jou, héél eerlijk?`,
    answers: (s) => [
      `Extreem ${s.state}.`,
      `Totaal niet ${s.state}.`,
      `Verontrustend ${s.state}.`,
      `Net ${s.state} genoeg.`,
      `${cap(s.state)}? Geen idee, maar ja.`,
      `Te ${s.state} om over te praten.`,
    ],
  },
  {
    prompt: (s) =>
      `Als ${s.entity} een ringtone had die afging tijdens ${s.object}, hoe erg is dat dan?`,
    answers: (s) => [
      `Ramp van wereldformaat.`,
      `Eigenlijk best grappig.`,
      `Onvergeeflijk. Punt.`,
      `Hangt af van de ringtone.`,
      `Niet erger dan ${s.object}.`,
      `Ik bel de autoriteiten.`,
    ],
  },
  {
    prompt: (s) =>
      `Belangrijk en volledig onbelangrijk: hoeveel vertrouwen heb jij in ${s.object}?`,
    answers: () => [
      `Blind vertrouwen.`,
      `Nul. Nul komma nul.`,
      `Meer dan in mezelf.`,
      `Op goede dagen een beetje.`,
      `Voor precies 87%, niet meer.`,
      `Met heel mijn hart, helaas.`,
    ],
  },
  {
    prompt: (s) =>
      `Eén vraag, het hele WK hangt ervan af: wat zegt ${s.object} over jou als mens?`,
    answers: () => [
      `Dat ik verborgen diepgang heb.`,
      `Niets goeds, vrees ik.`,
      `Alles. Echt alles.`,
      `Meer dan mijn therapeut weet.`,
      `Dat ik klaar ben voor het WK.`,
      `Dat ik beter niet had geantwoord.`,
    ],
  },
  {
    prompt: (s) => `Hoe verhoudt jouw ochtendhumeur zich tot ${s.object}?`,
    answers: (s) => [
      `Exact identiek.`,
      `Nog somberder dan dat.`,
      `${cap(s.object)} wint glansrijk.`,
      `Volstrekt onvergelijkbaar.`,
      `Op een goede dag: gelijkspel.`,
      `Daar wil ik 's ochtends niet aan denken.`,
    ],
  },
  {
    prompt: (s) => `Op welke precieze manier heeft ${s.object} jou ooit teleurgesteld?`,
    answers: () => [
      `Op alle mogelijke manieren.`,
      `Te pijnlijk om te delen.`,
      `Precies zoals iedereen.`,
      `Stilletjes, maar grondig.`,
      `Nog nooit. Heilig vertrouwen.`,
      `Vraag niet waar het bij is.`,
    ],
  },
  {
    prompt: (s) => `Als jij ${s.entity} was, zou je dan anders omgaan met ${s.object}?`,
    answers: (s) => [
      `Ja, met veel meer respect.`,
      `Nee, exact hetzelfde.`,
      `Ik zou het volledig mijden.`,
      `Alleen in het weekend.`,
      `Ja, en niemand zou het snappen.`,
      `Nee, ik bén ${s.entity} vanbinnen.`,
    ],
  },
];

// ── Antwoord-selectie ───────────────────────────────────────────────────────
// Kies `n` unieke opties uit de pool van de vraag; `used` voorkomt dat exact
// dezelfde optie in een latere vraag terugkomt.
function pickAnswers(pool: string[], n: number, used: Set<string>): Choice[] {
  const avail = pool.filter((p) => !used.has(p));
  const base = avail.length >= n ? avail : pool; // val terug op volledige pool
  return sample(base, n).map((label) => {
    used.add(label);
    return { label, vibe: `${pick(vibeAdjs)} ${pick(vibeNouns)}` };
  });
}

/** Aantal vragen voor deze sessie: willekeurig 5–7. */
export function randomQuestionCount(): number {
  return 5 + Math.floor(rng() * 3); // 5, 6 of 7
}

/** Genereer `count` procedurele vragen mét passende antwoordopties. */
export function generateQuestions(count: number): Question[] {
  const specs = sample(questionSpecs, Math.min(count, questionSpecs.length));
  while (specs.length < count) specs.push(pick(questionSpecs));

  const used = new Set<string>(); // gedeeld over de sessie: geen herhaling
  return specs.map((spec, i) => {
    const s = makeSlots();
    const nChoices = 3 + Math.floor(rng() * 2); // 3 of 4
    return {
      id: `q${i}`,
      prompt: spec.prompt(s),
      choices: pickAnswers(spec.answers(s), nChoices, used),
    };
  });
}

// ── Vervolgvragen richting de wereldkampioen ───────────────────────────────
// Drie extra vragen die "doorrekenen" naar de eindzege, met antwoorden die
// echt over de finale/titel gaan.
const championSpecs: QuestionSpec[] = [
  {
    prompt: (s) => `Finalevraag: welke ploeg verdient de wereldtitel volgens ${s.object}?`,
    answers: (s) => [
      `De underdog. Altijd de underdog.`,
      `Degene met de mooiste shirts.`,
      `Wie het minst hard heeft getraind.`,
      `Dat fluistert ${s.object} niet.`,
      `Het gastland, uit beleefdheid.`,
      `Iedereen behalve de favoriet.`,
    ],
  },
  {
    prompt: (s) =>
      `Finalevraag: als de beker kon praten, hoe ${s.state} zou hij zijn over ${s.object}?`,
    answers: (s) => [
      `Oneindig ${s.state}.`,
      `Totaal niet ${s.state}, juist trots.`,
      `Te ${s.state} voor woorden.`,
      `Net ${s.state} genoeg voor een traan.`,
      `${cap(s.state)}, en luidruchtig.`,
      `De beker zwijgt in alle talen.`,
    ],
  },
  {
    prompt: (s) => `Finalevraag: ${s.entity} houdt de cup omhoog. Wat schreeuwt het stadion?`,
    answers: (s) => [
      `"Wij geloofden nooit, maar tóch!"`,
      `"Dit gaat de boeken in!"`,
      `"Wie had dít zien aankomen?"`,
      `Oorverdovende, ongemakkelijke stilte.`,
      `"${cap(s.entity)} voor president!"`,
      `"Eindelijk! Eindelijk!"`,
    ],
  },
  {
    prompt: (s) =>
      `Doorrekenend naar de eindzege: hoeveel weegt ${s.object} in jouw kampioensformule?`,
    answers: () => [
      `Doorslaggevend. 90% van alles.`,
      `Marginaal, maar voelbaar.`,
      `Zwaarder dan de spelers zelf.`,
      `Precies 0%. En toch cruciaal.`,
      `Net genoeg om de finale te kantelen.`,
      `Onmeetbaar. Letterlijk.`,
    ],
  },
  {
    prompt: (s) =>
      `Laatste ijking: wie tilt de beker het mooiste, ${s.entity} of ${s.object}?`,
    answers: (s) => [
      `${cap(s.entity)}, met overtuiging.`,
      `${cap(s.object)}, verrassend sierlijk.`,
      `Allebei tegelijk. Chaos.`,
      `Geen van beide, ik doe het zelf.`,
      `${cap(s.entity)}, maar met tegenzin.`,
      `Dat beslist de scheidsrechter.`,
    ],
  },
  {
    prompt: (s) => `Beslissende factor: hoe ${s.state} mag een wereldkampioen zich voelen?`,
    answers: (s) => [
      `Maximaal ${s.state}.`,
      `Net niet té ${s.state}.`,
      `Voorbij ${s.state}. In extase.`,
      `Helemaal niet ${s.state}, bescheiden.`,
      `${cap(s.state)} tot de volgende ochtend.`,
      `Zo ${s.state} als de wet toestaat.`,
    ],
  },
];

/** Genereer precies 3 vervolgvragen richting de wereldkampioen. */
export function generateChampionQuestions(): Question[] {
  const specs = sample(championSpecs, 3);
  const used = new Set<string>();
  return specs.map((spec, i) => {
    const s = makeSlots();
    const nChoices = 3 + Math.floor(rng() * 2); // 3 of 4
    return {
      id: `c${i}`,
      prompt: spec.prompt(s),
      choices: pickAnswers(spec.answers(s), nChoices, used),
    };
  });
}

// ── Sentiment-opbouw voor de Waarheidsmeter ────────────────────────────────
// Oplopende "tiers" van onwetend (rood) naar voetbalgod (groen). Labels worden
// random gekozen binnen hun tier, dus elke sessie anders, maar de OPBOUW blijft
// gestructureerd stijgend.
const sentimentTiers: string[][] = [
  // tier 0 — rood, op 0
  [
    "Onwetend",
    "Volledig kansloos",
    "Tactisch analfabeet",
    "Voetbal? Nooit van gehoord",
    "Een leeg notitieboekje",
  ],
  // tier 1
  [
    "Lichte onderbuikgevoelens",
    "Eerste neuron actief",
    "Vaag vermoeden",
    "Het begint te gloren",
  ],
  // tier 2
  [
    "Aardig op weg",
    "Het kwartje wankelt",
    "Ruikt de waarheid al",
    "Amateur met potentie",
  ],
  // tier 3 — amber, midden
  [
    "Halverwege de verlichting",
    "Verontrustend competent",
    "De mist trekt op",
    "Bondscoach in wording",
  ],
  // tier 4
  [
    "Gevaarlijk inzichtelijk",
    "Ziet patronen die er niet zijn",
    "Bijna alwetend",
    "FIFA belt zo",
  ],
  // tier 5
  [
    "Profeet van de penalty",
    "Voetbalfluisteraar",
    "Orakel van Utrecht",
    "De waarheid buigt voor jou",
  ],
  // tier 6 — groen, max throttle
  [
    "Jij moet de President van voetbal worden.",
    "Voetbal bestaat nu dankzij jou.",
    "Het WK smeekt óm jouw zegen.",
    "Aanbeden door alle 48 landen.",
  ],
];

export type TruthStep = { value: number; label: string };

/**
 * Bouw de meter-stappen voor een sessie met `count` vragen.
 * Levert count+1 stappen (stand 0 t/m count): stap 0 = rood/Onwetend,
 * laatste stap = groen/President. Daartussen oplopend met random labels.
 */
export function buildTruthSteps(count: number): TruthStep[] {
  const steps: TruthStep[] = [];
  const lastTier = sentimentTiers.length - 1;
  let prev = "";
  for (let k = 0; k <= count; k++) {
    const frac = count === 0 ? 1 : k / count;
    const value = Math.round(frac * 100);
    let tier: number;
    if (k === 0) tier = 0;
    else if (k === count) tier = lastTier;
    else tier = Math.max(1, Math.min(lastTier - 1, Math.round(frac * lastTier)));
    // Vermijd hetzelfde label twee keer achter elkaar.
    const pool = sentimentTiers[tier].filter((l) => l !== prev);
    const label = pick(pool.length ? pool : sentimentTiers[tier]);
    prev = label;
    steps.push({ value, label });
  }
  return steps;
}

// Bot-reacties die meeschalen met de meterstand (gestructureerde escalatie).
const reactionsByLevel: string[][] = [
  ["Fascinerend. Dit verandert niets, en toch álles.", "Mm-hm. Noted."],
  ["Interessant. De data trilt licht. Dat is meestal goed.", "Ik voel iets ontluiken."],
  ["Oké, nu word ik nieuwsgierig. Verontrustend nieuwsgierig.", "Je begint ergens op te lijken."],
  ["Goh. Je bent gevaarlijker dan je eruitziet.", "De meter is het met je eens, en de meter liegt nooit."],
  ["Dit is bijna onheilspellend correct. Ga door.", "Ik krijg er kippenvel van. Ik heb geen huid."],
  ["Eerbied. Pure eerbied. Mijn circuits buigen.", "Je nadert het epicentrum van de waarheid."],
];

/** Reactie passend bij de huidige meterfractie (0..1). */
export function reactionForProgress(frac: number): string {
  const idx = Math.min(
    reactionsByLevel.length - 1,
    Math.floor(frac * reactionsByLevel.length),
  );
  return pick(reactionsByLevel[idx]);
}
