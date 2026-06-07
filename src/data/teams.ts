// WK26 (FIFA World Cup 2026, USA/Canada/Mexico) — 48 landen.
// Een ruime selectie deelnemers/kanshebbers. Vlag-emoji voor de sfeer.
export type Team = {
  name: string;
  flag: string;
};

export const teams: Team[] = [
  { name: "Nederland", flag: "🇳🇱" },
  { name: "België", flag: "🇧🇪" },
  { name: "Duitsland", flag: "🇩🇪" },
  { name: "Frankrijk", flag: "🇫🇷" },
  { name: "Engeland", flag: "🏴" },
  { name: "Spanje", flag: "🇪🇸" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Italië", flag: "🇮🇹" },
  { name: "Kroatië", flag: "🇭🇷" },
  { name: "Argentinië", flag: "🇦🇷" },
  { name: "Brazilië", flag: "🇧🇷" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Verenigde Staten", flag: "🇺🇸" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Zuid-Korea", flag: "🇰🇷" },
  { name: "Marokko", flag: "🇲🇦" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Kameroen", flag: "🇨🇲" },
  { name: "Australië", flag: "🇦🇺" },
  { name: "Zwitserland", flag: "🇨🇭" },
  { name: "Denemarken", flag: "🇩🇰" },
  { name: "Polen", flag: "🇵🇱" },
  { name: "Servië", flag: "🇷🇸" },
  { name: "Oostenrijk", flag: "🇦🇹" },
  { name: "Schotland", flag: "🏴" },
  { name: "Noorwegen", flag: "🇳🇴" },
  { name: "Ecuador", flag: "🇪🇨" },
  // Eregast, want het is tenslotte de Voorwaarts-bot:
  { name: "v.v. Voorwaarts", flag: "🟢" },
];
