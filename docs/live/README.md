# Live: in productie op forerunner.info

> **Let op:** de pagina's in deze map draaien in productie. Ze staan in een
> iframe op forerunner.info en versturen echte donaties naar de backend van
> Forerunner (`POST https://forerunner-info.appspot.com/donate`). Bezoekers
> betalen via Mollie. Een fout hier kost donaties.

Elke wijziging gaat via een eigen branch en pull request. Zet in de titel dat
het om de live-versie gaat.

## Geïsoleerd

`docs/live/` deelt geen code met de rest van de repository. Alles wat een
live pagina gebruikt, staat in haar eigen map: HTML, JavaScript, CSS en
afbeeldingen.

- Een live pagina verwijst nooit naar een bestand buiten haar map (geen
  `../`). Lettertypes van Google Fonts zijn de enige externe bron.
- Andere mappen mogen een live pagina wel tonen, maar alleen in een iframe,
  zoals forerunner.info dat doet. Ze laden die pagina dan met `?test`. Een
  voorbeeld is de nagebootste pagina van forerunner.info in
  `docs/grace-home-actie/`.
- Kopieer geen code uit een andere map naar `docs/live/`, of andersom, om die
  daarna samen te onderhouden. Een kopie is daarna van de nieuwe map.

## Pagina's

| Pagina | Map | Adres | Projectcode |
| --- | --- | --- | --- |
| Grace Home, eenmalig | `grace-home/index.html` | `https://hikariii.github.io/fr-donaties/live/grace-home/` | FR230 |
| Grace Home, maandelijks | `grace-home/maandelijks.html` | `https://hikariii.github.io/fr-donaties/live/grace-home/maandelijks.html` | FR230 |
| Geef hoop Paraguay, eenmalig | `geef-hoop-paraguay/index.html` | `https://hikariii.github.io/fr-donaties/live/geef-hoop-paraguay/` | FR430 |
| Geef hoop Paraguay, maandelijks | `geef-hoop-paraguay/maandelijks.html` | `https://hikariii.github.io/fr-donaties/live/geef-hoop-paraguay/maandelijks.html` | FR430 |
| Een kind helpen, eenmalig | `kind-helpen/index.html` | `https://hikariii.github.io/fr-donaties/live/kind-helpen/` | FR230 en FR430 |

Elke actie heeft een eigen map, en de mappen delen ook onderling geen code.
`kind-helpen/` staat op <https://www.forerunner.nl/kind-sponsoren>: één
formulier met de eenmalige giften van Grace Home (links) en Paraguay
(rechts). De donateur kiest één gift; de projectcode volgt die gift. De giften
staan in `kind-helpen/opties.js`, overgenomen van de twee acties. Wijzig je
daar een gift, kijk dan ook in `kind-helpen/`.
Geef hoop Paraguay is begonnen als kopie van Grace Home. Een fix in de ene map
moet je dus ook in de andere doen, als die daar nodig is.

## De bestanden van een actie

Grace Home en Geef hoop Paraguay hebben dezelfde bestanden:

| Bestand | Wat |
| --- | --- |
| `index.html`, `maandelijks.html` | De twee pagina's: de kop, de tegel naar de andere pagina en een klein script dat de modules start. |
| `opties.js` | De opties: bedrag, periodiek, titel en icoon. Een optie toevoegen of wijzigen doe je hier. Een optie met `link` is geen gift: die kaart opent het aanmeldformulier voor sponsors in een nieuw tabblad. |
| `formulier.js` | Het formulier: de velden, de controle, het versturen naar de backend en de testmodus. Hier staan `PROJECTCODE` en `DONATIE_URL`. |
| `kaarten.js` | De kaarten van de opties. |
| `opmaak.js` | Bedragen als tekst (`€ 12,50 per maand`). |
| `iconen.js` | De iconen (Lucide). |
| `img/` | De foto in de kop. |
| `inbedding.js` | Meldt de hoogte aan forerunner.info, zodat de iframe meegroeit. |
| `gedeeld.css` | De stijl van beide pagina's. Wat maar op één pagina nodig is, staat in die pagina. |

De scripts zijn ES-modules. Open de pagina's daarom via een server, niet als
bestand (`file://`).

## Testmodus

Zet `?test` achter het adres, bijvoorbeeld
`https://hikariii.github.io/fr-donaties/live/grace-home/?test`. De pagina
verstuurt dan niets en toont wat ze naar de backend zou sturen. De tegel naar
de andere pagina houdt `?test` vast. Zo test je de echte pagina zonder iets aan
de code te veranderen.

## Een wijziging live zetten

1. Maak een branch en wijzig de pagina in deze map.
2. Test lokaal, met een server in `docs/`
   (`python3 -m http.server 8765`), op
   `http://localhost:8765/live/<map>/?test`:
   - op mobiel en desktop, los en in een iframe
     (`http://localhost:8765/grace-home-actie/`);
   - wat het formulier verstuurt, voor eenmalig en maandelijks;
   - de foutmeldingen, en de terugknop na het versturen.
3. Controleer voor het mergen de `PROJECTCODE` in `formulier.js`.
4. Na de merge: doe één echte betaling en stort die zo nodig terug in Mollie.
   Bij een maandelijkse betaling: controleer het abonnement in Mollie en in het
   beheer van de backend, en zeg het daarna op.

## Wat de backend verwacht

