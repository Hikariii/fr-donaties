/*
  Gedeelde code voor de ontwerpen van de kerstactie Grace Home.

  Elk ontwerp heeft:
  - <form id="donatie"> met radioknoppen name="keuze" (maak ze met GH.radio)
  - <section id="stap-gegevens" data-gh-gegevens></section>; GH.start vult die
    met de velden voor naam en e-mailadres, de foutmeldingen en de knop
  - een <p class="fout" id="fout-keuze"></p> bij de keuzes
  Roep daarna GH.start() aan.

  De backend (POST /donate):
  - bedrag: "12.50" of "150". Minimaal 5. Geen centen, geen duizendtallen.
  - periodiek: precies "maandelijks" voor een maandelijkse donatie; al het
    andere is eenmalig. De eerste betaling maakt het mandaat; Mollie schrijft
    daarna elke maand hetzelfde bedrag af.
  - projectcode: FR230 (Grace Home India - kindsponsoring), actief in de database
    (bevestigd 2026-11-11). Zet PROTOTYPE op true om te testen zonder te
    betalen: de pagina verstuurt dan niets en toont wat ze zou sturen.

  Iconen: paden van Lucide (lucide.dev, ISC-licentie).
*/
(function () {
  const PROTOTYPE = false;
  const PROJECTCODE = 'FR230';
  const ACTIE = 'https://forerunner-info.appspot.com/donate';
  const SPONSOR_URL = 'https://forerunner.info/projecten/grace-home';

  // De opties in de volgorde van de pagina: aflopend op bedrag.
  const OPTIES = {
    eenmalig: [
      { id: 'schoolgeld-jaar', bedrag: '150', titel: 'Schoolgeld voor een heel jaar', uitleg: 'Een kind gaat een heel jaar naar school.', icoon: 'boek', foto: 'img/grace-home.jpg' },
      { id: 'startpakket', bedrag: '50', titel: 'Startpakket school', uitleg: 'Uniform, schooltas, schoolboeken e.a.', icoon: 'rugzak', foto: 'img/grace-home.jpg' },
      { id: 'kleding', bedrag: '25', titel: 'Set nieuwe kleding voor een kind', uitleg: 'Nieuwe kleren die passen.', icoon: 'shirt', foto: 'img/india.jpg' },
      { id: 'menstruatieset', bedrag: '15', titel: 'Menstruatieset tienermeisje', uitleg: 'Maandverband en verzorging.', icoon: 'cadeau', foto: 'img/india.jpg' },
    ],
    maandelijks: [
      { id: 'sponsor', bedrag: '38.50', titel: 'Sponsor een kind of student', uitleg: 'Zorg, voedsel, een liefdevol thuis en onderwijs.', icoon: 'persoon', foto: 'img/india.jpg' },
      { id: 'eten-2', bedrag: '25', titel: 'Eten voor twee kinderen', uitleg: 'Elke dag een gezonde maaltijd.', icoon: 'soep', foto: 'img/india.jpg' },
      { id: 'scholing-1', bedrag: '12.50', titel: 'Schoolgeld voor een kind', uitleg: 'Elk jaar naar school, zolang je geeft.', icoon: 'hoed', foto: 'img/grace-home.jpg' },
    ],
  };

  const PADEN = {
    boek: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    rugzak: '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
    cadeau: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    hoed: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    kinderen: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    persoon: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    soep: '<path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/>',
    hart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  };

  const icoon = (naam) =>
    `<svg class="icoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PADEN[naam]}</svg>`;

  // "12.50" -> "12,50"; "150" -> "150"; "25.00" -> "25"
  const euro = (bedrag) => {
    const n = Number(bedrag);
    return Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',');
  };

  const periodiekVan = (soort) => (soort === 'maandelijks' ? 'maandelijks' : 'once');
  const prijs = (o, soort) => `€ ${euro(o.bedrag)}` + (soort === 'maandelijks' ? ' per maand' : '');

  // De radioknop voor een optie. Zet het label er zelf achter: <label for="k-…">.
  const radio = (o, soort) =>
    `<input type="radio" name="keuze" id="k-${o.id}" value="${o.id}" data-bedrag="${o.bedrag}" data-periodiek="${periodiekVan(soort)}" data-titel="${o.titel}" data-icoon="${o.icoon}">`;

  const sponsorNoot = () =>
    `<p class="sponsor-noot">Wil je meer geven of een vast kind volgen? <a href="${SPONSOR_URL}" target="_top">Lees meer over sponsoren bij Grace Home</a>.</p>`;

  const GEGEVENS = `
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
    <label class="nieuwsbrief"><input type="checkbox" name="newsletter" value="YES">Houd me op de hoogte met de nieuwsbrief van Forerunner.</label>
    <button class="geef" type="submit" id="geef">Geef</button>
    <ul class="vertrouwen">
      <li>Je betaalt veilig via Mollie, met iDEAL of creditcard.</li>
      <li>Een maandelijkse gift stop je wanneer je wilt.</li>
      <li>Forerunner is een ANBI: je gift is aftrekbaar.</li>
    </ul>`;

  const DIALOOG = `
    <dialog id="prototype-melding">
      <h2>Prototype</h2>
      <p>Deze pagina verstuurt nog niets. Dit zou naar de backend gaan:</p>
      <pre id="prototype-data"></pre>
      <form method="dialog"><button>Sluiten</button></form>
    </dialog>`;

  function start() {
    const form = document.getElementById('donatie');
    form.method = 'post';
    form.action = ACTIE;
    form.target = '_top';
    form.noValidate = true;
    form.insertAdjacentHTML('afterbegin', `
      <input type="hidden" name="currency" value="EUR">
      <input type="hidden" name="projectcode" value="${PROJECTCODE}">
      <input type="hidden" name="periodiek" id="periodiek" value="once">
      <input type="hidden" name="bedrag" id="bedrag" value="">`);

    const stapGegevens = document.getElementById('stap-gegevens');
    if (stapGegevens && stapGegevens.hasAttribute('data-gh-gegevens')) {
      stapGegevens.insertAdjacentHTML('beforeend', GEGEVENS);
    }
    document.body.insertAdjacentHTML('beforeend', DIALOOG);

    const naam = document.getElementById('naam');
    const email = document.getElementById('email');
    const geef = document.getElementById('geef');
    const samenvatting = document.getElementById('keuze-samenvatting');
    const fout = {
      keuze: document.getElementById('fout-keuze'),
      naam: document.getElementById('fout-naam'),
      email: document.getElementById('fout-email'),
    };
    const radios = () => form.querySelectorAll('input[name="keuze"]');
    const gekozen = () => form.querySelector('input[name="keuze"]:checked');

    const knoptekst = (r) =>
      r ? `Geef € ${euro(r.dataset.bedrag)}${r.dataset.periodiek === 'maandelijks' ? ' per maand' : ''}` : 'Geef';

    function toon() {
      const r = gekozen();
      geef.textContent = knoptekst(r);
      if (!samenvatting) return;
      if (!r) {
        samenvatting.className = 'keuze-samenvatting leeg';
        samenvatting.textContent = 'Je hebt nog niets gekozen.';
        return;
      }
      const maand = r.dataset.periodiek === 'maandelijks';
      samenvatting.className = 'keuze-samenvatting';
      samenvatting.innerHTML = '';
      const wat = document.createElement('span');
      wat.className = 'wat';
      const titel = document.createElement('strong');
      titel.textContent = r.dataset.titel;
      const soort = document.createElement('span');
      soort.textContent = maand ? 'Maandelijks' : 'Eenmalig';
      wat.append(titel, soort);
      const bedrag = document.createElement('span');
      bedrag.className = 'bedrag';
      bedrag.textContent = `€ ${euro(r.dataset.bedrag)}` + (maand ? ' p/m' : '');
      const beeld = document.createElement('span');
      beeld.className = 'beeld';
      beeld.innerHTML = PADEN[r.dataset.icoon] ? icoon(r.dataset.icoon) : '';
      samenvatting.append(beeld, wat, bedrag);
    }

    form.addEventListener('change', (e) => {
      if (e.target.name !== 'keuze') return;
      if (fout.keuze) fout.keuze.textContent = '';
      toon();
      form.dispatchEvent(new CustomEvent('gh:keuze', { detail: e.target }));
      // Scroll naar de gegevens als die nog onder de vouw staan.
      if (stapGegevens && !form.hasAttribute('data-geen-scroll')) {
        const rect = stapGegevens.getBoundingClientRect();
        if (rect.top > window.innerHeight - 80) {
          setTimeout(() => stapGegevens.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
        }
      }
    });

    function toonFout(veld, tekst, invoer) {
      if (fout[veld]) fout[veld].textContent = tekst;
      if (invoer.type !== 'radio') invoer.setAttribute('aria-invalid', 'true');
      invoer.focus({ preventScroll: true });
      const doel = invoer.type === 'radio' ? (fout.keuze || invoer) : invoer;
      doel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.addEventListener('submit', (e) => {
      for (const v in fout) if (fout[v]) fout[v].textContent = '';
      naam.removeAttribute('aria-invalid');
      email.removeAttribute('aria-invalid');

      const r = gekozen();
      if (!r) {
        e.preventDefault();
        const eerste = radios()[0];
        return toonFout('keuze', 'Kies eerst wat je wilt geven.', eerste);
      }
      naam.value = naam.value.trim();
      if (!naam.value) {
        e.preventDefault();
        return toonFout('naam', 'Vul je voor- en achternaam in.', naam);
      }
      if (!email.value || !email.checkValidity()) {
        e.preventDefault();
        return toonFout('email', 'Vul een geldig e-mailadres in.', email);
      }

      document.getElementById('periodiek').value = r.dataset.periodiek;
      document.getElementById('bedrag').value = r.dataset.bedrag;

      if (PROTOTYPE) {
        e.preventDefault();
        const data = new FormData(form);
        data.delete('keuze');
        document.getElementById('prototype-data').textContent =
          `Keuze: ${r.dataset.titel} (${r.dataset.periodiek === 'maandelijks' ? 'maandelijks' : 'eenmalig'})\n\n` +
          `POST ${form.action}\n\n` +
          [...data].map(([k, v]) => `${k} = ${v}`).join('\n');
        document.getElementById('prototype-melding').showModal();
        return;
      }

      // De radioknop "keuze" hoeft niet naar de backend.
      for (const x of radios()) x.disabled = true;
      // Voorkom een dubbele betaling door een tweede klik.
      setTimeout(() => {
        geef.disabled = true;
        geef.textContent = 'Even geduld…';
      });
    });

    // Enter in een tekstveld verstuurt het formulier niet meteen.
    for (const veld of [naam, email]) {
      veld.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); veld.blur(); }
      });
    }

    // Na 'terug' uit Mollie staat de pagina soms nog in de cache. Zet alles weer aan.
    window.addEventListener('pageshow', () => {
      for (const x of radios()) x.disabled = false;
      geef.disabled = false;
      toon();
    });

    // Geef de hoogte door aan de pagina eromheen, voor een iframe zonder schuifbalk.
    if (window.parent !== window) {
      const meld = () => window.parent.postMessage(
        { type: 'forerunner-actie-hoogte', hoogte: document.body.getBoundingClientRect().height }, '*');
      new ResizeObserver(meld).observe(document.body);
    }

    toon();
    return { form, gekozen, toon };
  }

  // Alleen de hoogte doorgeven, voor een pagina zonder formulier (B1).
  function meldHoogte() {
    if (window.parent === window) return;
    const meld = () => window.parent.postMessage(
      { type: 'forerunner-actie-hoogte', hoogte: document.body.getBoundingClientRect().height }, '*');
    new ResizeObserver(meld).observe(document.body);
  }

  window.GH = { OPTIES, SPONSOR_URL, icoon, euro, prijs, radio, sponsorNoot, start, meldHoogte };
})();
