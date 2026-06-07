import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { activity, type ActivityEvent, type ActivityKind } from "../lib/activity";

const COLORS: Record<ActivityKind, string> = {
  system: "#94a3b8",
  user: "#16a34a",
  bot: "#67e8f9",
  result: "#fde047",
  chaos: "#f472b6",
  custom: "#ffffff",
};

const ICONS: Record<ActivityKind, string> = {
  system: "⚙️",
  user: "🫵",
  bot: "🤖",
  result: "🏆",
  chaos: "🌀",
  custom: "✨",
};

export default function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>(() => activity.history());

  useEffect(() => {
    // Aansluiting op de centrale bus. Jouw latere stream-code kan hier ook op.
    return activity.subscribe((e) => {
      setEvents((prev) => [...prev.slice(-40), e]);
    });
  }, []);

  return (
    <aside
      style={{
        width: 300,
        flexShrink: 0,
        borderLeft: "1px solid var(--line)",
        background: "rgba(5,48,21,0.4)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid var(--line)",
          fontWeight: 800,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: "var(--green-bright)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#f472b6",
            display: "inline-block",
          }}
        />
        Waanzin-meter · live
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {events.length === 0 && (
          <div style={{ fontSize: 13, opacity: 0.5, lineHeight: 1.5 }}>
            Nog geen waanzin geregistreerd. Begin een gesprek met de bot en kijk
            hoe het hier escaleert…
          </div>
        )}
        <AnimatePresence initial={false}>
          {events
            .slice()
            .reverse()
            .map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, x: 24, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 12.5,
                  lineHeight: 1.4,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  borderLeft: `3px solid ${COLORS[e.kind]}`,
                }}
              >
                <span>{ICONS[e.kind]}</span>
                <span style={{ color: "var(--cream)" }}>{e.text}</span>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
