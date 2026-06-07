import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import Header from "./components/Header";
import ChatMessage from "./components/ChatMessage";
import TypingDots from "./components/TypingDots";
import MatchPicker, { type PickedMatch } from "./components/MatchPicker";
import ResultCard from "./components/ResultCard";
import ChampionCard from "./components/ChampionCard";
import TruthMeter from "./components/TruthMeter";
import { type Team } from "./data/teams";
import { generateResult } from "./lib/generator";
import { generateChampion } from "./lib/champion";
import {
  generateQuestions,
  generateChampionQuestions,
  randomQuestionCount,
  buildTruthSteps,
  reactionForProgress,
  type Question,
  type TruthStep,
} from "./lib/questionGen";

type Step =
  | "boot"
  | "pickMatch"
  | "questions"
  | "calculating"
  | "result"
  | "champQuestions"
  | "champCalc"
  | "champResult";

type Msg = { id: string; sender: "bot" | "user"; content: ReactNode };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
let _id = 0;
const uid = () => `m${_id++}`;

const matchReactions = [
  (m: PickedMatch) =>
    `${m.home.name} - ${m.away.name}, ${m.date} in ${m.location}. Gedurfde keuze uit het officiële schema. Mijn tante koos ooit hetzelfde duel en die praat nu alleen nog met planten.`,
  (m: PickedMatch) =>
    `Genoteerd: ${m.home.name} - ${m.away.name} (${m.round}). Ik voel meteen spanning. Of dat is de lunch.`,
  (m: PickedMatch) =>
    `Aha, ${m.home.name} - ${m.away.name} om ${m.time}. Klassiek. Roekeloos. Mijn modellen beginnen al stilletjes te huilen.`,
];
const calcLines = [
  "Oké. Genoeg onzin. Nu de échte onzin.",
  "Ik raadpleeg de heilige Voorwaarts-archieven van 1907…",
  "Kruisverwijzing met de stand van de maan en jouw antwoorden…",
  "Negeren van alle bestaande voetbalkennis… klaar.",
  "Berekening voltooid. Je gaat dit niet leuk vinden. Ik wel.",
];
const champCalcLines = [
  "Doorrekenen naar de eindzege… alle 104 duels simuleren in 0,0 seconden.",
  "Ik gooi de poule-indeling, de logica en een dobbelsteen in één blender…",
  "Verzin nu een doelsaldo dat nergens op slaat maar prachtig oogt…",
  "De wereldkampioen is bepaald. Volstrekt willekeurig. Volledig definitief.",
];

