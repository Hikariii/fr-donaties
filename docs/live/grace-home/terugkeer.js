// LIVE: de terugkeer van de backend naar de actiepagina. Lees docs/live/README.md.

/*
  De backend stuurt de donateur terug naar de pagina op forerunner.info, met
  één parameter. Het Code Block in Squarespace geeft die door aan de iframe.

  - ?donatie=betaald|verwerking|mislukt|onbekend: na de betaling bij Mollie
  - ?fout=bedrag|project|email|betaling: de backend weigerde het formulier

  Een onbekende waarde negeert de pagina: dan toont ze het formulier.
*/
import { icoon } from './iconen.js';

const BEDANKT = {
  betaald: {
    icoon: 'hart',
    titel: 'Bedankt voor je gift!',
    tekst: 'Je betaling is gelukt. Met jouw gift geef je de kinderen van Grace Home hoop.',
  },
  verwerking: {
    icoon: 'hart',
    titel: 'Bedankt voor je gift!',
    tekst: 'Je betaling wordt nog verwerkt. Dat duurt meestal maar even.',
  },
  onbekend: {
    icoon: 'cadeau',
    titel: 'Bedankt voor je gift',
    tekst: 'We weten de status van je betaling nog niet. Twijfel je? Mail dan naar info@forerunner.info.',
  },
};

// 'mislukt' toont het formulier weer, met deze melding erboven.
const MISLUKT = 'De betaling is niet gelukt of is afgebroken. Je kunt het opnieuw proberen.';

// Per fout van de backend: het veld met de melding, en de melding.
const FOUTEN = {
  email: { veld: 'email', tekst: 'Vul een geldig e-mailadres in.' },
  bedrag: { veld: 'algemeen', tekst: 'Het bedrag is niet geldig. Kies opnieuw wat je wilt geven.' },
  project: { veld: 'algemeen', tekst: 'Er ging iets mis bij het starten van de betaling. Probeer het opnieuw.' },
  betaling: { veld: 'algemeen', tekst: 'Er ging iets mis bij het starten van de betaling. Probeer het opnieuw.' },
};

// Het adres van deze pagina zonder de parameters van de terugkeer, met ?test
// als dat er stond.
function schoonAdres() {
  const adres = new URL(location.href);
  adres.searchParams.delete('donatie');
  adres.searchParams.delete('fout');
  return adres.pathname + adres.search;
}

function toonBedankt(form, bericht) {
  const kaart = document.createElement('section');
  kaart.className = 'bedankt';
  kaart.setAttribute('role', 'status');
  kaart.innerHTML = `
      <div class="bedankt-icoon">${icoon(bericht.icoon)}</div>
      <h2></h2>
      <p></p>
      <a class="geef" href="">Nog een gift geven</a>`;
  kaart.querySelector('h2').textContent = bericht.titel;
  kaart.querySelector('p').textContent = bericht.tekst;
  kaart.querySelector('a').href = schoonAdres();
  form.hidden = true;
  form.before(kaart);
}

function toonMelding(form, tekst) {
  const melding = document.createElement('p');
  melding.className = 'melding';
  melding.setAttribute('role', 'alert');
  melding.textContent = tekst;
  form.prepend(melding);
}

// Toon de terugkeer, als het adres daarom vraagt. Roep dit aan na
// startFormulier, want de foutvelden bestaan pas daarna.
export function toonTerugkeer(form) {
  const params = new URLSearchParams(location.search);
  const donatie = params.get('donatie');
  const fout = FOUTEN[params.get('fout')];

  if (BEDANKT[donatie]) return toonBedankt(form, BEDANKT[donatie]);
  if (donatie === 'mislukt') return toonMelding(form, MISLUKT);
  if (fout) {
    const plek = form.querySelector(`#fout-${fout.veld}`);
    plek.textContent = fout.tekst;
    if (fout.veld === 'email') form.querySelector('#email').setAttribute('aria-invalid', 'true');
    plek.scrollIntoView({ block: 'center' });
  }
}
