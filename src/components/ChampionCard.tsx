import { motion } from "motion/react";
import type { ChampionResult } from "../lib/champion";
import { Scramble } from "./Scramble";

export default function ChampionCard({ result }: { result: ChampionResult }) {
  const { champion } = result;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      style={{
        marginTop: 6,
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(212,175,55,0.55)",
        background:
          "linear-gradient(160deg, rgba(73,57,8,0.9), rgba(48,33,5,0.95))",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
      }}
    >
      {/* Kampioen-banner */}
      <div
        style={{
          padding: "clamp(18px, 5vw, 26px) clamp(12px, 4vw, 18px)",
          background: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#f3d27a",
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          🏆 Officiële WK26-wereldkampioen
        </div>
        <motion.div
          initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 }}
          style={{ fontSize: "clamp(48px, 16vw, 78px)", lineHeight: 1 }}
        >
          {champion.flag}
        </motion.div>
        <div
          style={{
            fontSize: "clamp(22px, 7vw, 34px)",
            fontWeight: 900,
            color: "var(--white)",
            textShadow: "0 4px 18px rgba(212,175,55,0.5)",
            marginTop: 8,
          }}
        >
          {champion.name}
        </div>
      </div>

      {/* Toernooistatistieken */}
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: "var(--cream)",
            opacity: 0.7,
            marginBottom: 12,
          }}
        >
          📈 Datagedreven realiteit
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <Stat label="Gespeeld" value={`${result.played}`} />
          <Stat label="W-G-V" value={`${result.won}-${result.drawn}-${result.lost}`} />
          <Stat
            label="Doelsaldo"
            value={`${result.goalsFor}:${result.goalsAgainst}`}
          />
          <Stat label="Balbezit" value={`${result.possession}%`} />
          <Stat label="xG totaal" value={`${result.xg}`} />
          <Stat
            label="Topscorer"
            value={`${result.topScorer.goals}× ${result.topScorer.name}`}
          />
        </div>

        {result.fabricatedStats.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            style={{
              fontSize: 13.5,
              lineHeight: 1.5,
              color: "var(--cream)",
              marginBottom: 6,
            }}
          >
            • <Scramble text={line} />
          </motion.p>
        ))}

        <div
          style={{
            marginTop: 12,
            padding: "11px 13px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.28)",
            border: "1px solid rgba(212,175,55,0.35)",
            fontSize: 14,
            color: "var(--cream)",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#f3d27a" }}>Eindoordeel:</strong>{" "}
          {result.verdict} {result.finalLine}
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "9px 10px",
        borderRadius: 12,
        background: "rgba(212,175,55,0.12)",
        border: "1px solid rgba(212,175,55,0.3)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.7, color: "var(--cream)" }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--white)", marginTop: 2 }}>
        {value}
      </div>
    </div>
  );
}
