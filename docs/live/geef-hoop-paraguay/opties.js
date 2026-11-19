// LIVE: de opties van de donatiepagina's van Geef hoop Paraguay. Lees docs/live/README.md.
//
// Een optie:
//   id          uniek; ook het id van de radioknop (k-<id>)
//   periodiek   'eenmalig' of 'maandelijks'
//   bedrag      met een punt als decimaalteken, minimaal 5 ('12.50')
//   titel       in de samenvatting en, zonder kaarttitel, op de kaart
//   kaarttitel  (optioneel) een langere titel op de kaart
//   uitleg      (optioneel) een regel onder de titel
//   icoon       een naam uit iconen.js
//
// De titels volgen de flyer. Elke lijst staat aflopend op bedrag.

export const EENMALIG = [
  { id: 'schoolgeld-jaar', periodiek: 'eenmalig', bedrag: '150', titel: 'Schoolgeld voor een jaar', icoon: 'schrift' },
  { id: 'dokter', periodiek: 'eenmalig', bedrag: '50', titel: 'Bezoek aan dokter of tandarts', icoon: 'stethoscoop' },
  { id: 'voedselpakket', periodiek: 'eenmalig', bedrag: '30', titel: 'Voedselpakket voor een gezin', icoon: 'mand' },
  { id: 'kleding', periodiek: 'eenmalig', bedrag: '15', titel: 'Set kleding voor een kind', icoon: 'shirt' },
];

export const MAANDELIJKS = [
  { id: 'sponsor', periodiek: 'maandelijks', bedrag: '38.50', titel: 'Sponsor een kind of student', uitleg: 'Voedsel, scholing en medische zorg.', icoon: 'persoon' },
  { id: 'voedselpakket-maand', periodiek: 'maandelijks', bedrag: '30', titel: 'Voedselpakket voor een gezin', uitleg: 'Elke maand eten op tafel voor een gezin.', icoon: 'mand' },
  { id: 'scholing-1', periodiek: 'maandelijks', bedrag: '12.50', titel: 'Schoolgeld voor een kind', uitleg: 'Een kind gaat naar school, zolang jij geeft.', icoon: 'hoed' },
];
