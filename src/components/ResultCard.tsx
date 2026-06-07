import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";
import type { MatchResult } from "../lib/generator";
import { Scramble } from "./Scramble";

function Counter({ to }: { to: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    const controls = animate(mv, to, {
      duration: 1.1,
      delay: 0.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [to, mv, rounded]);
  return <>{display}</>;
}

export default function ResultCard({ result }: { result: MatchResult }) {
  const { home, away, homeScore, awayScore } = result;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      style={{
        marginTop: 6,
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(22,163,74,0.4)",
        background:
          "linear-gradient(160deg, rgba(8,73,31,0.9), rgba(5,48,21,0.95))",
        boxShadow: "0 18px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Scorebord */}
      <div
        style={{
          padding: "22px 18px",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35), transparent)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "var(--green-bright)",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          Officiële WK26-eindstand
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Side flag={home.flag} name={home.name} />
          <div
            style={{
              fontSize: 46,
              fontWeight: 900,
              fontVariantNumeric: "tabular-nums",
              color: "var(--white)",
              textShadow: "0 4px 18px rgba(22,163,74,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            <Counter to={homeScore} />
            <span style={{ opacity: 0.4, margin: "0 8px" }}>-</span>
            <Counter to={awayScore} />
          </div>
          <Side flag={away.flag} name={away.name} />
        </div>
      </div>

      {/* Onderbouwing */}
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: "var(--cream)",
            opacity: 0.7,
            marginBottom: 10,
          }}
        >
          🧠 Tactische analyse
        </div>
        {result.reasoning.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.25 }}
            style={{
              fontSize: 14.5,
              lineHeight: 1.55,
              color: "var(--cream)",
              marginBottom: 8,
            }}
          >
            <Scramble text={line} />
          </motion.p>
        ))}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 14,
          }}
        >
          <Pill label="Zekerheid" value={`${result.confidence}%`} />
          <Pill label="Man of the Match" value={result.manOfTheMatch} />
        </div>
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.25)",
            border: "1px solid var(--line)",
            fontSize: 13,
            color: "var(--cream)",
          }}
        >
          📊 <strong>Opmerkelijke statistiek:</strong> {result.weirdStat}
        </div>
      </div>
    </motion.div>
  );
}

function Side({ flag, name }: { flag: string; name: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 34 }}>{flag}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--white)" }}>
        {name}
      </span>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "6px 11px",
        borderRadius: 999,
        background: "rgba(22,163,74,0.18)",
        border: "1px solid rgba(22,163,74,0.4)",
        fontSize: 12.5,
        color: "var(--cream)",
      }}
    >
      <span style={{ opacity: 0.7 }}>{label}: </span>
      <strong style={{ color: "var(--white)" }}>{value}</strong>
    </div>
  );
}
