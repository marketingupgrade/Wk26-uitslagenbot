// WK26 (FIFA World Cup 2026, USA/Canada/Mexico) — alle 48 deelnemers.
// Vlag-emoji voor de sfeer. Namen sluiten exact aan op het speelschema
// (zie src/data/schedule.ts) zodat ploegen netjes resolven.
export type Team = {
  name: string;
  flag: string;
};

export const teams: Team[] = [
  // Poule A
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Zuid-Afrika", flag: "🇿🇦" },
  { name: "Zuid-Korea", flag: "🇰🇷" },
  { name: "Tsjechië", flag: "🇨🇿" },
  // Poule B
  { name: "Canada", flag: "🇨🇦" },
  { name: "Bosnië & Herzegovina", flag: "🇧🇦" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Zwitserland", flag: "🇨🇭" },
  // Poule C
  { name: "Brazilië", flag: "🇧🇷" },
  { name: "Marokko", flag: "🇲🇦" },
  { name: "Haïti", flag: "🇭🇹" },
  { name: "Schotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  // Poule D
  { name: "Verenigde Staten", flag: "🇺🇸" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Australië", flag: "🇦🇺" },
  { name: "Turkije", flag: "🇹🇷" },
  // Poule E
  { name: "Duitsland", flag: "🇩🇪" },
  { name: "Curaçao", flag: "🇨🇼" },
  { name: "Ivoorkust", flag: "🇨🇮" },
  { name: "Ecuador", flag: "🇪🇨" },
  // Poule F
  { name: "Nederland", flag: "🇳🇱" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Zweden", flag: "🇸🇪" },
  { name: "Tunesië", flag: "🇹🇳" },
  // Poule G
  { name: "België", flag: "🇧🇪" },
  { name: "Egypte", flag: "🇪🇬" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Nieuw-Zeeland", flag: "🇳🇿" },
  // Poule H
  { name: "Spanje", flag: "🇪🇸" },
  { name: "Kaapverdië", flag: "🇨🇻" },
  { name: "Saoedi-Arabië", flag: "🇸🇦" },
  { name: "Uruguay", flag: "🇺🇾" },
  // Poule I
  { name: "Frankrijk", flag: "🇫🇷" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Irak", flag: "🇮🇶" },
  { name: "Noorwegen", flag: "🇳🇴" },
  // Poule J
  { name: "Argentinië", flag: "🇦🇷" },
  { name: "Algerije", flag: "🇩🇿" },
  { name: "Oostenrijk", flag: "🇦🇹" },
  { name: "Jordanië", flag: "🇯🇴" },
  // Poule K
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Congo DR", flag: "🇨🇩" },
  { name: "Oezbekistan", flag: "🇺🇿" },
  { name: "Colombia", flag: "🇨🇴" },
  // Poule L
  { name: "Engeland", flag: "🇬🇧" },
  { name: "Kroatië", flag: "🇭🇷" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Panama", flag: "🇵🇦" },
];

const byName = new Map(teams.map((t) => [t.name, t]));

// Resolveer een ploegnaam naar een Team. Onbekende namen (knock-out-
// placeholders zoals "Winnaar Poule A") krijgen een neutrale bekervlag.
export function resolveTeam(name: string): Team {
  return byName.get(name) ?? { name, flag: "🏆" };
}
