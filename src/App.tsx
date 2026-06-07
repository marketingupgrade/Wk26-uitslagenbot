import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import Header from "./components/Header";
import ChatMessage from "./components/ChatMessage";
import TypingDots from "./components/TypingDots";
import TeamPicker from "./components/TeamPicker";
import ResultCard from "./components/ResultCard";
import { teams, type Team } from "./data/teams";
import { questions } from "./data/questions";
import { generateResult } from "./lib/generator";

type Step =
  | "boot"
  | "pickHome"
  | "pickAway"
  | "questions"
  | "calculating"
  | "result";

type Msg = { id: string; sender: "bot" | "user"; content: ReactNode };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
let _id = 0;
const uid = () => `m${_id++}`;

const homeReactions = [
  (t: Team) =>
    `${t.name}? Gedurfd. Mijn tante koos ooit hetzelfde en die praat nu alleen nog met planten.`,
  (t: Team) => `Genoteerd: ${t.name}. Ik voel meteen spanning. Of dat is de lunch.`,
  (t: Team) => `${t.name}, oké. Sterke keuze voor iemand met die specifieke energie.`,
];
const awayReactions = [
  (t: Team) =>
    `Tegen ${t.name}? Hmm. De sterren staan ongemakkelijk, maar dat doen ze altijd.`,
  (t: Team) => `${t.name} als tegenstander. Klassiek. Roekeloos. Ik hou ervan.`,
  (t: Team) => `Aha, ${t.name}. Mijn modellen beginnen al stilletjes te huilen.`,
];
const choiceReactions = [
  "Fascinerend. Dit verandert werkelijk niets, en toch álles.",
  "Mm-hm. Precies wat een kampioen zou antwoorden. Of een gevaar.",
  "Ik schrijf dit op met een pen die niet bestaat. Ga door.",
  "Interessant. De data trilt licht. Dat is meestal goed.",
  "Noted. Mijn vertrouwen in de mensheid daalt, mijn voorspelling stijgt.",
];
const calcLines = [
  "Oké. Genoeg onzin. Nu de échte onzin.",
  "Ik raadpleeg de heilige Voorwaarts-archieven van 1907…",
  "Kruisverwijzing met de stand van de maan en jouw lepelvoorkeur…",
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

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
    (async () => {
      await botSay("Goedendag. Ik ben de officiële WK26 Uitslagenbot van v.v. Voorwaarts.", 700);
      await botSay(
        "Ik voorspel WK-uitslagen met een nauwkeurigheid van precies 0%, maar met een zelfvertrouwen van 312%.",
      );
      await botSay(
        "Eerst de formaliteiten, dan een reeks zeer belangrijke en volledig onbelangrijke vragen. Daarna: de waarheid.",
      );
      await botSay("Kies de THUISPLOEG. Denk goed na. Of niet. Maakt niet uit.");
      setStep("pickHome");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePickHome(t: Team) {
    setHome(t);
    addUser(
      <span>
        {t.flag} {t.name}
      </span>,
    );
    setStep("boot");
    await botSay(pick(homeReactions)(t));
    await botSay("En nu de UITPLOEG. De tegenstander. Het lijdend voorwerp.");
    setStep("pickAway");
  }

  async function handlePickAway(t: Team) {
    setAway(t);
    addUser(
      <span>
        {t.flag} {t.name}
      </span>,
    );
    setStep("boot");
    await botSay(pick(awayReactions)(t));
    await botSay(
      "Mooi. Nu de vragenronde. Geen enkele vraag gaat over voetbal. Vertrouw het proces.",
    );
    setQIndex(0);
    await askQuestion(0);
  }

  async function askQuestion(i: number) {
    setStep("boot");
    await botSay(`Vraag ${i + 1}/${questions.length}. ${questions[i].prompt}`);
    setStep("questions");
  }

  async function handleChoice(label: string, vibe: string) {
    const q = questions[qIndex];
    addUser(label);
    const nextAnswers = { ...answers, [q.id]: vibe };
    setAnswers(nextAnswers);
    setStep("boot");
    await botSay(pick(choiceReactions), 650);

    const next = qIndex + 1;
    if (next < questions.length) {
      setQIndex(next);
      await askQuestion(next);
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
    setAnswers({});
    setQIndex(0);
    setStep("boot");
    await botSay("Daar zijn we weer. Nog steeds 0% nauwkeurig. Kies de THUISPLOEG.", 500);
    setStep("pickHome");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative", zIndex: 1 }}>
      <Header />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Chat kolom (volledige breedte) */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
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
                home={home}
                away={away}
                qIndex={qIndex}
                onPickHome={handlePickHome}
                onPickAway={handlePickAway}
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
  home,
  away,
  qIndex,
  onPickHome,
  onPickAway,
  onChoice,
  onRestart,
}: {
  step: Step;
  home: Team | null;
  away: Team | null;
  qIndex: number;
  onPickHome: (t: Team) => void;
  onPickAway: (t: Team) => void;
  onChoice: (label: string, vibe: string) => void;
  onRestart: () => void;
}) {
  if (step === "pickHome")
    return <TeamPicker teams={teams} exclude={away} onPick={onPickHome} />;
  if (step === "pickAway")
    return <TeamPicker teams={teams} exclude={home} onPick={onPickAway} />;
  if (step === "questions") {
    const q = questions[qIndex];
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
