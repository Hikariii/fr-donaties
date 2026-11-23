// LIVE: de giften van het formulier "Een kind helpen". Lees docs/live/README.md.
//
// Eén groep per land. De giften en teksten zijn overgenomen uit de eenmalige
// pagina's van Grace Home en Geef hoop Paraguay. Afwijking: het startpakket van
// Grace Home heet hier korter "Schoolpakket: uniform, tas en boeken", zodat de
// kaarten van beide landen even hoog blijven.
//
// Een groep:
//   land         het land in de samenvatting ('India', 'Paraguay')
//   kop          de kop boven de giften
//   projectcode  de projectcode voor de backend
//   zelfKiezen   pagina om zelf een bedrag te kiezen (onder de giften)
//   opties       de giften, aflopend op bedrag
//
// Een gift:
//   id           uniek over alle groepen; ook het id van de radioknop (k-<id>)
//   bedrag       met een punt als decimaalteken, minimaal 5 ('12.50')
//   titel        in de samenvatting en, zonder kaarttitel, op de kaart
//   kaarttitel   (optioneel) een langere titel op de kaart
//   icoon        een naam uit iconen.js

export const LANDEN = [
  {
    land: 'India', kop: 'India: Grace Home', projectcode: 'FR230',
    zelfKiezen: { tekst: 'Of kies zelf een bedrag voor Grace Home', link: 'https://go.forerunner.nl/donate/FR230' },
    opties: [
      { id: 'india-schoolgeld-jaar', bedrag: '150', titel: 'Schoolgeld voor een heel jaar', icoon: 'boek' },
      { id: 'india-schoolpakket', bedrag: '50', titel: 'Schoolpakket', kaarttitel: 'Schoolpakket: uniform, tas en boeken', icoon: 'rugzak' },
      { id: 'india-kleding', bedrag: '25', titel: 'Set nieuwe kleding voor een kind', icoon: 'shirt' },
      { id: 'india-menstruatieset', bedrag: '15', titel: 'Menstruatieset tienermeisje', icoon: 'cadeau' },
    ],
  },
  {
    land: 'Paraguay', kop: 'Paraguay: Help een kind', projectcode: 'FR430',
    zelfKiezen: { tekst: 'Of kies zelf een bedrag voor Paraguay', link: 'https://go.forerunner.nl/donate/FR430' },
    opties: [
      { id: 'paraguay-schoolgeld-jaar', bedrag: '150', titel: 'Schoolgeld voor een jaar', icoon: 'schrift' },
      { id: 'paraguay-dokter', bedrag: '50', titel: 'Bezoek aan dokter of tandarts', icoon: 'stethoscoop' },
      { id: 'paraguay-voedselpakket', bedrag: '30', titel: 'Voedselpakket voor een gezin', icoon: 'mand' },
      { id: 'paraguay-kleding', bedrag: '15', titel: 'Set kleding voor een kind', icoon: 'shirt' },
    ],
  },
];

// Alle giften in één lijst, elk met het land en de projectcode van haar groep.
export const GIFTEN = LANDEN.flatMap(({ land, projectcode, opties }) =>
  opties.map((optie) => ({ ...optie, land, projectcode, periodiek: 'eenmalig' })));
