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
   `http://localhost:8765/live/grace-home/?test`:
   - op mobiel en desktop, los en in een iframe
     (`http://localhost:8765/grace-home-actie/`);
   - wat het formulier verstuurt, voor eenmalig en maandelijks;
   - de foutmeldingen, en de terugknop na het versturen.
3. Controleer voor het mergen de `PROJECTCODE` in `gedeeld.js`.
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
script dat de hoogte van de iframe aanpast:

```html
<iframe id="grace-home-actie"
        src="https://hikariii.github.io/fr-donaties/live/grace-home/"
        title="Geef hoop: Grace Home"
        scrolling="no"
        style="display:block;width:100%;border:0;height:600px;"></iframe>
<script>
  // De pagina in de iframe meldt haar hoogte; pas de iframe daarop aan.
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://hikariii.github.io') return;
    var f = document.getElementById('grace-home-actie');
    if (!f || e.source !== f.contentWindow) return;
    if (e.data && e.data.type === 'forerunner-actie-hoogte') {
      f.style.height = Math.ceil(e.data.hoogte) + 'px';
    }
  });
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