export default function App() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("boot");
  const [home, setHome] = useState<Team | null>(null);
  const [away, setAway] = useState<Team | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [truthSteps, setTruthSteps] = useState<TruthStep[]>([]);
  const [meterStep, setMeterStep] = useState(0); // aantal beantwoorde vragen
  const [champQuestions, setChampQuestions] = useState<Question[]>([]);
  const [champIndex, setChampIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);
  const qsRef = useRef<Question[]>([]); // synchrone toegang in de async-flow
  const champQsRef = useRef<Question[]>([]);

  const addBot = (content: ReactNode) =>
    setMessages((m) => [...m, { id: uid(), sender: "bot", content }]);
  const addUser = (content: ReactNode) =>
    setMessages((m) => [...m, { id: uid(), sender: "user", content }]);

  async function botSay(content: ReactNode, delay = 850) {
    setTyping(true);
    await wait(delay);
    setTyping(false);
    addBot(content);
  }

  // Genereer een verse sessie: random aantal vragen (5–7) + meter-opbouw.
  function newSession(): Question[] {
    const n = randomQuestionCount();
    const qs = generateQuestions(n);
    qsRef.current = qs;
    setSessionQuestions(qs);
    setTruthSteps(buildTruthSteps(n));
    setMeterStep(0);
    setQIndex(0);
    setAnswers({});
    return qs;
  }

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  // Opening
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    newSession();
    (async () => {
      await botSay("Goedendag. Ik ben de officiële WK26 Uitslagenbot van v.v. Voorwaarts.", 700);
      await botSay(
        "Ik voorspel WK-uitslagen met een nauwkeurigheid van precies 0%, maar met een zelfvertrouwen van 312%.",
      );
      await botSay(
        "Eerst de formaliteiten, dan een reeks zeer belangrijke en volledig onbelangrijke vragen. Daarna: de waarheid.",
      );
      await botSay(
        "Kies een WEDSTRIJD uit het officiële WK26-speelschema. Eerst een ronde, dan het duel. Denk goed na. Of niet. Maakt niet uit.",
      );
      setStep("pickMatch");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePickMatch(m: PickedMatch) {
    setHome(m.home);
    setAway(m.away);
    addUser(
      <span>
        {m.home.flag} {m.home.name} — {m.away.flag} {m.away.name}
        <span style={{ opacity: 0.6, fontSize: 12 }}>
          {" "}
          ({m.date} · {m.time} · {m.location})
        </span>
      </span>,
    );
    setStep("boot");
    await botSay(pick(matchReactions)(m));
    await botSay(
      `Mooi. Nu ${qsRef.current.length} zeer belangrijke vragen die nergens over gaan. Vertrouw het proces.`,
    );
    setQIndex(0);
    await askQuestion(0);
  }

  async function askQuestion(i: number) {
    const qs = qsRef.current;
    setStep("boot");
    await botSay(`Vraag ${i + 1}/${qs.length}. ${qs[i].prompt}`);
    setStep("questions");
  }

  async function handleChoice(label: string, vibe: string) {
    const qs = qsRef.current;
    const q = qs[qIndex];
    addUser(label);
    const nextAnswers = { ...answers, [q.id]: vibe };
    setAnswers(nextAnswers);

    // Waarheidsmeter een stap omhoog.
    const answered = qIndex + 1;
    setMeterStep(answered);
    setStep("boot");
    await botSay(reactionForProgress(answered / qs.length), 650);

    if (answered < qs.length) {
      setQIndex(answered);
      await askQuestion(answered);
    } else {
      await runCalculation(nextAnswers);
    }
  }

  async function runCalculation(finalAnswers: Record<string, string>) {
    setStep("calculating");
    for (const line of calcLines) {
      await botSay(line, 700);
    }
    const result = generateResult(home!, away!, finalAnswers);
    setTyping(true);
    await wait(900);
    setTyping(false);
    addBot(<ResultCard result={result} />);
    setStep("result");
  }

  // ── Vervolg: doorrekenen naar de wereldkampioen ───────────────────────────
  async function startChampion() {
    const qs = generateChampionQuestions();
    champQsRef.current = qs;
    setChampQuestions(qs);
    setChampIndex(0);
    setStep("boot");
    await botSay(
      "Uitstekend. Maar één duel is kinderspel. Laten we dóórrekenen naar de absolute eindzege: de wereldkampioen.",
    );
    await botSay("Nog 3 beslissende vragen. Het hele toernooi hangt ervan af. Niet echt, maar toch.");
    await askChampQuestion(0);
  }

  async function askChampQuestion(i: number) {
    const qs = champQsRef.current;
    setStep("boot");
    await botSay(qs[i].prompt);
    setChampIndex(i);
    setStep("champQuestions");
  }

  async function handleChampChoice(label: string, vibe: string) {
    const qs = champQsRef.current;
    const q = qs[champIndex];
    addUser(label);
    const next = { ...answers, [q.id]: vibe };
    setAnswers(next);
    const answered = champIndex + 1;
    setStep("boot");
    await botSay(reactionForProgress(answered / qs.length), 600);
    if (answered < qs.length) {
      await askChampQuestion(answered);
    } else {
      await runChampionCalc(next);
    }
  }

  async function runChampionCalc(finalAnswers: Record<string, string>) {
    setStep("champCalc");
    for (const line of champCalcLines) {
      await botSay(line, 700);
    }
    const champ = generateChampion(finalAnswers);
    setTyping(true);
    await wait(900);
    setTyping(false);
    addBot(<ChampionCard result={champ} />);
    setStep("champResult");
  }

  async function restart() {
    setMessages([]);
    setHome(null);
    setAway(null);
    setStep("boot");
    setChampQuestions([]);
    setChampIndex(0);
    champQsRef.current = [];
    newSession();
    await botSay(
      "Daar zijn we weer. Nog steeds 0% nauwkeurig. Kies een wedstrijd uit het schema.",
      500,
    );
    setStep("pickMatch");
  }

  const showMeter =
    truthSteps.length > 0 &&
    (step === "questions" ||
      step === "calculating" ||
      step === "result" ||
      step === "champQuestions" ||
      step === "champCalc" ||
      step === "champResult");
  const meter = truthSteps[Math.min(meterStep, truthSteps.length - 1)];

  return (
    <div
      className="app-shell"
      style={{ display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}
    >
      <Header />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Chat kolom (volledige breedte) */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <AnimatePresence>
            {showMeter && meter && (
              <TruthMeter value={meter.value} label={meter.label} />
            )}
          </AnimatePresence>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "22px clamp(14px, 6vw, 80px)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ maxWidth: 760, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <ChatMessage key={m.id} sender={m.sender}>
                    {m.content}
                  </ChatMessage>
                ))}
              </AnimatePresence>
              {typing && (
                <ChatMessage sender="bot">
                  <TypingDots />
                </ChatMessage>
              )}
            </div>
          </div>

          {/* Invoer / actiezone */}
          <div
            style={{
              borderTop: "1px solid var(--line)",
              background: "rgba(5,48,21,0.5)",
              backdropFilter: "blur(8px)",
              padding: "14px clamp(14px, 6vw, 80px)",
            }}
          >
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <InputZone
                step={step}
                qIndex={qIndex}
                questions={sessionQuestions}
                champIndex={champIndex}
                champQuestions={champQuestions}
                onPickMatch={handlePickMatch}
                onChoice={handleChoice}
                onChampChoice={handleChampChoice}
                onStartChampion={startChampion}
                onRestart={restart}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function InputZone({
  step,
  qIndex,
  questions,
  champIndex,
  champQuestions,
  onPickMatch,
  onChoice,
  onChampChoice,
  onStartChampion,
  onRestart,
}: {
  step: Step;
  qIndex: number;
  questions: Question[];
  champIndex: number;
  champQuestions: Question[];
  onPickMatch: (m: PickedMatch) => void;
  onChoice: (label: string, vibe: string) => void;
  onChampChoice: (label: string, vibe: string) => void;
  onStartChampion: () => void;
  onRestart: () => void;
}) {
  if (step === "pickMatch") return <MatchPicker onPick={onPickMatch} />;

  if (step === "questions" || step === "champQuestions") {
    const isChamp = step === "champQuestions";
    const q = isChamp ? champQuestions[champIndex] : questions[qIndex];
    if (!q) return null;
    const handle = isChamp ? onChampChoice : onChoice;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {q.choices.map((c, i) => (
          <motion.button
            key={c.label}
            onClick={() => handle(c.label, c.vibe)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.04, backgroundColor: "rgba(22,163,74,0.3)" }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "11px 16px",
              borderRadius: 999,
              border: "1px solid rgba(22,163,74,0.45)",
              background: "rgba(22,163,74,0.14)",
              color: "var(--cream)",
              fontSize: 14.5,
              fontWeight: 600,
            }}
          >
            {c.label}
          </motion.button>
        ))}
      </div>
    );
  }

  if (step === "result")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <motion.button
          onClick={onStartChampion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #e9c45a, #b8860b)",
            color: "#241a00",
            fontWeight: 800,
            fontSize: 15,
            boxShadow: "0 8px 22px rgba(184,134,11,0.5)",
          }}
        >
          🏆 Reken door naar de wereldkampioen (3 vragen)
        </motion.button>
        <motion.button
          onClick={onRestart}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: 12,
            background: "rgba(22,163,74,0.18)",
            border: "1px solid rgba(22,163,74,0.45)",
            color: "var(--cream)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          🔁 Andere wedstrijd
        </motion.button>
      </div>
    );

  if (step === "champResult")
    return (
      <motion.button
        onClick={onRestart}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 12,
          background: "linear-gradient(135deg, var(--green-bright), var(--green))",
          color: "white",
          fontWeight: 800,
          fontSize: 15,
          boxShadow: "0 8px 22px rgba(12,107,52,0.5)",
        }}
      >
        🔁 Nog een volstrekt onbetrouwbare voorspelling
      </motion.button>
    );

  // boot / calculating / champCalc → wachtindicatie
  return (
    <div style={{ fontSize: 13, opacity: 0.55, textAlign: "center", padding: "4px 0" }}>
      {step === "calculating" || step === "champCalc"
        ? "De bot rekent… of doet alsof. Beide."
        : "Even geduld, de bot formuleert iets onverantwoords…"}
    </div>
  );
}
