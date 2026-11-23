// LIVE: de groepen en kaarten van het formulier "Een kind helpen". Lees docs/live/README.md.
import { icoon } from './iconen.js';
import { bedragTekst } from './opmaak.js';

// Alle kaarten zijn radioknoppen met dezelfde name, over beide groepen heen:
// een keuze in de ene groep wist de keuze in de andere.
const kaartHtml = (optie) => `
        <div class="optie">
          <input type="radio" name="keuze" id="k-${optie.id}" value="${optie.id}">
          <label for="k-${optie.id}">
            ${icoon(optie.icoon)}
            <span class="wat">
              <span class="prijs">€ ${bedragTekst(optie.bedrag)}</span>
              <span class="titel">${optie.kaarttitel || optie.titel}</span>
            </span>
          </label>
        </div>`;

// De link om zelf een bedrag te kiezen opent in een nieuw tabblad.
const groepHtml = ({ kop, projectcode, opties, zelfKiezen }) => `
    <section class="groep" aria-labelledby="kop-${projectcode}">
      <h3 id="kop-${projectcode}">${kop}</h3>
      <div class="opties">${opties.map(kaartHtml).join('')}
      </div>
      <p class="zelf-kiezen"><a href="${zelfKiezen.link}" target="_blank" rel="noopener">${zelfKiezen.tekst}</a>.</p>
    </section>`;

// Zet een groep per land in de container.
export function toonGroepen(container, landen) {
  container.innerHTML = landen.map(groepHtml).join('');
  kiesOokNaSlepen(container);
}

// Indrukken en loslaten op dezelfde kaart kiest die, ook als de muis
// tussendoor bewoog. Firefox (en Waterfox) geeft dan soms geen klik, omdat
// indrukken en loslaten op verschillende delen van de kaart vallen.
function kiesOokNaSlepen(container) {
  const KAART = '.optie label';
  let begin = null;
  let netGekozen = false;

  container.addEventListener('pointerdown', (e) => {
    begin = e.button === 0 ? e.target.closest(KAART) : null;
  });
  container.addEventListener('pointerup', (e) => {
    const doel = e.target.closest(KAART);
    const zelfde = begin && doel === begin;
    begin = null;
    if (!zelfde || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    netGekozen = true;
    setTimeout(() => { netGekozen = false; });
    const radio = document.getElementById(doel.htmlFor);
    if (!radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  container.addEventListener('pointercancel', () => { begin = null; });
  // De klik die de browser eventueel nog stuurt, is dan al afgehandeld.
  container.addEventListener('click', (e) => {
    if (netGekozen && e.target.closest(KAART)) e.preventDefault();
  }, true);
}
