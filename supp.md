# Actiepagina voor een eenmalige donatie

Een eenvoudige actiepagina voor de kerstactie van Stichting Forerunner. Een
donateur kiest een project, vult een e-mailadres in en klikt op een bedrag.
Die klik stuurt de donateur direct naar de betaalpagina van Mollie.

De pagina is statische HTML. De backend van Forerunner hoeft niet te
veranderen: de pagina gebruikt de bestaande route `POST /donate` van het
huidige donatieformulier.

De stijl volgt de actiepagina's van supp, bijvoorbeeld
<https://supp.to/rouwkostrun25>.

## Waarom een aparte pagina

Het huidige donatieformulier draait op `forerunner-info.appspot.com/donate`.
Het formulier staat in een iframe op <https://forerunner.info/ondersteunen>.
Voor een actie is dat formulier te ingewikkeld:

- de donateur kiest eerst tussen een maandelijkse donatie en een eenmalige
  donatie;
- de donateur kiest een project uit een lange lijst;
- de donateur vult een naam en een e-mailadres in;
- de donateur kiest een valuta.

Een actie vraagt het tegenovergestelde: weinig keuzes, weinig gegevens en zo
snel mogelijk naar de betaling.

## Doelen

- Alleen een eenmalige donatie. Geen periodieke donatie.
- Drie projecten: Grace Home, Action Uruma en Gebed en Zending Paraguay.
- Vaste bedragen als knoppen. Na het invullen van het e-mailadres is de
  donatie één klik.
- Alleen een naam en een e-mailadres als gegevens.
- Mobile-first en responsive.
- Statische HTML, zonder build-stap.

## Wat de donateur doet

1. De donateur kiest een van de drie projecten.
2. De donateur vult een voor- en achternaam en een e-mailadres in.
3. De donateur kiest eventueel de nieuwsbrief.
4. De donateur klikt op een bedrag, bijvoorbeeld € 25, of vult een ander
   bedrag in.
5. De browser gaat naar de betaalpagina van Mollie.
6. Na de betaling komt de donateur op de bestaande bedankpagina van appspot.

## Hoe de koppeling werkt

De pagina bevat een gewoon HTML-formulier:

```html
<form method="post" action="https://forerunner-info.appspot.com/donate" target="_top">
```

De backend verwerkt het formulier zoals een donatie uit het huidige formulier:

1. De backend controleert het bedrag, de projectcode en het e-mailadres.
2. De backend maakt een donateur, een klant bij Mollie en een betaling.
3. De backend stuurt de browser met een 302 door naar de betaalpagina van
   Mollie.
4. Mollie meldt de status via de webhook `/molliewebhook`.
5. Mollie stuurt de donateur terug naar `/donatereturn/<klant-id>`.

### Velden van `POST /donate`

| Veld | Waarde op de actiepagina | Opmerking |
| --- | --- | --- |
| `projectcode` | de code van het gekozen project | Het project moet actief zijn. |
| `bedrag` | de waarde van de geklikte knop | Minimaal 5. Een komma mag. |
| `email` | het ingevulde e-mailadres | De backend controleert het adres. |
| `name` | de ingevulde voor- en achternaam | De backend geeft de naam door aan Mollie. |
| `currency` | `EUR` | Vast. |
| `periodiek` | `once` | Vast, dus altijd een eenmalige donatie. |
| `newsletter` | `YES` als de donateur het vakje aanvinkt | Anders ontbreekt het veld. |

Elke bedragknop is een submit-knop met `name="bedrag"` en het bedrag als
`value`. Zo stuurt één klik het bedrag en het formulier tegelijk.

### Waarom een gewoon formulier en geen `fetch`

De backend antwoordt met een doorverwijzing naar Mollie, niet met JSON. De
browser moet die doorverwijzing volgen in het hoofdvenster. Een `fetch` vanaf
een ander domein krijgt dat antwoord niet, door CORS. Een gewone POST van een
formulier heeft geen last van CORS.

## Hosting

De pagina kan op elke plek staan, want het formulier stuurt naar een vol adres
op appspot. Ik heb de headers en de code gecontroleerd.

### Wat de controle liet zien

- forerunner.info draait op Squarespace en stuurt geen
  `Content-Security-Policy`. Er is dus geen `form-action` die een POST naar
  appspot tegenhoudt.
