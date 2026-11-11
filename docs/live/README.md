# Live: in productie op forerunner.info

> **Let op:** de pagina's in deze map draaien in productie. Ze staan in een
> iframe op forerunner.info en versturen echte donaties naar de backend van
> Forerunner (`POST https://forerunner-info.appspot.com/donate`). Bezoekers
> betalen via Mollie. Een fout hier kost donaties.

Experimenteer niet in deze map. Ontwerpen en prototypes staan in de andere
mappen van `docs/`, zoals `docs/grace-home-actie/`. Iets komt pas hier als het
af is.

## Pagina's

| Pagina | Map | Adres | Projectcode |
| --- | --- | --- | --- |
| Grace Home, eenmalig | `grace-home/index.html` | `https://hikariii.github.io/fr-donaties/live/grace-home/` | FR230 |
| Grace Home, maandelijks | `grace-home/maandelijks.html` | `https://hikariii.github.io/fr-donaties/live/grace-home/maandelijks.html` | FR230 |

De werkversie van Grace Home staat in `docs/grace-home-actie/`
(`b-flyer-precies.html` en `b-flyer-maandelijks.html`).

## Een wijziging live zetten

1. Wijzig en test eerst de werkversie (bijvoorbeeld in
   `docs/grace-home-actie/`).
2. Neem de wijziging over in deze map, in een eigen pull request. Zet in de
   titel dat het om de live-versie gaat.
3. Controleer voor het mergen:
   - `PROTOTYPE = false` en de juiste `PROJECTCODE` in `gedeeld.js`;
   - de pagina's op mobiel en desktop, los en in een iframe;
   - wat het formulier verstuurt. Zet daarvoor lokaal `PROTOTYPE = true`: de
     pagina toont dan wat ze zou sturen. Zet het daarna terug.
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
