// ────────────────────────────────────────────────────────────────────────────
//  Procedurele vragen-generator.
//  Geen vaste vragenlijst, geen database: elke sessie worden 5–7 hyper-
//  sarcastische, volstrekt niet-voetbal vragen samengesteld uit woordbanken.
//  Daarnaast: een gestructureerde sentiment-opbouw voor de Waarheidsmeter.
// ────────────────────────────────────────────────────────────────────────────

export type Choice = { label: string; vibe: string };
export type Question = { id: string; prompt: string; choices: Choice[] };

const rng = () => Math.random();
const pick = <T,>(a: T[]): T => a[Math.floor(rng() * a.length)];

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

// Templates met slots. {object} {entity} {state} {scaleA} {scaleB}
const templates: ((p: {
  object: string;
  entity: string;
  state: string;
  scaleA: string;
  scaleB: string;
}) => string)[] = [
  (p) => `Op een schaal van ${p.scaleA} tot ${p.scaleB}: hoe ${p.state} voel jij je vandaag?`,
  (p) => `Diep ademhalen. Dit bepaalt alles. Wat zou jij doen met ${p.object}?`,
  (p) => `Snel, niet nadenken: welke relatie heb jij precies met ${p.object}?`,
  (p) => `Stel: ${p.entity} kijkt jou recht aan en fluistert iets over ${p.object}. Wat fluistert ${p.entity}?`,
  (p) => `Cruciale kwalificatievraag: hoe ${p.state} is ${p.object} volgens jou, héél eerlijk?`,
  (p) => `Als ${p.entity} een ringtone had die afging tijdens ${p.object}, hoe erg is dat dan?`,
  (p) => `Belangrijk en volledig onbelangrijk: hoeveel vertrouwen heb jij in ${p.object}?`,
  (p) => `Eén vraag, het hele WK hangt ervan af: wat zegt ${p.object} over jou als mens?`,
  (p) => `Hoe verhoudt jouw ochtendhumeur zich tot ${p.object}?`,
  (p) => `Op welke precieze manier heeft ${p.object} jou ooit teleurgesteld?`,
  (p) => `Als jij ${p.entity} was, zou je dan anders omgaan met ${p.object}?`,
];

// ── Procedurele antwoorden ──────────────────────────────────────────────────
// Net als de vragen worden de antwoordopties élke keer vers samengesteld uit
// woordbanken — geen vaste lijst. Elke keuze draagt een willekeurig opgebouwde
// 'vibe' mee die de uitslag-onderbouwing voedt.
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const whens = [
  "op dinsdag",
  "tijdens volle maan",
  "voor de koffie",
  "na het toetje",
  "in even jaren",
  "als het motregent",
  "buiten het seizoen",
  "tussen 14:00 en 14:03",
];

const intensities = [
  "beangstigende",
  "milde",
  "onredelijke",
  "klinische",
  "verontrustende",
  "spirituele",
  "kosmische",
  "wetenschappelijk bewezen",
];

const numberWords = ["drie", "zeven", "elf", "nul", "veertien", "honderd", "vier"];
const digits = ["3", "7", "9", "4", "11"];

const vibeAdjs = [
  "voorwaardelijk",
  "ijskoud",
  "autoritair",
  "clandestien",
  "erfelijk",
  "structureel",
  "spiritueel",
  "fatalistisch",
  "numerologisch",
  "thermisch",
  "juridisch",
  "ongeneeslijk",
  "dreigend",
  "transparant",
  "veerkrachtig",
  "ongebonden",
  "psychologisch",
  "mythisch",
];

const vibeNouns = [
  "dominant",
  "briljant",
  "kalm",
  "chaotisch",
  "toegewijd",
  "explosief",
  "helder",
  "twijfelend",
  "grandioos",
  "paniekerig",
  "ambitieus",
  "onverstoorbaar",
];

type Slots = {
  object: string;
  entity: string;
  state: string;
  when: string;
  intensity: string;
  number: string;
  digit: string;
};