- `POST /donate` controleert geen CSRF-token, geen `Origin` en geen `Referer`.
- De backend zet `frame-ancestors https://forerunner.info
  https://*.forerunner.info` op elke pagina. Die regel geldt alleen voor een
  pagina van appspot in een iframe. Een formulier op forerunner.info raakt de
  regel niet.
- Mollie toont de betaalpagina niet in een iframe. Een formulier in een iframe
  heeft daarom `target="_top"` nodig.
- Squarespace staat JavaScript en iframes in een code block alleen toe vanaf
  het abonnement Core, of in een oud abonnement dat dat ook toestaat.
  `/ondersteunen` toont al een iframe in een code block, dus het abonnement
  staat dat waarschijnlijk toe.

Niet getest: een echte POST vanaf forerunner.info naar productie. De code
blokkeert zo'n POST niet, maar de eerste echte test moet dat bevestigen.

### Mogelijkheden

| Plek | Wat nodig is | Voordeel | Nadeel |
| --- | --- | --- | --- |
| Code block op een pagina van forerunner.info | HTML in Squarespace | Eigen domein, geen iframe | Opmaak en uitrol via de editor van Squarespace |
| Iframe op forerunner.info, pagina elders | HTML elders, iframe in Squarespace | Pagina los te beheren in git | Hoogte van de iframe regelen |
| GitHub Pages van dit project | Map `docs/` of een eigen map, eventueel een DNS-record | Uitrol met een push | Ander domein, tenzij een DNS-record wijst |
| Statisch bestand in de backend op appspot | Bestand plus regel in `app.yaml` | Zelfde domein als de betaling | Uitrol via de backend |

Advies: zet de pagina in een code block op forerunner.info, zonder iframe. Dan
blijft de donateur op het eigen domein. Mollie opent dan in hetzelfde
tabblad.

## Ontwerp

Het prototype heeft deze opbouw, van boven naar beneden:

1. Een kop met een foto, het label "Kerstactie 2026", een titel en één zin.
2. Een korte tekst over de actie.
3. Stap 1: drie kaarten voor de projecten, met een foto, een naam en één zin.
4. Stap 2: een veld voor de voor- en achternaam, een veld voor het
   e-mailadres en het vakje voor de nieuwsbrief.
5. Stap 3: vier bedragknoppen (€ 10, € 25, € 50 en € 100) en een veld voor
   een ander bedrag.
6. Een blok met drie punten: veilig betalen via Mollie, de ANBI-status, en
   de donatie gaat naar het gekozen project.

Afspraken voor het ontwerp:

- Op mobiel staan de projecten onder elkaar en de bedragen in twee kolommen.
  Op een breed scherm staan de projecten naast elkaar en de bedragen in vier
  kolommen.
- De kleuren en het lettertype Poppins komen uit de site van forerunner.info:
  roestbruin voor de knoppen, donker petrol voor de koppen en salie als
  accent.
- Een melding van een fout staat onder het veld. De pagina gebruikt geen
  melding van de browser.

### Gedrag van het formulier

- Na een klik op een bedrag schakelt de pagina alle knoppen uit. Een tweede
  klik start dus geen tweede betaling.
- Enter in een tekstveld drukt niet de eerste bedragknop in.
- Komt de donateur terug van Mollie met de knop "terug"? Dan zet de pagina de
  knoppen weer aan.
- In een iframe meldt de pagina haar hoogte aan de pagina eromheen, met
  `postMessage`. De iframe krijgt dan geen schuifbalk.
- Een prototypemodus toont de gegevens in een venster en verstuurt niets.

### Zonder JavaScript

De vaste bedragen werken ook zonder JavaScript, want elke knop is een
submit-knop. Twee onderdelen hebben wel JavaScript nodig:

- het veld voor een ander bedrag;
- in ontwerp B en C: de projectcode (en in C het bedrag) van het gekozen
  cadeau meesturen.

Staat JavaScript in het code block niet toe? Laat het veld voor een ander
bedrag dan weg.

## Beperkingen

- **Fout.** Bij een fout stuurt de backend de donateur naar het oude
  formulier op appspot, met een melding.
- **Bedankpagina.** Na de betaling ziet de donateur de algemene bedankpagina
  op appspot, niet een pagina van de actie.
