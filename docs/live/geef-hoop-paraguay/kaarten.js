// LIVE: de kaarten van de opties en de vaste iconen. Lees docs/live/README.md.
import { icoon } from './iconen.js';
import { bedragTekst } from './opmaak.js';

// Een optie met een link is geen gift: de kaart opent het aanmeldformulier in
// een nieuw tabblad. Zo'n kaart heeft geen radioknop, dus het formulier kan
// haar nooit versturen.
const prijsHtml = (optie) =>
  `${optie.link ? '<small class="vanaf">vanaf</small> ' : ''}€ ${bedragTekst(optie.bedrag)}${optie.periodiek === 'maandelijks' ? ' <small>per maand</small>' : ''}`;

const linkKaartHtml = (optie) => `
    <div class="optie">
      <a class="aanmelden" href="${optie.link}" target="_blank" rel="noopener" draggable="false">
        ${icoon(optie.icoon)}
        <span class="wat">
          <span class="prijs">${prijsHtml(optie)}</span>
          <span class="titel">${optie.kaarttitel || optie.titel}</span>${optie.uitleg ? `
          <span class="uitleg">${optie.uitleg}</span>` : ''}
          <span class="meld-aan">Meld je aan als sponsor <span aria-hidden="true">↗</span></span>
        </span>
      </a>
    </div>`;

const kaartHtml = (optie) => optie.link ? linkKaartHtml(optie) : `
    <div class="optie">
      <input type="radio" name="keuze" id="k-${optie.id}" value="${optie.id}">
      <label for="k-${optie.id}">
        ${icoon(optie.icoon)}
        <span class="wat">
          <span class="prijs">${prijsHtml(optie)}</span>
          <span class="titel">${optie.kaarttitel || optie.titel}</span>${optie.uitleg ? `
          <span class="uitleg">${optie.uitleg}</span>` : ''}
        </span>
      </label>
    </div>`;

// Zet de kaarten vooraan in de container, voor wat er al in staat (de tegel
// naar de andere pagina).
export function toonKaarten(container, opties) {
  container.insertAdjacentHTML('afterbegin', opties.map(kaartHtml).join(''));
  kiesOokNaSlepen(container);
}

// Indrukken en loslaten op dezelfde kaart of tegel kiest die, ook als de muis
// tussendoor bewoog. Firefox (en Waterfox) geeft dan soms geen klik, omdat
// indrukken en loslaten op verschillende delen van de kaart vallen.
function kiesOokNaSlepen(container) {
  const KAART_OF_TEGEL = '.optie label, a.maand, a.aanmelden';
  let begin = null;
  let netGekozen = false;

  container.addEventListener('pointerdown', (e) => {
    begin = e.button === 0 ? e.target.closest(KAART_OF_TEGEL) : null;
  });
  container.addEventListener('pointerup', (e) => {
    const doel = e.target.closest(KAART_OF_TEGEL);
    const zelfde = begin && doel === begin;
    begin = null;
    if (!zelfde || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    netGekozen = true;
    setTimeout(() => { netGekozen = false; });
    if (doel.matches('a.aanmelden')) {
      // Het aanmeldformulier opent in een nieuw tabblad, zoals target="_blank".
      window.open(doel.href, '_blank', 'noopener');
    } else if (doel.matches('a.maand')) {
      location.assign(doel.href);
    } else {
      const radio = document.getElementById(doel.htmlFor);
      if (!radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });
  container.addEventListener('pointercancel', () => { begin = null; });
  // De klik die de browser eventueel nog stuurt, is dan al afgehandeld.
  container.addEventListener('click', (e) => {
    if (netGekozen && e.target.closest(KAART_OF_TEGEL)) e.preventDefault();
  }, true);
}

// Vervang elk <span data-icoon="naam"> door het icoon.
export function toonIconen() {
  for (const plek of document.querySelectorAll('[data-icoon]')) plek.outerHTML = icoon(plek.dataset.icoon);
}