const answerTemplates: ((p: Slots) => string)[] = [
  (p) => `Ja, maar alleen ${p.when}.`,
  (p) => `Nee. En dat weet ${p.entity}.`,
  (p) => `${cap(p.state)} gezien een ${p.digit}.`,
  (p) => `Met ${p.intensity} zekerheid.`,
  (p) => `Alleen als ${p.entity} niet kijkt.`,
  (p) => `Dat heeft ${p.entity} ook geprobeerd.`,
  (p) => `${cap(p.number)}. Altijd ${p.number}.`,
  (p) => `Ik woon nu in ${p.object}.`,
  (p) => `${cap(p.object)}, zoals een sukkel.`,
  (p) => `Stilte, maar ${p.intensity}.`,
  (p) => `Tegenrennen tot ${p.object} opgeeft.`,
  (p) => `Oneindig veel. Ik aanbid ${p.object}.`,
  (p) => `${cap(p.number)} pogingen en een gebed.`,
  (p) => `Zoals ${p.entity} ${p.when}.`,
  (p) => `Liever ${p.object} dan deze vraag.`,
  (p) => `${cap(p.intensity)} ja. Definitief.`,
  (p) => `Vraag dat maar aan ${p.entity}.`,
  (p) => `${cap(p.state)}, en daar blijf ik bij.`,
];

function answerSlots(): Slots {
  return {
    object: pick(objects),
    entity: pick(entities),
    state: pick(states),
    when: pick(whens),
    intensity: pick(intensities),
    number: pick(numberWords),
    digit: pick(digits),
  };
}

/** Genereer `n` verse, willekeurige antwoordopties met opgebouwde vibe. */
export function generateChoices(n: number): Choice[] {
  const tpls = sample(answerTemplates, Math.min(n, answerTemplates.length));
  while (tpls.length < n) tpls.push(pick(answerTemplates));
  const seen = new Set<string>();
  const out: Choice[] = [];
  for (const tpl of tpls) {
    let label = tpl(answerSlots());
    let guard = 0;
    while (seen.has(label) && guard++ < 6) label = tpl(answerSlots());
    seen.add(label);
    out.push({ label, vibe: `${pick(vibeAdjs)} ${pick(vibeNouns)}` });
  }
  return out;
}

/** Aantal vragen voor deze sessie: willekeurig 5–7. */
export function randomQuestionCount(): number {
  return 5 + Math.floor(rng() * 3); // 5, 6 of 7
}

/** Genereer `count` unieke procedurele vragen. */
export function generateQuestions(count: number): Question[] {
  const tpls = sample(templates, Math.min(count, templates.length));
  // Als count > aantal templates, vul aan met willekeurige templates.
  while (tpls.length < count) tpls.push(pick(templates));

  return tpls.map((tpl, i) => {
    const prompt = tpl({
      object: pick(objects),
      entity: pick(entities),
      state: pick(states),
      scaleA: pick(scaleLow),
      scaleB: pick(scaleHigh),
    });
    const nChoices = 3 + Math.floor(rng() * 2); // 3 of 4
    return {
      id: `q${i}`,
      prompt,
      choices: generateChoices(nChoices),
    };
  });
}

// ── Vervolgvragen richting de wereldkampioen ───────────────────────────────
// Drie extra vragen die "doorrekenen" naar de eindzege. Klinken episch,
// betekenen exact even veel als de rest: niets.
const championTemplates: ((p: {
  object: string;
  entity: string;
  state: string;
}) => string)[] = [
  (p) => `Finalevraag 1/3: welke ploeg verdient de wereldtitel volgens ${p.object}?`,
  (p) => `Finalevraag 2/3: als de beker kon praten, hoe ${p.state} zou hij zijn over ${p.object}?`,
  (p) => `Finalevraag 3/3: ${p.entity} houdt de cup omhoog. Wat schreeuwt het stadion?`,
  (p) => `Doorrekenend naar de eindzege: hoeveel weegt ${p.object} in jouw kampioensformule?`,
  (p) => `Laatste ijking: wie tilt de beker het mooiste, ${p.entity} of ${p.object}?`,
  (p) => `Beslissende factor: hoe ${p.state} mag een wereldkampioen zich voelen?`,
];

/** Genereer precies 3 vervolgvragen richting de wereldkampioen. */
export function generateChampionQuestions(): Question[] {
  const tpls = sample(championTemplates, 3);
  return tpls.map((tpl, i) => {
    const prompt = tpl({
      object: pick(objects),
      entity: pick(entities),
      state: pick(states),
    });
    const nChoices = 3 + Math.floor(rng() * 2); // 3 of 4
    return {
      id: `c${i}`,
      prompt,
      choices: generateChoices(nChoices),
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
