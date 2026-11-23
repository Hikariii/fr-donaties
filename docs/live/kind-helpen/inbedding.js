// LIVE: het formulier in een iframe op forerunner.nl. Lees docs/live/README.md.

// Meld de hoogte van de pagina aan de pagina eromheen, zodat die de iframe even
// hoog maakt en er geen schuifbalk in de iframe komt. Het script in het Code
// Block op forerunner.nl luistert naar dit bericht.
export function meldHoogteAanOuder() {
  if (window.parent === window) return;
  const meld = () => window.parent.postMessage(
    { type: 'forerunner-actie-hoogte', hoogte: document.body.getBoundingClientRect().height }, '*');
  new ResizeObserver(meld).observe(document.body);
}
