// Huisstijl v.v. Voorwaarts Utrecht (sinds 1907)
// Afgeleid van het clublogo: diepgroen veld, zwarte spelersilhouet, witte rand.
export const theme = {
  green: "#0c6b34", // primair Voorwaarts-groen
  greenDark: "#08491f", // donkere variant / achtergrond
  greenDeep: "#053015", // bijna-zwart groen voor diepte
  greenBright: "#16a34a", // accent / highlights
  black: "#0a0d0b",
  ink: "#11140f",
  white: "#ffffff",
  cream: "#f4f7f2",
  line: "rgba(255,255,255,0.12)",
} as const;

export type Theme = typeof theme;
