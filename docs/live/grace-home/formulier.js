/*
  LIVE: het donatieformulier van Grace Home. Lees docs/live/README.md voordat
  je iets wijzigt: dit formulier verstuurt echte donaties.

  De pagina heeft:
  - <form id="donatie"> met de radioknoppen name="keuze" (zie kaarten.js) en
    een <p class="fout" id="fout-keuze"></p> bij de keuzes
  - <section id="stap-gegevens"></section>; startFormulier vult die met de
    velden voor naam en e-mailadres, de foutmeldingen en de knop

  De backend (POST /donate):
  - bedrag: '12.50' of '150'. Minimaal 5.
  - periodiek: precies 'maandelijks' voor een maandelijkse donatie; al het
    andere is eenmalig. De eerste betaling maakt het mandaat; Mollie schrijft
    daarna elke maand hetzelfde bedrag af.
  - projectcode: FR230 (Grace Home India - kindsponsoring), actief in de
    database (bevestigd 2026-11-11).

  Testmodus: open de pagina met ?test. De pagina verstuurt dan niets en toont
  wat ze zou sturen. De tegel naar de andere pagina houdt ?test vast.
*/
import { icoon } from './iconen.js';
import { prijsTekst } from './opmaak.js';

const DONATIE_URL = 'https://forerunner-info.appspot.com/donate';
const PROJECTCODE = 'FR230';
const TESTMODUS = new URLSearchParams(location.search).has('test');
const PERIODIEK_VOOR_BACKEND = { eenmalig: 'once', maandelijks: 'maandelijks' };

const FOUTMELDINGEN = {
  keuze: 'Kies eerst wat je wilt geven.',
  naam: 'Vul je voor- en achternaam in.',
  email: 'Vul een geldig e-mailadres in.',
};

const GEGEVENS_HTML = `
    <div class="keuze-samenvatting leeg" id="keuze-samenvatting">Je hebt nog niets gekozen.</div>
    <div class="velden">
      <div>
        <label class="veldnaam" for="naam">Voor- en achternaam</label>
        <input type="text" name="name" id="naam" autocomplete="name" required>
        <p class="fout" id="fout-naam" aria-live="polite"></p>
      </div>
      <div>
        <label class="veldnaam" for="email">E-mailadres</label>
        <input type="email" name="email" id="email" autocomplete="email" inputmode="email" required>
        <p class="fout" id="fout-email" aria-live="polite"></p>
      </div>
    </div>
    <label class="nieuwsbrief"><input type="checkbox" name="newsletter" value="YES">Houd me via de nieuwsbrief op de hoogte van Forerunner.</label>
    <p class="fout" id="fout-algemeen" aria-live="polite"></p>
    <button class="geef" type="submit" id="geef">Geef</button>
    <ul class="vertrouwen">
      <li>Je betaalt veilig via Mollie, met iDEAL of creditcard.</li>
      <li>Een maandelijkse gift stop je wanneer je wilt.</li>
      <li>Forerunner is een ANBI: je gift is aftrekbaar.</li>
    </ul>`;

const TESTMELDING_HTML = `
    <dialog id="testmelding">
      <h2>Testmodus</h2>
      <p>De pagina verstuurt niets, omdat het adres ?test bevat. Dit zou naar de backend gaan:</p>
      <pre id="testmelding-data"></pre>
      <form method="dialog"><button>Sluiten</button></form>
    </dialog>`;

// Het eerste veld met een fout ('keuze', 'naam' of 'email'), of null.
export function eersteFout({ optie, naam, emailGeldig }) {
  if (!optie) return 'keuze';
  if (!naam) return 'naam';
  if (!emailGeldig) return 'email';
  return null;
}

export const knopTekst = (optie) => (optie ? `Geef ${prijsTekst(optie)}` : 'Geef');

// Het formulier post naar de backend, in het hele venster: Mollie mag niet in
// de iframe openen.
function zetVerzending(form) {
  form.method = 'post';
  form.action = DONATIE_URL;
  form.target = '_top';
  form.noValidate = true;
  form.insertAdjacentHTML('afterbegin', `
      <input type="hidden" name="currency" value="EUR">
      <input type="hidden" name="projectcode" value="${PROJECTCODE}">
      <input type="hidden" name="periodiek" value="once">
      <input type="hidden" name="bedrag" value="">`);
}

