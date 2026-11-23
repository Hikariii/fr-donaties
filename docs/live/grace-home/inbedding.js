// LIVE: de pagina in een iframe op forerunner.info. Lees docs/live/README.md.

// Meld de hoogte van de pagina aan de pagina eromheen, zodat die de iframe even
// hoog maakt en er geen schuifbalk in de iframe komt. Het script in het Code
// Block op forerunner.info luistert naar dit bericht.
export function meldHoogteAanOuder() {
  if (window.parent === window) return;
  const meld = () => window.parent.postMessage(
    { type: 'forerunner-actie-hoogte', hoogte: document.body.getBoundingClientRect().height }, '*');
  new ResizeObserver(meld).observe(document.body);
  // Het script van de pagina eromheen luistert soms pas als deze pagina al
  // geladen is; de eerste melding gaat dan verloren. Meld daarom ook na het
  // laden en daarna nog een paar keer, zodat de iframe altijd de goede hoogte
  // krijgt.
  window.addEventListener('load', meld);
  for (const ms of [500, 1500, 3000, 6000]) setTimeout(meld, ms);
}
