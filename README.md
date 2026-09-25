# Ravn InDesign WCAG Contrast Checker

Een zwevend paneel voor Adobe InDesign dat het kleurcontrast van tekst direct toetst aan de WCAG-richtlijnen. Selecteer een tekstkader en je ziet meteen of de combinatie van tekst- en achtergrondkleur voldoet, zonder het document te verlaten of een export te draaien.

## Wat het doet

- Berekent de contrastverhouding tussen tekstkleur en achtergrond volgens de WCAG-formule voor relatieve luminantie.
- Toetst op niveau **AA** of **AAA**, met de juiste drempel voor normale en grote tekst.
- Werkt live: bij elke nieuwe selectie wordt het resultaat bijgewerkt.
- Leest RGB-, CMYK- en Lab-kleuren en rekent ze om naar RGB.
- Controleert alle opmaakfragmenten in een tekstkader en toont het slechtste resultaat.
- Herkent verloopkleuren en houdt die buiten de meting, met een waarschuwing.

### Drempelwaarden

| Niveau | Normale tekst | Grote tekst |
| ------ | ------------- | ----------- |
| AA     | 4,5 : 1       | 3 : 1       |
| AAA    | 7 : 1         | 4,5 : 1     |

Tekst geldt als groot vanaf 18 pt, of vanaf 14 pt wanneer het lettertype vet is.

## Installatie

1. Download `Ravn-InDesign-WCAG_Contrast_checker.jsx` uit deze repository.
2. Open InDesign en ga naar **Venster > Hulpprogramma's > Scripts**.
3. Klik in het Scripts-paneel met de rechtermuisknop op **Gebruiker** en kies **Tonen in Finder** (macOS) of **Tonen in Verkenner** (Windows).
4. Zet het `.jsx`-bestand in de map die opent.
5. Het script staat nu onder **Gebruiker** in het Scripts-paneel. Dubbelklik om het te starten.

Het paneel blijft open terwijl je verder werkt. Start je het script nog een keer terwijl het paneel open staat, dan krijg je een melding dat het al actief is.

## Gebruik

Er zijn twee manieren om te meten:

**Eén object selecteren.** Kies een tekstkader of een stuk tekst. Het script zoekt zelf de achtergrond: eerst de eigen vulling van het kader, daarna het achterliggende object dat overlapt (op basis van stapelvolgorde). Vindt het niets, dan wordt wit als paginakleur aangenomen.

**Twee objecten selecteren.** Shift-klik een tekstkader en een achtergrondobject. Dit is de meest betrouwbare methode, omdat je zelf aanwijst welke vulling als achtergrond telt.

### Bediening

| Optie             | Werking                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| On/Off            | Automatisch controleren bij elke selectie, of handmatig via *Check nu*.  |
| AA / AAA          | Kiest het WCAG-niveau waaraan wordt getoetst.                            |
| Verloop-detectie  | Laat verlopen herkennen en overslaan in plaats van ze als grijs te benaderen. |
| ?                 | Toont een korte uitleg in het paneel zelf.                               |

### Resultaat

Het paneel toont de gemeten verhouding, de vereiste verhouding, de tekstkleur, de vulling en de rand van het kader, en een korte bronregel met het gecontroleerde tekstfragment. Groen betekent dat het contrast voldoet, rood dat het tekortschiet.

## Beperkingen

- Het script meet vlakke kleuren. Foto's, transparantie, overlays en effecten achter de tekst worden niet meegenomen.
- Bij één geselecteerd object is de achtergrond een schatting op basis van stapelvolgorde en overlap. Selecteer bij twijfel het achtergrondobject erbij.
- Verlopen kunnen niet betrouwbaar worden gemeten en worden overgeslagen.
- Wit wordt als paginakleur aangenomen als er geen achtergrond wordt gevonden.

## Branches

| Branch | Bestand                                   | Doel                                |
| ------ | ----------------------------------------- | ----------------------------------- |
| `main` | `Ravn-InDesign-WCAG_Contrast_checker.jsx` | Stabiele versie                     |
| `dev`  | `Ravn-InDesign-WCAG_Contrast_checker.jsx` | Ontwikkelversie met nieuwe functies |

Het bestand heet op beide branches hetzelfde. De versie op `dev` voegt een tweede tab toe, **Document**, met drie controles op documentniveau:

- of het document is opgeslagen en dus een naam heeft;
- of alle tekst een ingestelde taal heeft;
- of alle alineastijlen een PDF-exporttag hebben.

Deze functies kunnen nog veranderen en zijn nog niet in de stabiele versie opgenomen.

## Licentie

Uitgebracht onder de GNU General Public License v2. Zie [LICENSE](LICENSE).
