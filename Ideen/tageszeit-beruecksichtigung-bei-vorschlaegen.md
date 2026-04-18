# Idee: Tageszeit bei Kleidungsvorschlägen berücksichtigen

## Kerngedanke

Die App sollte beim Erstellen von Kleidungsvorschlägen die aktuelle Uhrzeit berücksichtigen. Nutzer öffnen die App nicht ausschließlich morgens – sie können auch mittags oder nachmittags reinschauen.

## Problem

Aktuell werden Vorschläge möglicherweise unabhängig davon gemacht, wann der Nutzer die App öffnet. Wenn jemand die App z. B. um 15 Uhr öffnet, sind Vorschläge für den Morgen (z. B. „Was ziehe ich heute früh an?") nicht mehr relevant.

## Vorschlag

- Vorschläge sollten **zeitlich angepasst** sein: Nur Empfehlungen für Tagesabschnitte anzeigen, die noch bevorstehen.
- Beispiel: App-Öffnung um 14 Uhr → kein Vorschlag für „morgens", ggf. noch für „nachmittags" und „abends".
- Ebenso sollte bedacht werden, dass man **nicht den ganzen Tag draußen** ist – die Wetterbedingungen für den gesamten Tag sind nicht unbedingt alle relevant.

## Mögliche Umsetzung

- Aktuelle Uhrzeit beim Öffnen der App auslesen
- Tagesabschnitte definieren (z. B. Morgen: 6–12 Uhr, Mittag: 12–17 Uhr, Abend: 17–22 Uhr)
- Nur noch bevorstehende oder aktuelle Abschnitte in die Vorschlagslogik einbeziehen
- Optional: Nutzer kann angeben, wann er das Haus verlässt und wann er zurückkommt
