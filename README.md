# fr-donaties
fr-donatie testform

https://hikariii.github.io/fr-donaties/

## Productie: `docs/live/`

> **Let op:** de pagina's in `docs/live/` draaien in productie op
> forerunner.info en ontvangen echte donaties. Wijzig ze alleen volgens
> [`docs/live/README.md`](docs/live/README.md).

| Pagina | Adres |
| --- | --- |
| Grace Home (FR230), eenmalig | `https://hikariii.github.io/fr-donaties/live/grace-home/` |
| Grace Home (FR230), maandelijks | `https://hikariii.github.io/fr-donaties/live/grace-home/maandelijks.html` |

Alle andere mappen in `docs/` zijn ontwerpen en prototypes.

## Plan: meerdere pagina's in `docs/`

Dit plan is deels uitgevoerd: het formulier staat in `docs/doneer/` en de
ontwerpen in `docs/supp/`. De map `docs/` krijgt ruimte voor meerdere
donatiepagina's naast elkaar. GitHub Pages bedient de map `docs/`, dus elke
pagina krijgt een eigen adres onder `https://hikariii.github.io/fr-donaties/`.

### De huidige situatie

GitHub Pages publiceert de map `docs/` van `main`.

| Pagina | Map | Adres |
| --- | --- | --- |
| Overzicht | `docs/index.html` | `/fr-donaties/` |
| Donatieformulier | `docs/doneer/` | `/fr-donaties/doneer/` |
| Kerstactie, ontwerp A t/m L in de omlijsting van forerunner.info | `docs/supp/index.html` | `/fr-donaties/supp/` |

- `docs/doneer/` is het prototype van het donatieformulier, met eigen `css/`,
  `js/` en `img/`. De backend van Forerunner gebruikt dat formulier nu als
  `/donate` op appspot. De foto's in `docs/doneer/img/` zijn groot, tot 3 MB
  per foto. Dat is te veel voor een pagina op mobiel.
- `docs/supp/` bevat de ontwerpen voor de kerstactie. `supp.md` beschrijft het
  idee van die pagina's.
- `docs/.nojekyll` zorgt dat GitHub Pages de bestanden publiceert zoals ze zijn.

### De nieuwe opbouw

```
docs/
  index.html              overzicht met een link naar elke pagina
  forerunner-pagina.html  nagebootste pagina van forerunner.info met een iframe
  gedeeld/
    css/basis.css         kleuren en lettertype van forerunner.info
    img/                  verkleinde foto's, voor alle pagina's
  formulier/
    index.html            het huidige donatieformulier
    css/  js/
  supp/
    index.html            de actiepagina in de stijl van supp
```

De adressen worden dan:

| Pagina | Adres |
| --- | --- |
| Overzicht | `/fr-donaties/` |
| Donatieformulier | `/fr-donaties/formulier/` |
| Actiepagina zoals supp | `/fr-donaties/supp/` |
| Een pagina in de omlijsting van forerunner.info | `/fr-donaties/forerunner-pagina.html?ontwerp=supp/` |

Afspraken voor de opbouw:

- Elke pagina krijgt een eigen map met een `index.html`. Zo is het adres kort.
- Elke pagina werkt los, en ook in de iframe van `forerunner-pagina.html`.
- Een pagina gebruikt alleen relatieve paden. De pagina werkt dan ook lokaal,
  zonder server.
- Een foto staat één keer in `docs/gedeeld/img/`, verkleind tot hooguit
  1600 pixels breed.
- Een pagina zonder echte projectcodes staat in de prototypemodus. Die
  pagina verstuurt niets naar productie.

### Stappen

1. Verplaats `docs/index.html`, `docs/css/` en `docs/js/` naar
   `docs/formulier/`.
2. Verklein de foto's en zet ze in `docs/gedeeld/img/`. Pas de paden in het
   donatieformulier aan.
3. Haal de kleuren en het lettertype uit de twee pagina's en zet ze in
   `docs/gedeeld/css/basis.css`.
4. Verplaats `supp/actie-supp.html` naar `docs/supp/index.html` en
   `supp/img/` naar `docs/gedeeld/img/`.
5. Verplaats `supp/forerunner-pagina.html` naar
   `docs/forerunner-pagina.html`. Zet beide pagina's in de lijst `ONTWERPEN`.
6. Maak `docs/index.html` als overzicht. Geef per pagina een link, een korte
   uitleg en een link naar de pagina in de omlijsting van forerunner.info.
7. Verwijder de lege map `supp/`.
8. Controleer elke pagina op mobiel en op desktop, lokaal en op GitHub Pages.

### Gevolg voor het bestaande adres

`https://hikariii.github.io/fr-donaties/` toont nu het donatieformulier. Na
deze wijziging toont dat adres het overzicht. Het formulier staat dan op
`/fr-donaties/formulier/`. Werk een link naar het oude adres bij.

Copyright S. de Rooij
