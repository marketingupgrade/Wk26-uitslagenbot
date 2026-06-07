// Hyper-sarcastische, volledig misplaatste vragen die NIETS met voetbal te maken hebben.
// Elke vraag heeft 3-4 antwoordopties. De antwoorden voeden (schijnbaar) het "algoritme".
export type Choice = {
  label: string;
  // Een verzonnen "gewicht" puur voor de show; beïnvloedt de onzin-onderbouwing.
  vibe: string;
};

export type Question = {
  id: string;
  // De botzin die wordt getypt.
  prompt: string;
  choices: Choice[];
};

export const questions: Question[] = [
  {
    id: "soep",
    prompt:
      "Voordat ik ook maar íéts over voetbal zeg: op een schaal van lauwe tomatensoep tot een onverwerkt jeugdtrauma, hoe voel jij je vandaag?",
    choices: [
      { label: "Lauwe tomatensoep", vibe: "thermisch instabiel" },
      { label: "Een prima broodje kroket", vibe: "gefrituurd zelfvertrouwen" },
      { label: "Onverwerkt jeugdtrauma", vibe: "diep tactisch" },
      { label: "Ik ben een raam", vibe: "transparant maar dragend" },
    ],
  },
  {
    id: "lepel",
    prompt:
      "Belangrijke kwalificatievraag voor het toernooi. Welke kant van de lepel vind jij stiekem het lekkerst?",
    choices: [
      { label: "De bolle kant (de rug)", vibe: "contra-intuïtief" },
      { label: "De holle kant (zoals een sukkel)", vibe: "conventioneel" },
      { label: "Het steeltje", vibe: "minimalistisch genie" },
    ],
  },
  {
    id: "maandag",
    prompt:
      "Als de maandag een geur had, en die geur was een persoon, en die persoon had een ringtone — welke ringtone?",
    choices: [
      { label: "Nokia Tune (uiteraard)", vibe: "klassiek dominant" },
      { label: "Een blaffende hond, ingesproken", vibe: "chaotisch briljant" },
      { label: "Stilte, maar dreigend", vibe: "psychologisch" },
      { label: "Crazy Frog", vibe: "ongeneeslijk" },
    ],
  },
  {
    id: "trap",
    prompt:
      "Stel: je staat bovenaan een roltrap die naar beneden gaat, maar je wílt naar boven. Wat is jouw strategie en hoeveel spijt heb je?",
    choices: [
      { label: "Tegenrennen, vol overgave", vibe: "hoog werkethos" },
      { label: "Gewoon wachten tot de fysica opgeeft", vibe: "geduldig fatalisme" },
      { label: "Ik woon nu op de roltrap", vibe: "permanent commitment" },
    ],
  },
  {
    id: "kaas",
    prompt:
      "Diep ademhalen. Dit bepaalt alles. Hoeveel gaten zou een plak kaas mógen hebben voordat het officieel verraad is?",
    choices: [
      { label: "Nul. Kaas hoort dicht.", vibe: "autoritair" },
      { label: "Drie, als ze elkaar respecteren", vibe: "diplomatiek" },
      { label: "Oneindig, ik aanbid de leegte", vibe: "spiritueel" },
      { label: "Wat is kaas", vibe: "verontrustend" },
    ],
  },
  {
    id: "wolk",
    prompt:
      "Snel, niet nadenken: welke wolk ben jij, en heeft die wolk jou ooit teleurgesteld?",
    choices: [
      { label: "Een grote dramatische onweerswolk", vibe: "explosief" },
      { label: "Zo'n schattig klein wolkje", vibe: "onderschat" },
      { label: "Geen wolk, ik ben de lucht ertussen", vibe: "ongrijpbaar" },
    ],
  },
  {
    id: "parkeren",
    prompt:
      "Laatste vraag, en hier hangt het hele WK vanaf: hoe parkeert jouw oma achteruit, emotioneel gezien?",
    choices: [
      { label: "Met absolute, beangstigende zekerheid", vibe: "ijskoud" },
      { label: "Acht pogingen en een gebed", vibe: "veerkrachtig" },
      { label: "Ze parkeert vooruit, in een muur", vibe: "ongebonden" },
      { label: "Mijn oma is een legende, geen bestuurder", vibe: "mythisch" },
    ],
  },
];
