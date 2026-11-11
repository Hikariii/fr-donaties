// LIVE: de kaarten van de opties en de vaste iconen. Lees docs/live/README.md.
import { icoon } from './iconen.js';
import { bedragTekst } from './opmaak.js';

const kaartHtml = (optie) => `
    <div class="optie">
      <input type="radio" name="keuze" id="k-${optie.id}" value="${optie.id}">
      <label for="k-${optie.id}">
        ${icoon(optie.icoon)}
        <span class="wat">
          <span class="prijs">€ ${bedragTekst(optie.bedrag)}${optie.periodiek === 'maandelijks' ? ' <small>per maand</small>' : ''}</span>
          <span class="titel">${optie.kaarttitel || optie.titel}</span>${optie.uitleg ? `
          <span class="uitleg">${optie.uitleg}</span>` : ''}
        </span>
      </label>
    </div>`;

// Zet de kaarten vooraan in de container, voor wat er al in staat (de tegel
// naar de andere pagina).
export function toonKaarten(container, opties) {
  container.insertAdjacentHTML('afterbegin', opties.map(kaartHtml).join(''));
}

// Vervang elk <span data-icoon="naam"> door het icoon.
export function toonIconen() {
  for (const plek of document.querySelectorAll('[data-icoon]')) plek.outerHTML = icoon(plek.dataset.icoon);
}
