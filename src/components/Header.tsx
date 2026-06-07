import { motion } from "motion/react";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderBottom: "1px solid var(--line)",
        background: "rgba(5, 48, 21, 0.55)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <motion.img
        src="/voorwaarts-logo.png"
        alt="v.v. Voorwaarts Utrecht"
        width={46}
        height={46}
        initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
      />
      <div style={{ lineHeight: 1.1 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: 0.3,
            color: "var(--white)",
          }}
        >
          WK26 Uitslagenbot
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--green-bright)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          v.v. Voorwaarts · sinds 1907
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <span
        style={{
          fontSize: 11,
          padding: "5px 10px",
          borderRadius: 999,
          border: "1px solid var(--line)",
          color: "var(--cream)",
          background: "rgba(22,163,74,0.14)",
          fontWeight: 600,
        }}
      >
        100% wetenschappelijk*
      </span>
    </header>
  );
}
