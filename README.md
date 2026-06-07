# WK26 Uitslagenbot ⚽🟢

Een **compleet achterlijke** WK26-voetbaluitslagengenerator in de huisstijl van
**v.v. Voorwaarts Utrecht** (groen / zwart / wit).

De bot is chatbot-based: hij stelt eerst een reeks **hyper-sarcastische en
volledig misplaatste vragen** die niets met voetbal te maken hebben (lepels,
wolken, achteruit parkerende oma's) en produceert vervolgens een **volstrekt
onrealistische uitslag** met een onderbouwing die overtuigend klinkt maar
nergens op slaat.

Gebouwd met **React + Vite + [Motion](https://motion.dev)** voor super smooth
animaties.

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
| `src/data/questions.ts` | De absurde, niet-voetbal vragen |
| `src/lib/generator.ts` | Genereert de onrealistische uitslag + onzin-onderbouwing |
| `src/lib/activity.ts` | **Event-bus** — hier plug je later de live user-activity / "de bit" op aan |
| `src/lib/theme.ts` | Voorwaarts-huisstijlkleuren |
| `src/components/Scramble.tsx` | "Decodeer"-effect: bot-tekst scrambelt en klikt karakter-voor-karakter vast |
| `src/components/` | Header, chatbubbels, teamkiezer, uitslagkaart, waanzin-meter |

## Uitbreidingspunten (voor jouw latere code)

- **`src/lib/activity.ts`** — losgekoppelde event-bus. Roep `activity.push({ kind, text })`
  aan om gebeurtenissen te tonen, of `activity.subscribe(fn)` om ze naar een
  backend / websocket te streamen. De `ActivityFeed` ("Waanzin-meter") rendert
  alles automatisch.
- **De vragen** staan los in `src/data/questions.ts`, de **onzin-templates** in
  `src/lib/generator.ts` — makkelijk uit te breiden.

\* 100% wetenschappelijk. Nauwkeurigheid: 0%. Zelfvertrouwen: 312%.