- `projectcode`: een bestaand project. Een onbekende code geeft
  "Onbekende (01) fout". Controleer een code met
  `https://forerunner-info.appspot.com/donate/<CODE>`: een onbekend of
  inactief project stuurt door naar `/donate`.
- `bedrag`: een punt als decimaalteken, minimaal 5 (bijvoorbeeld `12.50`).
- `periodiek`: precies `maandelijks` voor een maandelijkse donatie; al het
  andere is eenmalig.
- `currency`, `name`, `email`, en `newsletter=YES` als de donor de
  nieuwsbrief wil.

## Inbouwen op forerunner.info

Zet op de pagina in Squarespace een Code Block met de iframe en een klein
script. Het script past de hoogte van de iframe aan. Met `?maandelijks` achter
het adres van de pagina start de iframe op de maandelijkse pagina, bijvoorbeeld
`https://www.forerunner.nl/geef-hoop-grace-home?maandelijks`. Zonder die
parameter start de iframe op de eenmalige pagina. Dit is het blok van Grace Home, op
<https://www.forerunner.nl/geef-hoop-grace-home>:

```html
<iframe id="grace-home-actie"
        src="https://hikariii.github.io/fr-donaties/live/grace-home/"
        title="Geef hoop: Grace Home"
        scrolling="no"
        style="display:block;width:100%;border:0;height:600px;"></iframe>
<script>
  (function () {
    var f = document.getElementById('grace-home-actie');

    // Met ?maandelijks achter het adres van deze pagina start de iframe op de
    // maandelijkse pagina. Het script leest alleen deze ene parameter, en geeft
    // niets door aan de iframe.
    if (new URLSearchParams(window.location.search).has('maandelijks')) {
      f.src = 'https://hikariii.github.io/fr-donaties/live/grace-home/maandelijks.html';
    }

    // De pagina in de iframe meldt haar hoogte; pas de iframe daarop aan.
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://hikariii.github.io') return;
      if (e.source !== f.contentWindow) return;
      if (e.data && e.data.type === 'forerunner-actie-hoogte') {
        f.style.height = Math.ceil(e.data.hoogte) + 'px';
      }
    });
  })();
</script>
```

Voor Geef hoop Paraguay, op <https://www.forerunner.nl/geef-hoop-paraguay>, is het
hetzelfde blok met een eigen `id`, `src` en `title`:

```html
<iframe id="geef-hoop-paraguay"
        src="https://hikariii.github.io/fr-donaties/live/geef-hoop-paraguay/"
        title="Geef kansarme kinderen hoop: Paraguay"
        scrolling="no"
        style="display:block;width:100%;border:0;height:600px;"></iframe>
<script>
  (function () {
    var f = document.getElementById('geef-hoop-paraguay');

    // Met ?maandelijks achter het adres van deze pagina start de iframe op de
    // maandelijkse pagina. Het script leest alleen deze ene parameter, en geeft
    // niets door aan de iframe.
    if (new URLSearchParams(window.location.search).has('maandelijks')) {
      f.src = 'https://hikariii.github.io/fr-donaties/live/geef-hoop-paraguay/maandelijks.html';
    }

    // De pagina in de iframe meldt haar hoogte; pas de iframe daarop aan.
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://hikariii.github.io') return;
      if (e.source !== f.contentWindow) return;
      if (e.data && e.data.type === 'forerunner-actie-hoogte') {
        f.style.height = Math.ceil(e.data.hoogte) + 'px';
      }
    });
  })();
</script>
```

Voor "Een kind helpen", op <https://www.forerunner.nl/kind-sponsoren>, in de
sectie "Een kind helpen zonder sponsor te worden": één Code Block op de plek
van de twee prijslijsten. Zet het blok in de Fluid Engine op de volle
contentbreedte (raster 2/26), even breed als de blokken in de secties erboven;
de H2 en de intro mogen smaller blijven. De regels "Of kies zelf een
bedrag" staan in het formulier, onder elke kolom. De pagina heeft een
doorzichtige achtergrond, dus de kleur van de sectie blijft zichtbaar.

```html
<iframe id="kind-helpen"
        src="https://hikariii.github.io/fr-donaties/live/kind-helpen/"
        title="Een kind helpen: Grace Home of Paraguay"
        scrolling="no"
        style="display:block;width:100%;border:0;height:600px;"></iframe>
<script>
  (function () {
    var f = document.getElementById('kind-helpen');
    // De pagina in de iframe meldt haar hoogte; pas de iframe daarop aan.
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://hikariii.github.io') return;
      if (e.source !== f.contentWindow) return;
      if (e.data && e.data.type === 'forerunner-actie-hoogte') {
        f.style.height = Math.ceil(e.data.hoogte) + 'px';
      }
    });
  })();
</script>
```

Het formulier opent Mollie in het hele venster (`target="_top"`). Een iframe
met een `sandbox`-attribuut moet daarom `allow-top-navigation` toestaan.

### Het Code Block in de Fluid Engine

- In de editor draaien scripts niet. Daar houdt de iframe de starthoogte uit
  de code. Houd die laag (600px), anders maakt de Fluid Engine het blok en de
  sectie zo hoog. Op de live site staat er dan veel witruimte onder het
  formulier.
- Maak het blok in de editor klein (rond 600px) en zet de Row Count van de
  sectie zo laag als kan, op desktop en op mobiel. De rijen groeien op de
  live site mee met het formulier.
- Zet niets onder het blok in dezelfde sectie, en zet "Fill Screen" uit.
- Bekijk het resultaat op de live site, niet in de editor.
