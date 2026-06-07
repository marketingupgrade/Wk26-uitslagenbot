import { useState } from "react";
import { motion } from "motion/react";
import { schedule, type ScheduledMatch } from "../data/schedule";
import { resolveTeam, type Team } from "../data/teams";

export type PickedMatch = {
  home: Team;
  away: Team;
  round: string;
  date: string;
  time: string;
  location: string;
  code?: string;
};

export default function MatchPicker({
  onPick,
}: {
  onPick: (m: PickedMatch) => void;
}) {
  // Eerst een ronde kiezen, dan een wedstrijd. Houdt het behapbaar op mobiel.
  const [roundIndex, setRoundIndex] = useState<number | null>(null);

  if (roundIndex === null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 8,
          marginTop: 6,
          maxHeight: "min(46vh, 420px)",
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {schedule.map((r, i) => (
          <motion.button
            key={r.name}
            onClick={() => setRoundIndex(i)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.015 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(22,163,74,0.25)" }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "11px 12px",
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--cream)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {r.name}
          </motion.button>
        ))}
      </motion.div>
    );
  }

  const round = schedule[roundIndex];

  const makePicked = (m: ScheduledMatch): PickedMatch => ({
    home: resolveTeam(m.home),
    away: resolveTeam(m.away),
    round: round.name,
    date: m.date,
    time: m.time,
    location: m.location,
    code: m.code,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginTop: 6 }}
    >
      <button
        onClick={() => setRoundIndex(null)}
        style={{
          marginBottom: 8,
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.04)",
          color: "var(--cream)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        ← {round.name}
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxHeight: "min(40vh, 360px)",
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {round.matches.map((m, i) => {
          const h = resolveTeam(m.home);
          const a = resolveTeam(m.away);
          return (
            <motion.button
              key={`${m.date}-${m.time}-${m.home}-${m.away}`}
              onClick={() => onPick(makePicked(m))}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(22,163,74,0.22)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                padding: "10px 13px",
                borderRadius: 12,
                border: "1px solid var(--line)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--cream)",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 14.5, fontWeight: 700 }}>
                {h.flag} {h.name} — {a.flag} {a.name}
              </span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>
                {m.date} · {m.time} · {m.location}
                {m.code ? ` · ${m.code}` : ""}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
