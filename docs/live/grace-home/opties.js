// LIVE: de opties van de donatiepagina's van Grace Home. Lees docs/live/README.md.

/*
  Een optie:
  - id: uniek; de radioknop heet k-<id>
  - periodiek: 'eenmalig' of 'maandelijks'
  - bedrag: zoals de backend het wil: een punt als decimaalteken, minimaal 5
    (bijvoorbeeld '12.50')
  - titel: in de samenvatting, en op de kaart als er geen kaarttitel is
  - kaarttitel (niet verplicht): langere titel op de kaart
  - uitleg (niet verplicht): kleine regel onder de titel op de kaart
  - icoon: een naam uit iconen.js
  De volgorde van een lijst is de volgorde op de pagina: aflopend op bedrag.
*/

export const EENMALIG = [
  { id: 'schoolgeld-jaar', periodiek: 'eenmalig', bedrag: '150', titel: 'Schoolgeld voor een heel jaar', icoon: 'boek' },
  { id: 'startpakket', periodiek: 'eenmalig', bedrag: '50', titel: 'Startpakket school', kaarttitel: 'Startpakket school: uniform, schooltas, schoolboeken e.a.', icoon: 'rugzak' },
  { id: 'kleding', periodiek: 'eenmalig', bedrag: '25', titel: 'Set nieuwe kleding voor een kind', icoon: 'shirt' },
  { id: 'menstruatieset', periodiek: 'eenmalig', bedrag: '15', titel: 'Menstruatieset tienermeisje', icoon: 'cadeau' },
];

export const MAANDELIJKS = [
  { id: 'sponsor', periodiek: 'maandelijks', bedrag: '38.50', titel: 'Sponsor een kind of student', uitleg: 'Zorg, voedsel, een liefdevol thuis en onderwijs.', icoon: 'persoon' },
  { id: 'eten-2', periodiek: 'maandelijks', bedrag: '25', titel: 'Eten voor twee kinderen', uitleg: 'Elke dag een gezonde maaltijd.', icoon: 'soep' },
  { id: 'scholing-1', periodiek: 'maandelijks', bedrag: '12.50', titel: 'Schoolgeld voor een kind', uitleg: 'Elk jaar naar school, zolang je geeft.', icoon: 'hoed' },
];
