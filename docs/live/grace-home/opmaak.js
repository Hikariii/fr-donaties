// LIVE: bedragen als tekst, voor de donatiepagina's van Grace Home. Lees docs/live/README.md.

// '12.50' -> '12,50'; '150' -> '150'; '25.00' -> '25'
export const bedragTekst = (bedrag) => {
  const n = Number(bedrag);
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',');
};

// '€ 12,50', met ' per maand' (of kort ' p/m') bij een maandelijkse optie.
export const prijsTekst = (optie, { kort = false } = {}) =>
  `€ ${bedragTekst(optie.bedrag)}` +
  (optie.periodiek === 'maandelijks' ? (kort ? ' p/m' : ' per maand') : '');
