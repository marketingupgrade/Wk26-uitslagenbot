import { motion } from "motion/react";
import type { ReactNode } from "react";

export type Sender = "bot" | "user";

export default function ChatMessage({
  sender,
  children,
}: {
  sender: Sender;
  children: ReactNode;
}) {
  const isBot = sender === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        gap: 10,
        alignItems: "flex-end",
      }}
    >
      {isBot && (
        <img
          src="/voorwaarts-logo.png"
          alt=""
          width={30}
          height={30}
          style={{ borderRadius: "50%", flexShrink: 0, alignSelf: "flex-end" }}
        />
      )}
      <div
        style={{
          maxWidth: "78%",
          padding: "12px 15px",
          borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          fontSize: 15,
          lineHeight: 1.5,
          background: isBot
            ? "rgba(255,255,255,0.06)"
            : "linear-gradient(135deg, var(--green-bright), var(--green))",
          color: isBot ? "var(--cream)" : "var(--white)",
          border: isBot ? "1px solid var(--line)" : "none",
          boxShadow: isBot
            ? "none"
            : "0 6px 18px rgba(12,107,52,0.45)",
          fontWeight: isBot ? 400 : 600,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
