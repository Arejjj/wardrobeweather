export const translations = {
  en: {
    // App
    appTitle: 'DressCast',
    appSubtitle: 'Dress for the day, not just the weather.',

    // Weather
    weatherRetry: 'Retry location',
    weatherCityPlaceholder: 'Or enter a city…',
    weatherDenied: 'Location access denied. Please allow access in your browser settings.',
    weatherUnavailable: 'Location could not be determined (GPS unavailable).',
    weatherTimeout: 'Location request timed out. Please try again.',
    weatherNoGeo: 'Your browser does not support location. Please enter a city.',
    weatherNoHttps: 'Location requires a secure connection (HTTPS). Please enter a city.',
    weatherError: 'Weather data could not be loaded.',
    weatherCityNotFound: (city) => `City "${city}" not found.`,

    // Daily curve
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    spreadLow: (spread) => `${spread}° swing today — layer up`,
    spreadHigh: (spread) => `${spread}° swing today — layer up`,
    layeringHint: 'Bring a layer you can peel off later',
    hourLabel: (h) => h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`,

    // Temp labels
    tempVeryCold: 'Very cold',
    tempCold: 'Cold',
    tempCool: 'Cool',
    tempMild: 'Mild',
    tempWarm: 'Warm',
    tempHot: 'Hot',

    // Outfit
    outfitTitle: "Today's Look",
    outfitSubtitle: (temp, condition) => `Picked for ${temp}° and ${String(condition).toLowerCase()}`,
    outfitEmpty: "Nothing in your wardrobe fits today's weather — try adding a few pieces.",
    outfitReshuffle: 'Shuffle',
    outfitStandard: 'Default',
    outfitRain: '🌧️ Rain',
    outfitLayering: 'Can remove',

    // Wardrobe
    wardrobeTitle: 'My Wardrobe',
    wardrobeAdd: 'Add',
    wardrobeEmpty: 'No items in this category.',
    wardrobeDefault: 'Default',
    wardrobeCustom: 'Custom',

    // Wardrobe filter
    filterTitle: 'Filter',
    filterAll: 'All',
    filterTempLabel: 'Temperature (°C)',
    filterWeather: 'Weather',
    filterWeatherAll: 'All',
    filterWeatherRain: '🌧️ Rain',
    filterWeatherSun: '☀️ Sun',
    filterWeatherCold: '❄️ Cold (< 5°)',
    filterWeatherWarm: '🌡️ Warm (> 20°)',
    filterReset: 'Reset',

    // Add item form
    formTitle: 'New Item',
    formName: 'Name',
    formNamePlaceholder: 'e.g. My favourite shirt',
    formCategory: 'Category',
    formPhoto: 'Photo (optional)',
    formPhotoChosen: '✓ Photo selected',
    formPhotoUpload: '📷 Upload',
    formTempMin: 'Min. temperature (°C)',
    formTempMax: 'Max. temperature (°C)',
    formTempError: 'Min. temperature must be lower than max. temperature.',
    formPhotoTooLarge: 'Photo must be under 5 MB.',
    formAdd: 'Add',
    formCancel: 'Cancel',

    // Onboarding
    onboardingWelcome: 'Welcome!',
    onboardingQuestion: 'Which clothing styles should be suggested to you?',
    onboardingFemale: 'Female',
    onboardingFemaleDesc: 'Dresses, skirts, blouses & more',
    onboardingMale: 'Male',
    onboardingMaleDesc: 'Shirts, trousers & classic looks',
    onboardingAll: 'All Styles',
    onboardingAllDesc: 'Show me everything, regardless of category',
    onboardingNote: 'You can change this anytime in settings.',

    // Category labels (DB values are German; these map them to display labels)
    categoryLabels: {
      'Oberteil':            'Top',
      'Pullover/Sweatshirt': 'Sweater',
      'Hose/Rock':           'Trousers/Skirt',
      'Kleid':               'Dress',
      'Jacke/Mantel':        'Jacket/Coat',
      'Thermolayer':         'Base layer',
      'Schuhe':              'Shoes',
      'Accessoire':          'Accessory',
    },

    // Accessibility labels
    ariaSignOut:       'Sign out',
    ariaRefreshWeather:'Refresh weather',
    ariaSearchCity:    'Search for city',
    ariaRemoveItem:    'Remove item',
    ariaChangeLocation:'Change location',

    // Nav
    navToday: 'Today',
    navWardrobe: 'Wardrobe',

    // WMO weather conditions
    wmo0: 'Clear',
    wmo1: 'Mainly clear',
    wmo2: 'Partly cloudy',
    wmo3: 'Overcast',
    wmo45: 'Fog',
    wmo48: 'Rime fog',
    wmo51: 'Light drizzle',
    wmo53: 'Drizzle',
    wmo55: 'Heavy drizzle',
    wmo61: 'Light rain',
    wmo63: 'Rain',
    wmo65: 'Heavy rain',
    wmo71: 'Light snow',
    wmo73: 'Snow',
    wmo75: 'Heavy snow',
    wmo80: 'Rain showers',
    wmo81: 'Rain showers',
    wmo82: 'Heavy showers',
    wmo95: 'Thunderstorm',
    wmo96: 'Thunderstorm w/ hail',
    wmo99: 'Severe thunderstorm',
  },

  de: {
    appTitle: 'DressCast',
    appSubtitle: 'Zieh dich für den Tag an — nicht nur fürs Wetter.',

    weatherRetry: 'Standort erneut versuchen',
    weatherCityPlaceholder: 'Oder Stadt eingeben…',
    weatherDenied: 'Standortzugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.',
    weatherUnavailable: 'Standort konnte nicht ermittelt werden (GPS nicht verfügbar).',
    weatherTimeout: 'Standort-Abfrage hat zu lange gedauert. Bitte erneut versuchen.',
    weatherNoGeo: 'Dein Browser unterstützt keine Standortermittlung. Bitte eine Stadt eingeben.',
    weatherNoHttps: 'Standortermittlung benötigt eine sichere Verbindung (HTTPS). Bitte eine Stadt eingeben.',
    weatherError: 'Wetterdaten konnten nicht geladen werden.',
    weatherCityNotFound: (city) => `Stadt "${city}" nicht gefunden.`,

    // Daily curve
    sunrise: 'Sonnenaufgang',
    sunset: 'Sonnenuntergang',
    spreadLow: (spread) => `${spread}° Unterschied heute — in Schichten kleiden`,
    spreadHigh: (spread) => `${spread}° Unterschied heute — in Schichten kleiden`,
    layeringHint: 'Nimm eine Schicht mit, die du später ablegen kannst',
    hourLabel: (h) => `${String(h).padStart(2, '0')}:00`,

    tempVeryCold: 'Sehr kalt',
    tempCold: 'Kalt',
    tempCool: 'Kühl',
    tempMild: 'Mild',
    tempWarm: 'Warm',
    tempHot: 'Heiß',

    outfitTitle: 'Dein Look für heute',
    outfitSubtitle: (temp, condition) => `Zusammengestellt für ${temp}° und ${String(condition).toLowerCase()}`,
    outfitEmpty: 'Dein Schrank hat heute nichts Passendes — füg doch ein paar Teile hinzu.',
    outfitReshuffle: 'Neu',
    outfitStandard: 'Standard',
    outfitRain: '🌧️ Regen',
    outfitLayering: 'Ablegbar',

    wardrobeTitle: 'Meine Garderobe',
    wardrobeAdd: 'Hinzufügen',
    wardrobeEmpty: 'Keine Kleidungsstücke in dieser Kategorie.',
    wardrobeDefault: 'Standard',
    wardrobeCustom: 'Eigenes',

    filterTitle: 'Filter',
    filterAll: 'Alle',
    filterTempLabel: 'Temperatur (°C)',
    filterWeather: 'Wetter',
    filterWeatherAll: 'Alle',
    filterWeatherRain: '🌧️ Regen',
    filterWeatherSun: '☀️ Sonne',
    filterWeatherCold: '❄️ Kalt (< 5°)',
    filterWeatherWarm: '🌡️ Warm (> 20°)',
    filterReset: 'Zurücksetzen',

    formTitle: 'Neues Kleidungsstück',
    formName: 'Name',
    formNamePlaceholder: 'z.B. Mein Lieblingsshirt',
    formCategory: 'Kategorie',
    formPhoto: 'Foto (optional)',
    formPhotoChosen: '✓ Foto gewählt',
    formPhotoUpload: '📷 Hochladen',
    formTempMin: 'Min. Temperatur (°C)',
    formTempMax: 'Max. Temperatur (°C)',
    formTempError: 'Mindesttemperatur muss kleiner als Höchsttemperatur sein.',
    formPhotoTooLarge: 'Foto muss kleiner als 5 MB sein.',
    formAdd: 'Hinzufügen',
    formCancel: 'Abbrechen',

    onboardingWelcome: 'Willkommen!',
    onboardingQuestion: 'Welche Kleidungsstücke sollen dir vorgeschlagen werden?',
    onboardingFemale: 'Weiblich',
    onboardingFemaleDesc: 'Kleider, Röcke, Blusen & mehr',
    onboardingMale: 'Männlich',
    onboardingMaleDesc: 'Hemden, Hosen & klassische Looks',
    onboardingAll: 'Alle Styles',
    onboardingAllDesc: 'Zeig mir alles, egal welche Kategorie',
    onboardingNote: 'Du kannst das jederzeit in den Einstellungen ändern.',

    // Category labels (DB values are German; identity mapping for DE)
    categoryLabels: {
      'Oberteil':            'Oberteil',
      'Pullover/Sweatshirt': 'Pullover/Sweatshirt',
      'Hose/Rock':           'Hose/Rock',
      'Kleid':               'Kleid',
      'Jacke/Mantel':        'Jacke/Mantel',
      'Thermolayer':         'Thermolayer',
      'Schuhe':              'Schuhe',
      'Accessoire':          'Accessoire',
    },

    // Accessibility labels
    ariaSignOut:       'Abmelden',
    ariaRefreshWeather:'Wetter aktualisieren',
    ariaSearchCity:    'Stadt suchen',
    ariaRemoveItem:    'Kleidungsstück entfernen',
    ariaChangeLocation:'Standort ändern',

    navToday: 'Heute',
    navWardrobe: 'Garderobe',

    wmo0: 'Klar',
    wmo1: 'Überwiegend klar',
    wmo2: 'Teilweise bewölkt',
    wmo3: 'Bedeckt',
    wmo45: 'Nebel',
    wmo48: 'Reifnebel',
    wmo51: 'Leichter Nieselregen',
    wmo53: 'Nieselregen',
    wmo55: 'Starker Nieselregen',
    wmo61: 'Leichter Regen',
    wmo63: 'Regen',
    wmo65: 'Starker Regen',
    wmo71: 'Leichter Schnee',
    wmo73: 'Schnee',
    wmo75: 'Starker Schnee',
    wmo80: 'Regenschauer',
    wmo81: 'Regenschauer',
    wmo82: 'Starke Regenschauer',
    wmo95: 'Gewitter',
    wmo96: 'Gewitter mit Hagel',
    wmo99: 'Schweres Gewitter',
  },
}

export function detectLanguage() {
  const lang = navigator.language || navigator.languages?.[0] || 'en'
  return lang.toLowerCase().startsWith('de') ? 'de' : 'en'
}
