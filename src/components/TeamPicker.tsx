import { motion } from "motion/react";
import type { Team } from "../data/teams";
import { useIsMobile } from "../lib/useMediaQuery";

export default function TeamPicker({
  teams,
  exclude,
  onPick,
}: {
  teams: Team[];
  exclude?: Team | null;
  onPick: (t: Team) => void;
}) {
  const isMobile = useIsMobile();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "repeat(2, 1fr)"
          : "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 8,
        marginTop: 6,
        // Beperk de hoogte zodat de lijst niet buiten de actiezone valt.
        maxHeight: "min(46vh, 420px)",
        overflowY: "auto",
        paddingRight: 4,
      }}
    >
      {teams
        .filter((t) => t.name !== exclude?.name)
        .map((t, i) => (
          <motion.button
            key={t.name}
            onClick={() => onPick(t)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.012 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(22,163,74,0.25)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--cream)",
              fontSize: 14,
              fontWeight: 600,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 18 }}>{t.flag}</span>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {t.name}
            </span>
          </motion.button>
        ))}
    </motion.div>
  );
}
