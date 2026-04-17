import { CATEGORIES } from '../data/defaultWardrobe'

/**
 * Outfit matching mit Tagesverlauf-Bewusstsein.
 *
 * Strategie:
 * - Basis-Layer (T-Shirt, Hose) → nach tempMax (wärmster Punkt des Tages)
 * - Außenschicht (Jacke) → nach tempMin (kältester Punkt, meist morgens)
 * - Schuhe → nach tempMin (man verlässt morgens das Haus)
 * - Accessoires (Schal, Mütze) → nach tempMin
 * - Bei spread ≥ 10°: Mid-Layer (Cardigan/Pullover) erzwingen als ablegbare Schicht
 * - Bei spread ≥ 10° + tempMax > 18°: Leichte Übergangsjacke statt Winterjacke bevorzugen
 */

function filterCandidates(items, category, temp, rain, gender) {
  return items.filter(item => {
    if (item.category !== category) return false
    if (temp < item.tempMin || temp > item.tempMax) return false
    if (item.rain && !rain) return false
    if (item.gender && item.gender !== 'all' && item.gender !== gender) return false
    return true
  })
}

function pickBest(candidates, shuffleOffset = 0) {
  if (!candidates.length) return null
  const sorted = [...candidates].sort((a, b) => {
    if (!a.isDefault && b.isDefault) return -1
    if (a.isDefault && !b.isDefault) return 1
    return 0
  })
  return sorted[shuffleOffset % sorted.length]
}

export function matchOutfit(items, weather, gender = 'all', shuffleIndex = 0) {
  const {
    temp,
    tempMin  = temp,
    tempMax  = temp,
    spread   = 0,
    rain     = false,
  } = weather

  const needsLayering = spread >= 10
  const outfit = []

  // ── Thermal base (only if very cold morning) ─────────────────────────────
  const thermalCandidates = filterCandidates(items, CATEGORIES.THERMAL, tempMin, false, gender)
  const thermal = pickBest(thermalCandidates)
  if (thermal) outfit.push(thermal)

  // ── Top — based on tempMax (what you'll actually feel during the day) ─────
  const topCandidates = filterCandidates(items, CATEGORIES.TOP, tempMax, false, gender)
  const top = pickBest(topCandidates, shuffleIndex)
  if (top) outfit.push(top)

  // ── Mid layer (Sweater/Cardigan) ──────────────────────────────────────────
  // Always suggest if tempMin is cool, OR force it as a carry-along when big spread
  const sweatTemp = needsLayering ? Math.max(tempMin, tempMax - 8) : tempMin
  const sweatCandidates = filterCandidates(items, CATEGORIES.SWEATER, sweatTemp, false, gender)
  const sweater = pickBest(sweatCandidates, shuffleIndex)
  if (sweater) outfit.push({ ...sweater, layeringItem: needsLayering && tempMax > 18 })

  // ── Outerwear — based on tempMin (leaving the house) ─────────────────────
  // With big spread + warm afternoon: prefer lighter jacket
  let outerCandidates = filterCandidates(items, CATEGORIES.OUTERWEAR, tempMin, false, gender)
  if (needsLayering && tempMax > 18) {
    // Prefer transition jacket over winter jacket if available
    const light = outerCandidates.filter(i => !i.tags?.includes('warm'))
    if (light.length) outerCandidates = light
  }
  const outer = pickBest(outerCandidates, shuffleIndex)
  if (outer) outfit.push({ ...outer, layeringItem: needsLayering && tempMax > 18 })

  // ── Rain gear ─────────────────────────────────────────────────────────────
  if (rain) {
    const hasRainJacket = outfit.some(i => i.rain && i.category === CATEGORIES.OUTERWEAR)
    if (!hasRainJacket) {
      const rainJacket = items.find(i =>
        i.rain && i.category === CATEGORIES.OUTERWEAR &&
        temp >= i.tempMin && temp <= i.tempMax
      )
      if (rainJacket) outfit.push(rainJacket)
    }
  }

  // ── Bottom — based on tempMax ─────────────────────────────────────────────
  // Dress as alternative for warm days (female/all)
  if (tempMax >= 20 && (gender === 'female' || gender === 'all')) {
    const dressCandidates = filterCandidates(items, CATEGORIES.DRESS, tempMax, false, gender)
    if (dressCandidates.length && shuffleIndex % 2 === 1) {
      const dress = pickBest(dressCandidates, shuffleIndex)
      if (dress) { outfit.push(dress); }
    } else {
      const bottom = pickBest(filterCandidates(items, CATEGORIES.BOTTOM, tempMax, false, gender), shuffleIndex)
      if (bottom) outfit.push(bottom)
    }
  } else {
    const bottom = pickBest(filterCandidates(items, CATEGORIES.BOTTOM, tempMax, false, gender), shuffleIndex)
    if (bottom) outfit.push(bottom)
  }

  // ── Shoes — based on tempMin (morning conditions) ────────────────────────
  let shoeCandidates = filterCandidates(items, CATEGORIES.SHOES, tempMin, false, gender)
  if (rain) {
    const rainShoes = shoeCandidates.filter(i => i.rain)
    if (rainShoes.length) shoeCandidates = rainShoes
  }
  const shoes = pickBest(shoeCandidates, shuffleIndex)
  if (shoes) outfit.push(shoes)

  // ── Accessories — based on tempMin ────────────────────────────────────────
  const accCandidates = filterCandidates(items, CATEGORIES.ACCESSORY, tempMin, rain, gender)
  const acc = pickBest(accCandidates, shuffleIndex)
  if (acc) outfit.push(acc)

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
