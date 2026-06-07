// WK26 — het volledige FIFA-speelschema (104 wedstrijden), hardcoded.
// Bron: speelschema FIFA WK 2026, bekendgemaakt op 6 december.
// Alle begintijden zijn Nederlandse tijd. Ploegnamen sluiten aan op
// src/data/teams.ts; knock-out-ploegen zijn placeholders ("Winnaar Poule A").

export type ScheduledMatch = {
  date: string; // bv. "11 juni"
  time: string; // bv. "21:00"
  home: string;
  away: string;
  location: string;
  code?: string; // FIFA-wedstrijdnummer waar bekend, bv. "#73"
};

export type Round = {
  name: string;
  matches: ScheduledMatch[];
};

export const schedule: Round[] = [
  {
    name: "Poule A",
    matches: [
      { date: "11 juni", time: "21:00", home: "Mexico", away: "Zuid-Afrika", location: "Mexico-Stad" },
      { date: "12 juni", time: "04:00", home: "Zuid-Korea", away: "Tsjechië", location: "Guadalajara" },
      { date: "18 juni", time: "18:00", home: "Tsjechië", away: "Zuid-Afrika", location: "Atlanta" },
      { date: "19 juni", time: "03:00", home: "Mexico", away: "Zuid-Korea", location: "Guadalajara" },
      { date: "25 juni", time: "03:00", home: "Tsjechië", away: "Mexico", location: "Mexico-Stad" },
      { date: "25 juni", time: "03:00", home: "Zuid-Afrika", away: "Zuid-Korea", location: "Monterrey" },
    ],
  },
  {
    name: "Poule B",
    matches: [
      { date: "12 juni", time: "21:00", home: "Canada", away: "Bosnië & Herzegovina", location: "Toronto" },
      { date: "13 juni", time: "21:00", home: "Qatar", away: "Zwitserland", location: "San Francisco" },
      { date: "18 juni", time: "21:00", home: "Zwitserland", away: "Bosnië & Herzegovina", location: "Los Angeles" },
      { date: "19 juni", time: "00:00", home: "Canada", away: "Qatar", location: "Vancouver" },
      { date: "24 juni", time: "21:00", home: "Zwitserland", away: "Canada", location: "Vancouver" },
      { date: "24 juni", time: "21:00", home: "Bosnië & Herzegovina", away: "Qatar", location: "Seattle" },
    ],
  },
  {
    name: "Poule C",
    matches: [
      { date: "14 juni", time: "00:00", home: "Brazilië", away: "Marokko", location: "New York/New Jersey" },
      { date: "14 juni", time: "03:00", home: "Haïti", away: "Schotland", location: "Boston" },
      { date: "20 juni", time: "00:00", home: "Schotland", away: "Marokko", location: "Boston" },
      { date: "20 juni", time: "02:30", home: "Brazilië", away: "Haïti", location: "Philadelphia" },
      { date: "25 juni", time: "00:00", home: "Schotland", away: "Brazilië", location: "Miami" },
      { date: "25 juni", time: "00:00", home: "Marokko", away: "Haïti", location: "Atlanta" },
    ],
  },
  {
    name: "Poule D",
    matches: [
      { date: "13 juni", time: "03:00", home: "Verenigde Staten", away: "Paraguay", location: "Los Angeles" },
      { date: "13 juni", time: "06:00", home: "Australië", away: "Turkije", location: "Vancouver" },
      { date: "19 juni", time: "06:00", home: "Turkije", away: "Paraguay", location: "San Francisco" },
      { date: "19 juni", time: "21:00", home: "Verenigde Staten", away: "Australië", location: "Seattle" },
      { date: "26 juni", time: "04:00", home: "Turkije", away: "Verenigde Staten", location: "Los Angeles" },
      { date: "26 juni", time: "04:00", home: "Paraguay", away: "Australië", location: "San Francisco" },
    ],
  },
  {
    name: "Poule E",
    matches: [
      { date: "14 juni", time: "19:00", home: "Duitsland", away: "Curaçao", location: "Houston" },
      { date: "15 juni", time: "01:00", home: "Ivoorkust", away: "Ecuador", location: "Philadelphia" },
      { date: "20 juni", time: "22:00", home: "Duitsland", away: "Ivoorkust", location: "Toronto" },
      { date: "21 juni", time: "02:00", home: "Ecuador", away: "Curaçao", location: "Kansas City" },
      { date: "25 juni", time: "22:00", home: "Ecuador", away: "Duitsland", location: "New York/New Jersey" },
      { date: "25 juni", time: "22:00", home: "Curaçao", away: "Ivoorkust", location: "Philadelphia" },
    ],
  },
  {
    name: "Poule F",
    matches: [
      { date: "14 juni", time: "22:00", home: "Nederland", away: "Japan", location: "Dallas" },
      { date: "15 juni", time: "04:00", home: "Zweden", away: "Tunesië", location: "Monterrey" },
      { date: "20 juni", time: "06:00", home: "Tunesië", away: "Japan", location: "Monterrey" },
      { date: "20 juni", time: "19:00", home: "Nederland", away: "Zweden", location: "Houston" },
      { date: "26 juni", time: "01:00", home: "Japan", away: "Zweden", location: "Dallas" },
      { date: "26 juni", time: "01:00", home: "Tunesië", away: "Nederland", location: "Kansas City" },
    ],
  },
  {
    name: "Poule G",
    matches: [
      { date: "15 juni", time: "21:00", home: "België", away: "Egypte", location: "Seattle" },
      { date: "16 juni", time: "03:00", home: "Iran", away: "Nieuw-Zeeland", location: "Los Angeles" },
      { date: "21 juni", time: "21:00", home: "België", away: "Iran", location: "Los Angeles" },
      { date: "22 juni", time: "03:00", home: "Nieuw-Zeeland", away: "Egypte", location: "Vancouver" },
      { date: "27 juni", time: "05:00", home: "Egypte", away: "Iran", location: "Seattle" },
      { date: "27 juni", time: "05:00", home: "Nieuw-Zeeland", away: "België", location: "Vancouver" },
    ],
  },
  {
    name: "Poule H",
    matches: [
      { date: "15 juni", time: "18:00", home: "Spanje", away: "Kaapverdië", location: "Atlanta" },
      { date: "16 juni", time: "00:00", home: "Saoedi-Arabië", away: "Uruguay", location: "Miami" },
      { date: "21 juni", time: "18:00", home: "Spanje", away: "Saoedi-Arabië", location: "Atlanta" },
      { date: "22 juni", time: "00:00", home: "Uruguay", away: "Kaapverdië", location: "Miami" },
      { date: "27 juni", time: "02:00", home: "Kaapverdië", away: "Saoedi-Arabië", location: "Houston" },
      { date: "27 juni", time: "02:00", home: "Uruguay", away: "Spanje", location: "Guadalajara" },
    ],
  },
  {
    name: "Poule I",
    matches: [
      { date: "16 juni", time: "21:00", home: "Frankrijk", away: "Senegal", location: "New York/New Jersey" },
      { date: "17 juni", time: "00:00", home: "Irak", away: "Noorwegen", location: "Boston" },
      { date: "22 juni", time: "23:00", home: "Frankrijk", away: "Irak", location: "Philadelphia" },
      { date: "23 juni", time: "02:00", home: "Noorwegen", away: "Senegal", location: "New York/New Jersey" },
      { date: "26 juni", time: "21:00", home: "Noorwegen", away: "Frankrijk", location: "Boston" },
      { date: "26 juni", time: "21:00", home: "Senegal", away: "Irak", location: "Toronto" },
    ],
  },
  {
    name: "Poule J",
    matches: [
      { date: "16 juni", time: "06:00", home: "Oostenrijk", away: "Jordanië", location: "San Francisco" },
      { date: "17 juni", time: "03:00", home: "Argentinië", away: "Algerije", location: "Kansas City" },
      { date: "22 juni", time: "19:00", home: "Argentinië", away: "Oostenrijk", location: "Dallas" },
      { date: "23 juni", time: "05:00", home: "Jordanië", away: "Algerije", location: "San Francisco" },
      { date: "28 juni", time: "04:00", home: "Algerije", away: "Oostenrijk", location: "Kansas City" },
      { date: "28 juni", time: "04:00", home: "Jordanië", away: "Argentinië", location: "Dallas" },
    ],
  },
  {
    name: "Poule K",
    matches: [
      { date: "17 juni", time: "19:00", home: "Portugal", away: "Congo DR", location: "Houston" },
      { date: "18 juni", time: "04:00", home: "Oezbekistan", away: "Colombia", location: "Mexico-Stad" },
      { date: "23 juni", time: "19:00", home: "Portugal", away: "Oezbekistan", location: "Houston" },
      { date: "24 juni", time: "04:00", home: "Colombia", away: "Congo DR", location: "Guadalajara" },
      { date: "28 juni", time: "01:30", home: "Colombia", away: "Portugal", location: "Miami" },
      { date: "28 juni", time: "01:30", home: "Congo DR", away: "Oezbekistan", location: "Atlanta" },
    ],
  },
  {
    name: "Poule L",
    matches: [
      { date: "17 juni", time: "22:00", home: "Engeland", away: "Kroatië", location: "Dallas" },
      { date: "18 juni", time: "01:00", home: "Ghana", away: "Panama", location: "Toronto" },
      { date: "23 juni", time: "22:00", home: "Engeland", away: "Ghana", location: "Boston" },
      { date: "24 juni", time: "01:00", home: "Panama", away: "Kroatië", location: "Toronto" },
      { date: "27 juni", time: "23:00", home: "Panama", away: "Engeland", location: "New York/New Jersey" },
      { date: "27 juni", time: "23:00", home: "Kroatië", away: "Ghana", location: "Philadelphia" },
    ],
  },
  {
    name: "Laatste 32",
    matches: [
      { date: "28 juni", time: "21:00", home: "Nummer 2 Poule A", away: "Nummer 2 Poule B", location: "Los Angeles", code: "#73" },
      { date: "29 juni", time: "19:00", home: "Winnaar Poule C", away: "Nummer 2 Poule F", location: "Houston", code: "#76" },
      { date: "29 juni", time: "22:30", home: "Winnaar Poule E", away: "Nummer 3 Poule A/B/C/D/F", location: "Boston", code: "#74" },
      { date: "30 juni", time: "03:00", home: "Winnaar Poule F", away: "Nummer 2 Poule C", location: "Monterrey", code: "#75" },
      { date: "30 juni", time: "19:00", home: "Nummer 2 Poule E", away: "Nummer 2 Poule I", location: "Dallas", code: "#78" },
      { date: "30 juni", time: "23:00", home: "Winnaar Poule I", away: "Nummer 3 Poule C/D/F/G/H", location: "New York/New Jersey", code: "#77" },
      { date: "1 juli", time: "03:00", home: "Winnaar Poule A", away: "Nummer 3 Poule C/E/F/H/I", location: "Mexico-Stad", code: "#79" },
      { date: "1 juli", time: "18:00", home: "Winnaar Poule L", away: "Nummer 3 Poule E/H/I/J/K", location: "Atlanta", code: "#80" },
      { date: "1 juli", time: "22:00", home: "Winnaar Poule G", away: "Nummer 3 Poule A/E/H/I/J", location: "San Francisco", code: "#82" },
      { date: "2 juli", time: "02:00", home: "Winnaar Poule D", away: "Nummer 3 Poule B/E/F/I/J", location: "Seattle", code: "#81" },
      { date: "2 juli", time: "21:00", home: "Winnaar Poule H", away: "Nummer 2 Poule J", location: "Los Angeles", code: "#84" },
      { date: "3 juli", time: "01:00", home: "Nummer 2 Poule K", away: "Nummer 2 Poule L", location: "Toronto", code: "#83" },
      { date: "3 juli", time: "05:00", home: "Winnaar Poule B", away: "Nummer 3 Poule E/F/G/I/J", location: "Vancouver", code: "#85" },
      { date: "3 juli", time: "20:00", home: "Nummer 2 Poule D", away: "Nummer 2 Poule G", location: "Dallas", code: "#88" },
      { date: "4 juli", time: "00:00", home: "Winnaar Poule J", away: "Nummer 2 Poule H", location: "Miami", code: "#86" },
      { date: "4 juli", time: "03:30", home: "Winnaar Poule K", away: "Nummer 3 Poule D/E/I/J/L", location: "Kansas City", code: "#87" },
    ],
  },
  {
    name: "Laatste 16",
    matches: [
      { date: "4 juli", time: "19:00", home: "Winnaar duel 73", away: "Winnaar duel 75", location: "Houston", code: "#90" },
      { date: "4 juli", time: "23:00", home: "Winnaar duel 74", away: "Winnaar duel 77", location: "Philadelphia", code: "#89" },
      { date: "5 juli", time: "22:00", home: "Winnaar duel 76", away: "Winnaar duel 78", location: "New York/New Jersey", code: "#91" },
      { date: "6 juli", time: "02:00", home: "Winnaar duel 79", away: "Winnaar duel 80", location: "Mexico-Stad", code: "#92" },
      { date: "6 juli", time: "21:00", home: "Winnaar duel 83", away: "Winnaar duel 84", location: "Dallas", code: "#93" },
      { date: "7 juli", time: "02:00", home: "Winnaar duel 81", away: "Winnaar duel 82", location: "Seattle", code: "#94" },
      { date: "7 juli", time: "18:00", home: "Winnaar duel 86", away: "Winnaar duel 88", location: "Atlanta", code: "#95" },
      { date: "7 juli", time: "22:00", home: "Winnaar duel 85", away: "Winnaar duel 87", location: "Vancouver", code: "#96" },
    ],
  },
  {
    name: "Kwartfinale",
    matches: [
      { date: "9 juli", time: "22:00", home: "Winnaar duel 89", away: "Winnaar duel 90", location: "Boston", code: "#97" },
      { date: "10 juli", time: "21:00", home: "Winnaar duel 93", away: "Winnaar duel 94", location: "Los Angeles", code: "#98" },
      { date: "11 juli", time: "23:00", home: "Winnaar duel 91", away: "Winnaar duel 92", location: "Miami", code: "#99" },
      { date: "12 juli", time: "03:00", home: "Winnaar duel 95", away: "Winnaar duel 96", location: "Kansas City", code: "#100" },
    ],
  },
  {
    name: "Halve finale",
    matches: [
      { date: "14 juli", time: "21:00", home: "Winnaar duel 97", away: "Winnaar duel 98", location: "Dallas", code: "#101" },
      { date: "15 juli", time: "21:00", home: "Winnaar duel 99", away: "Winnaar duel 100", location: "Atlanta", code: "#102" },
    ],
  },
  {
    name: "Wedstrijd om 3e/4e plaats",
    matches: [
      { date: "18 juli", time: "23:00", home: "Verliezer duel 101", away: "Verliezer duel 102", location: "Miami", code: "#103" },
    ],
  },
  {
    name: "Finale",
    matches: [
      { date: "19 juli", time: "21:00", home: "Winnaar duel 101", away: "Winnaar duel 102", location: "New York/New Jersey", code: "#104" },
    ],
  },
];
