import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import Header from "./components/Header";
import ChatMessage from "./components/ChatMessage";
import TypingDots from "./components/TypingDots";
import MatchPicker, { type PickedMatch } from "./components/MatchPicker";
import ResultCard from "./components/ResultCard";
import TruthMeter from "./components/TruthMeter";
import { type Team } from "./data/teams";
import { generateResult } from "./lib/generator";
import {
  generateQuestions,
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
  | "result";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);
  const qsRef = useRef<Question[]>([]); // synchrone toegang in de async-flow

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

  async function restart() {
    setMessages([]);
    setHome(null);
    setAway(null);
    setStep("boot");
    newSession();
    await botSay(
      "Daar zijn we weer. Nog steeds 0% nauwkeurig. Kies een wedstrijd uit het schema.",
      500,
    );
    setStep("pickMatch");
  }

  const showMeter =
    truthSteps.length > 0 &&
    (step === "questions" || step === "calculating" || step === "result");
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
                onPickMatch={handlePickMatch}
                onChoice={handleChoice}
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
  onPickMatch,
  onChoice,
  onRestart,
}: {
  step: Step;
  qIndex: number;
  questions: Question[];
  onPickMatch: (m: PickedMatch) => void;
  onChoice: (label: string, vibe: string) => void;
  onRestart: () => void;
}) {
  if (step === "pickMatch") return <MatchPicker onPick={onPickMatch} />;
  if (step === "questions") {
    const q = questions[qIndex];
    if (!q) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {q.choices.map((c, i) => (
          <motion.button
            key={c.label}
            onClick={() => onChoice(c.label, c.vibe)}
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
        🔁 Nog een volstrekt onbetrouwbare uitslag genereren
      </motion.button>
    );

  // boot / calculating → wachtindicatie
  return (
    <div style={{ fontSize: 13, opacity: 0.55, textAlign: "center", padding: "4px 0" }}>
      {step === "calculating"
        ? "De bot rekent… of doet alsof. Beide."
        : "Even geduld, de bot formuleert iets onverantwoords…"}
    </div>
  );
}
