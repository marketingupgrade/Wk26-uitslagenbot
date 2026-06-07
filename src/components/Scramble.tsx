import { useEffect, useRef, useState, type CSSProperties } from "react";

// Glyphs waarmee nog-niet-onthulde tekst "scrambelt" tijdens het decoderen.
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789!<>-_/\\[]{}=+*^?#%§µ";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function randGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Scramble: onthult `text` karakter-voor-karakter terwijl de rest blijft
 * "decoderen". Het reeds onthulde deel krijgt de normale kleur, het nog
 * scramblende deel licht groen op (Voorwaarts-accent). Spaties/regeleindes
 * blijven behouden zodat de layout niet verspringt.
 */
export function Scramble({
  text,
  style,
  scrambleColor = "var(--green-bright)",
  onDone,
}: {
  text: string;
  style?: CSSProperties;
  scrambleColor?: string;
  onDone?: () => void;
}) {
  const [revealed, setRevealed] = useState(0);
  const [, force] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    if (prefersReducedMotion() || !text) {
      setRevealed(text.length);
      onDone?.();
      return;
    }
    setRevealed(0);
    // Schaal de onthulsnelheid zodat een bericht altijd ~1s decodeert.
    const rate = Math.max(1, text.length / 55);
    let current = 0;
    const id = window.setInterval(() => {
      current = Math.min(text.length, current + rate);
      setRevealed(current);
      force((n) => n + 1); // herteken de scramblende glyphs
      if (current >= text.length) {
        window.clearInterval(id);
        if (!doneRef.current) {
          doneRef.current = true;
          onDone?.();
        }
      }
    }, 26);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const lockedCount = Math.floor(revealed);
  const locked = text.slice(0, lockedCount);
  let scrambling = "";
  for (let i = lockedCount; i < text.length; i++) {
    const ch = text[i];
    scrambling += ch === " " || ch === "\n" ? ch : randGlyph();
  }

  return (
    <span style={style}>
      <span>{locked}</span>
      {scrambling && (
        <span style={{ color: scrambleColor, opacity: 0.85 }}>{scrambling}</span>
      )}
    </span>
  );
}
