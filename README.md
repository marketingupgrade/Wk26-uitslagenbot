# WK26 Uitslagenbot ⚽🟢

Een **compleet achterlijke** WK26-voetbaluitslagengenerator in de huisstijl van
**v.v. Voorwaarts Utrecht** (groen / zwart / wit).

De bot is chatbot-based: hij stelt per sessie een **random aantal (5–7)
procedureel gegenereerde, hyper-sarcastische en volledig misplaatste vragen**
die niets met voetbal te maken hebben (lepels, lauwe tomatensoep, achteruit
parkerende oma's — niets staat vooraf vast, geen database) en produceert
vervolgens een **volstrekt onrealistische uitslag** met een onderbouwing die
overtuigend klinkt maar nergens op slaat.

Tijdens de vragenronde loopt een **Apache ECharts "Waarheidsmeter"** op: van
rood/0/"Onwetend" naar groen/max/"Jij moet de President van voetbal worden" —
random labels, maar een gestructureerde sentiment-opbouw.

Gebouwd met **React + Vite + [Motion](https://motion.dev)** voor smooth
animaties en **[Apache ECharts](https://echarts.apache.org)** voor de gauge.

## Draaien

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # productiebuild
```

## Structuur

| Pad | Doel |
| --- | --- |
| `src/App.tsx` | Chat-flow / state machine (boot → teams → vragen → berekening → uitslag) |
| `src/data/teams.ts` | 48 WK26-landen (+ Voorwaarts als eregast) |
| `src/lib/questionGen.ts` | Procedurele vragen-generator (woordbanken) + sentiment-opbouw voor de meter |
| `src/lib/generator.ts` | Genereert de onrealistische uitslag + onzin-onderbouwing |
| `src/lib/theme.ts` | Voorwaarts-huisstijlkleuren |
| `src/components/TruthMeter.tsx` | Apache ECharts gauge — "Waarheidsmeter" |
| `src/components/Scramble.tsx` | "Decodeer"-effect: bot-tekst scrambelt en klikt karakter-voor-karakter vast |
| `src/components/` | Header, chatbubbels, teamkiezer, uitslagkaart |

## Uitbreidingspunten

- **Vragen**: voeg templates/woorden toe aan de banken in `src/lib/questionGen.ts`.
- **Meter-labels**: pas `sentimentTiers` aan in `src/lib/questionGen.ts` (oplopend van rood naar groen).
- **Onzin-onderbouwing**: de templates staan in `src/lib/generator.ts`.

\* 100% wetenschappelijk. Nauwkeurigheid: 0%. Zelfvertrouwen: 312%.
