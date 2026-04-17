# WardrobeWeather 👗🌤️

Eine Web-App, die dir jeden Morgen ein passendes Outfit vorschlägt – basierend auf dem aktuellen Wetter an deinem Standort.

## Features

- **Echtzeit-Wetterdaten** via [Open-Meteo](https://open-meteo.com/) (kostenlos, kein API-Key nötig)
- **Standort-Erkennung** per GPS oder manuelle Stadtsuche als Fallback
- **Intelligente Outfit-Vorschläge** – passend zu Temperatur, Bewölkung und Regen
- **Starter-Garderobe** – 26 Standard-Items sind sofort beim ersten Start vorhanden, kein Setup nötig
- **Eigene Kleidung** – Items mit Foto, Kategorie und Temperaturbereich hinzufügen
- **Reshuffle** – mit einem Klick einen alternativen Outfit-Vorschlag generieren
- **Gender-Filter** – weiblich, männlich oder alle Styles
- **Vollständig offline-fähig** – alle Daten im `localStorage`, keine Datenbank nötig

## Tech Stack

| Bereich | Technologie |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Wetter API | Open-Meteo |
| Geocoding | Open-Meteo Geocoding + Nominatim |
| Datenspeicherung | localStorage (Browser) |

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build
```

## Projektstruktur

```
src/
├── components/
│   ├── GenderOnboarding.jsx   # Erster Start: Gender-Auswahl
│   ├── WeatherCard.jsx        # Wetter-Anzeige + Stadtsuche
│   ├── OutfitSuggestion.jsx   # Tagesvorschlag + Reshuffle
│   └── WardrobeView.jsx       # Garderobe verwalten
├── hooks/
│   ├── useWeather.js          # Open-Meteo Integration
│   ├── useWardrobe.js         # localStorage Garderobe
│   └── useGender.js           # Gender-Präferenz
├── utils/
│   └── outfitMatcher.js       # Outfit-Matching Logik
└── data/
    └── defaultWardrobe.js     # 26 Standard-Kleidungsstücke
```

## Outfit-Logik

Die App wählt pro Kategorie (Oberteil, Hose, Jacke, Schuhe, Accessoire) das am besten passende Item basierend auf:

- **Temperatur** – jedes Item hat einen `tempMin`/`tempMax` Bereich
- **Regen** – Regenjacke und wasserfeste Schuhe werden bei Niederschlag priorisiert
- **Gender** – Items sind mit `all`, `female` oder `male` getaggt
- **Eigene Items** – personalisierte Items werden gegenüber Standard-Items bevorzugt

## Roadmap

- [ ] Outfit-History (gespeicherte Outfits der letzten Tage)
- [ ] 7-Tage Wochenvorschau
- [ ] Standard-Item durch eigenes Foto ersetzen
- [ ] Supabase Backend + Auth (Multi-Device Sync)
- [ ] KI-Outfit-Kombinationen via Claude API