- **Minimum.** Een donatie is minimaal € 5.
- **Actieve projecten.** De backend weigert een project dat niet actief is.
- **Geen voortgang.** Een balk met het opgehaalde bedrag, zoals bij supp,
  vraagt een nieuwe route in de backend. Een statische pagina kent het totaal
  niet.
- **Testen in productie.** Elke test met een geldig bedrag maakt een donateur
  en een open betaling in de database. Breek de betaling af op de pagina van
  Mollie.

## Mogelijke uitbreidingen van de backend

Geen van deze uitbreidingen is nodig voor de eerste versie.

- Stuur bij een fout terug naar de actiepagina, met een parameter voor het
  adres om naar terug te gaan.
- Geef een eigen bedankpagina per actie.
- Geef een route met het opgehaalde totaal per project, voor een balk met de
  voortgang.
- Geef de donatie een kenmerk van de actie, zodat de opbrengst van de actie
  apart te zien is. In ontwerp B ziet de backend nu alleen het project en het
  bedrag, niet welke actie de donateur koos.

## Open punten

1. De projectcodes van Grace Home, Action Uruma, Gebed en Zending Paraguay
   en, voor ontwerp B, Myanmar. Die staan in de database, niet in de code.
2. De bedragen op de knoppen. In ontwerp B zijn de acties van Action Uruma
   en Gebed en Zending met hun bedragen een voorstel; de projecten moeten die
   controleren.
3. De teksten: de titel, de tekst over de actie en één zin per project.
4. De foto's. Action Uruma heeft nog geen foto.
5. De plek van de pagina: een code block op forerunner.info, of een iframe
   met de pagina elders.
6. De naam van de actie in de omschrijving van de betaling. Nu staat daar de
   projectcode met "Donatie".

## Prototype

Het prototype staat in de map `docs/supp/`. Open `docs/supp/index.html`
in een browser; een server is niet nodig. Op GitHub Pages staat het op
<https://hikariii.github.io/fr-donaties/supp/>, en
<https://hikariii.github.io/fr-donaties/> geeft een overzicht. Het prototype bestaat uit vier
bestanden en een map met foto's:

- `index.html` is de echte HTML van forerunner.info/ondersteunen,
  met de actiepagina in de iframe van het code block. Een balk met knoppen bovenaan wisselt
  tussen ontwerpen.
- `actie-supp.html` is ontwerp A, de actiepagina in de stijl van supp: kies
  een project en een bedrag.
- `actie-cadeaus.html` is ontwerp B: alleen vaste acties, zoals "Schoolgeld
  voor een jaar (€ 150)". Elke actie is een knop met het bedrag als `value`
  en de projectcode in `data-project`. Er is geen eigen bedrag.
- `actie-cadeau-eerst.html` is ontwerp C: dezelfde cadeaus als ontwerp B,
  maar eerst het cadeau en dan de gegevens. Een klik op een cadeau kiest het
  alleen; daarna vult de donateur naam en e-mailadres in en klikt op
  "Geef € …". Bedrag en projectcode staan in `data-bedrag` en `data-project`.
- `actie-d-*.html` tot en met `actie-l-*.html` zijn negen varianten van
  ontwerp C met dezelfde cadeaus en hetzelfde formulier, maar een andere
  indeling van de cadeaus: D fotocatalogus met filter, E menukaart, F tabs per
  project, G carrousel per project, H kerstlabels, I bento-grid,
  J magazine-zigzag, K projectkaarten met accordeon, L prijsladder (op bedrag
  in plaats van per project).
- `img/` bevat verkleinde kopieën van foto's uit de backend van Forerunner en
  van forerunner.info/kernprojecten (`india`, `myanmar`, `congo`, `paraguay-2`).

Zet een nieuw ontwerp naast ontwerp A met één regel in de lijst `ONTWERPEN`
in `index.html`.

Voor gebruik in productie:

1. Zet de echte projectcodes in de radioknoppen (ontwerp A) of in
   `data-project` van de cadeaus (ontwerp B en C).
2. Zet `PROTOTYPE` op `false`.
3. Vervang de teksten tussen `[ ]` en de foto's.
4. Test één donatie en breek de betaling af bij Mollie.
