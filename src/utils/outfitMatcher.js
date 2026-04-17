import { CATEGORIES } from '../data/defaultWardrobe'

// Filtert Items nach Temperatur, Regen und Gender
function filterCandidates(items, category, weather, gender) {
  const { temp, rain } = weather
  return items.filter(item => {
    if (item.category !== category) return false
    if (temp < item.tempMin || temp > item.tempMax) return false
    if (item.rain && !rain) return false
    // Gender-Filter: 'all' passt immer, sonst nur gleiche Gender
    if (item.gender && item.gender !== 'all' && item.gender !== gender) return false
    return true
  })
}

// shuffleIndex: 0 = Standard (bevorzugt custom), >0 = andere Kombinationen
export function matchOutfit(items, weather, gender = 'all', shuffleIndex = 0) {
  const { temp, rain } = weather

  const outfit = []

  function pickItem(category, offset = 0) {
    const candidates = filterCandidates(items, category, weather, gender)
    if (!candidates.length) return null
    // Custom Items bevorzugen
    const sorted = [...candidates].sort((a, b) => {
      if (!a.isDefault && b.isDefault) return -1
      if (a.isDefault && !b.isDefault) return 1
      return 0
    })
    // shuffleIndex rotiert durch die Kandidaten
    return sorted[(shuffleIndex + offset) % sorted.length]
  }

  // Kleider als Alternative zu Oberteil+Hose bei Wärme (nur weiblich/all)
  if (temp >= 20 && (gender === 'female' || gender === 'all')) {
    const dressCandidates = filterCandidates(items, CATEGORIES.DRESS, weather, gender)
    // Bei shuffleIndex ungerade: Kleid vorziehen wenn vorhanden
    if (dressCandidates.length && shuffleIndex % 2 === 1) {
      const dress = dressCandidates[shuffleIndex % dressCandidates.length]
      outfit.push(dress)
      const outer = pickItem(CATEGORIES.OUTERWEAR)
      if (outer) outfit.push(outer)
      const shoes = pickItem(CATEGORIES.SHOES, shuffleIndex)
      if (shoes) outfit.push(shoes)
      const acc = pickItem(CATEGORIES.ACCESSORY)
      if (acc) outfit.push(acc)
      return outfit
    }
  }

  // Standard-Flow
  const orderedCategories = [
    CATEGORIES.THERMAL,
    CATEGORIES.TOP,
    CATEGORIES.SWEATER,
    CATEGORIES.OUTERWEAR,
    CATEGORIES.BOTTOM,
    CATEGORIES.SHOES,
    CATEGORIES.ACCESSORY,
  ]

  for (const cat of orderedCategories) {
    // Für Reshuffle: Schuhe und Hosen rotieren
    const offset = [CATEGORIES.SHOES, CATEGORIES.BOTTOM, CATEGORIES.TOP, CATEGORIES.SWEATER].includes(cat)
      ? shuffleIndex
      : 0
    const item = pickItem(cat, offset)
    if (item) outfit.push(item)
  }

  // Bei Regen Regenjacke sicherstellen
  if (rain) {
    const hasRainGear = outfit.some(i => i.rain && i.category === CATEGORIES.OUTERWEAR)
    if (!hasRainGear) {
      const rainJacket = items.find(i =>
        i.rain && i.category === CATEGORIES.OUTERWEAR &&
        temp >= i.tempMin && temp <= i.tempMax
      )
      if (rainJacket) outfit.push(rainJacket)
    }
  }

  return outfit
}

export function getTempLabel(temp, t) {
  if (temp < 0)  return { label: t?.tempVeryCold ?? 'Very cold', color: 'text-blue-600',   bg: 'bg-blue-50' }
  if (temp < 8)  return { label: t?.tempCold     ?? 'Cold',      color: 'text-blue-500',   bg: 'bg-blue-50' }
  if (temp < 15) return { label: t?.tempCool     ?? 'Cool',      color: 'text-cyan-600',   bg: 'bg-cyan-50' }
  if (temp < 22) return { label: t?.tempMild     ?? 'Mild',      color: 'text-green-600',  bg: 'bg-green-50' }
  if (temp < 28) return { label: t?.tempWarm     ?? 'Warm',      color: 'text-orange-500', bg: 'bg-orange-50' }
  return           { label: t?.tempHot           ?? 'Hot',       color: 'text-red-500',    bg: 'bg-red-50' }
}