function toonSamenvatting(samenvatting, optie) {
  if (!optie) {
    samenvatting.className = 'keuze-samenvatting leeg';
    samenvatting.textContent = 'Je hebt nog niets gekozen.';
    return;
  }
  const deel = (tag, klasse, tekst) => {
    const el = document.createElement(tag);
    if (klasse) el.className = klasse;
    if (tekst) el.textContent = tekst;
    return el;
  };
  const beeld = deel('span', 'beeld');
  beeld.innerHTML = icoon(optie.icoon);
  const wat = deel('span', 'wat');
  wat.append(deel('strong', '', optie.titel), deel('span', '', optie.periodiek === 'maandelijks' ? 'Maandelijks' : 'Eenmalig'));
  samenvatting.className = 'keuze-samenvatting';
  samenvatting.replaceChildren(beeld, wat, deel('span', 'bedrag', prijsTekst(optie, { kort: true })));
}

// Scroll naar de gegevens als die nog onder de vouw staan.
function scrollNaarGegevens(stapGegevens) {
  if (stapGegevens.getBoundingClientRect().top > window.innerHeight - 80) {
    setTimeout(() => stapGegevens.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
  }
}

function toonTestmelding(form, optie) {
  const data = new FormData(form);
  data.delete('keuze');
  document.getElementById('testmelding-data').textContent =
    `Keuze: ${optie.titel} (${optie.periodiek})\n\n` +
    `POST ${form.action}\n\n` +
    [...data].map(([k, v]) => `${k} = ${v}`).join('\n');
  document.getElementById('testmelding').showModal();
}

export function startFormulier(form, opties) {
  zetVerzending(form);
  const stapGegevens = form.querySelector('#stap-gegevens');
  stapGegevens.insertAdjacentHTML('beforeend', GEGEVENS_HTML);
  if (TESTMODUS) document.body.insertAdjacentHTML('beforeend', TESTMELDING_HTML);

  const naam = form.querySelector('#naam');
  const email = form.querySelector('#email');
  const knop = form.querySelector('#geef');
  const samenvatting = form.querySelector('#keuze-samenvatting');
  const fout = {
    keuze: form.querySelector('#fout-keuze'),
    naam: form.querySelector('#fout-naam'),
    email: form.querySelector('#fout-email'),
    algemeen: form.querySelector('#fout-algemeen'),
  };
  const radios = () => form.querySelectorAll('input[name="keuze"]');
  const gekozenOptie = () => opties.find((o) => o.id === form.elements.keuze.value);

  function werkKeuzeBij() {
    const optie = gekozenOptie();
    knop.textContent = knopTekst(optie);
    toonSamenvatting(samenvatting, optie);
  }

  function wisFouten() {
    for (const melding of Object.values(fout)) melding.textContent = '';
    naam.removeAttribute('aria-invalid');
    email.removeAttribute('aria-invalid');
  }

  function toonFout(veld) {
    fout[veld].textContent = FOUTMELDINGEN[veld];
    const invoer = veld === 'keuze' ? radios()[0] : { naam, email }[veld];
    if (veld !== 'keuze') invoer.setAttribute('aria-invalid', 'true');
    invoer.focus({ preventScroll: true });
    (veld === 'keuze' ? fout.keuze : invoer).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Na het versturen: de radioknop 'keuze' hoeft niet naar de backend, en een
  // tweede klik mag geen tweede betaling starten.
  function blokkeer() {
    for (const radio of radios()) radio.disabled = true;
    setTimeout(() => {
      knop.disabled = true;
      knop.textContent = 'Even geduld…';
    });
  }

  // Na 'terug' uit Mollie staat de pagina soms nog in de cache. Zet alles weer aan.
  function herstel() {
    for (const radio of radios()) radio.disabled = false;
    knop.disabled = false;
    werkKeuzeBij();
  }

  function verstuur(e) {
    wisFouten();
    naam.value = naam.value.trim();
    const optie = gekozenOptie();
    const veld = eersteFout({ optie, naam: naam.value, emailGeldig: email.value !== '' && email.checkValidity() });
    if (veld) {
      e.preventDefault();
      toonFout(veld);
      return;
    }
    form.elements.periodiek.value = PERIODIEK_VOOR_BACKEND[optie.periodiek];
    form.elements.bedrag.value = optie.bedrag;
    if (TESTMODUS) {
      e.preventDefault();
      toonTestmelding(form, optie);
      return;
    }
    blokkeer();
  }

  form.addEventListener('change', (e) => {
    if (e.target.name !== 'keuze') return;
    fout.keuze.textContent = '';
    werkKeuzeBij();
    scrollNaarGegevens(stapGegevens);
  });
  form.addEventListener('submit', verstuur);

  // Enter in een tekstveld verstuurt het formulier niet meteen.
  for (const veld of [naam, email]) {
    veld.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); veld.blur(); }
    });
  }

  window.addEventListener('pageshow', herstel);

  // In de testmodus blijft ?test staan op de tegel naar de andere pagina.
  if (TESTMODUS) {
    for (const tegel of document.querySelectorAll('a.maand')) tegel.search = location.search;
  }

  werkKeuzeBij();
}
