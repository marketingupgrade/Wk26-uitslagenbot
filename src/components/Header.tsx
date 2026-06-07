import { motion } from "motion/react";
import { useIsMobile } from "../lib/useMediaQuery";

export default function Header() {
  const isMobile = useIsMobile();
  const logo = isMobile ? 36 : 46;
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 10 : 14,
        padding: isMobile ? "11px 14px" : "16px 20px",
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
        width={logo}
        height={logo}
        initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))", flexShrink: 0 }}
      />
      <div style={{ lineHeight: 1.1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: isMobile ? 16 : 18,
            letterSpacing: 0.3,
            color: "var(--white)",
          }}
        >
          WK26 Uitslagenbot
        </div>
        <div
          style={{
            fontSize: isMobile ? 10 : 12,
            color: "var(--green-bright)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          v.v. Voorwaarts · sinds 1907
        </div>
      </div>
      <div style={{ flex: 1 }} />
      {/* Decoratieve badge: alleen op ruimere schermen. */}
      {!isMobile && (
        <span
          style={{
            fontSize: 11,
            padding: "5px 10px",
            borderRadius: 999,
            border: "1px solid var(--line)",
            color: "var(--cream)",
            background: "rgba(22,163,74,0.14)",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          100% wetenschappelijk*
        </span>
      )}
    </header>
  );
}
