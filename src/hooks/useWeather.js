import { useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

// WMO code → { icon, rain, labelKey } — label resolved at render time via t()
const WMO_CODES = {
  0:  { icon: '☀️',  rain: false, labelKey: 'wmo0'  },
  1:  { icon: '🌤️', rain: false, labelKey: 'wmo1'  },
  2:  { icon: '⛅',  rain: false, labelKey: 'wmo2'  },
  3:  { icon: '☁️',  rain: false, labelKey: 'wmo3'  },
  45: { icon: '🌫️', rain: false, labelKey: 'wmo45' },
  48: { icon: '🌫️', rain: false, labelKey: 'wmo48' },
  51: { icon: '🌧️', rain: true,  labelKey: 'wmo51' },
  53: { icon: '🌧️', rain: true,  labelKey: 'wmo53' },
  55: { icon: '🌧️', rain: true,  labelKey: 'wmo55' },
  61: { icon: '🌧️', rain: true,  labelKey: 'wmo61' },
  63: { icon: '🌧️', rain: true,  labelKey: 'wmo63' },
  65: { icon: '🌧️', rain: true,  labelKey: 'wmo65' },
  71: { icon: '🌨️', rain: false, labelKey: 'wmo71' },
  73: { icon: '❄️',  rain: false, labelKey: 'wmo73' },
  75: { icon: '❄️',  rain: false, labelKey: 'wmo75' },
  80: { icon: '🌦️', rain: true,  labelKey: 'wmo80' },
  81: { icon: '🌦️', rain: true,  labelKey: 'wmo81' },
  82: { icon: '⛈️', rain: true,  labelKey: 'wmo82' },
  95: { icon: '⛈️', rain: true,  labelKey: 'wmo95' },
  96: { icon: '⛈️', rain: true,  labelKey: 'wmo96' },
  99: { icon: '⛈️', rain: true,  labelKey: 'wmo99' },
}

// Open-Meteo benennt das Feld je nach API-Version unterschiedlich
function extractWeatherCode(current) {
  return current.weather_code ?? current.weathercode ?? 0
}

function resolveWmo(code, lang = 'en') {
  const wmo = WMO_CODES[code] ?? { icon: '🌡️', rain: false, labelKey: null }
  const t = translations[lang] ?? translations.en
  return { ...wmo, label: wmo.labelKey ? (t[wmo.labelKey] ?? wmo.labelKey) : 'Unknown' }
}

async function fetchWeatherData(lat, lon, lang = 'en') {
  // Beide Feldnamen anfragen für maximale Kompatibilität
  const url = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,weathercode,windspeed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,weathercode` +
    `&timezone=auto&forecast_days=1`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Wetterdaten konnten nicht geladen werden.')
  const data = await res.json()

  const code = extractWeatherCode(data.current)
  const wmo  = resolveWmo(code, lang)

  return {
    temp:      Math.round(data.current.temperature_2m),
    tempMax:   Math.round(data.daily.temperature_2m_max[0]),
    tempMin:   Math.round(data.daily.temperature_2m_min[0]),
    condition: wmo.label,
    conditionKey: wmo.labelKey,
    icon:      wmo.icon,
    rain:      wmo.rain,
    windspeed: Math.round(data.current.windspeed_10m),
  }
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'de' } }
    )
    const data = await res.json()
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      'Dein Standort'
    )
  } catch {
    return 'Dein Standort'
  }
}

export function useWeather(lang = 'en') {
  const [weather,  setWeather]  = useState(null)
  const [location, setLocation] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const t = translations[lang] ?? translations.en

  function geoErrorMessage(err) {
    switch (err?.code) {
      case 1: return t.weatherDenied
      case 2: return t.weatherUnavailable
      case 3: return t.weatherTimeout
      default: return t.weatherNoGeo
    }
  }

  async function fetchByCity(cityName) {
    setLoading(true)
    setError(null)
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=${lang}&format=json`
      )
      const geoData = await geoRes.json()
      if (!geoData.results?.length) throw new Error(t.weatherCityNotFound(cityName))
      const { latitude, longitude, name } = geoData.results[0]
      const weatherData = await fetchWeatherData(latitude, longitude, lang)
      setWeather(weatherData)
      setLocation(name)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Re-resolve weather condition label when language changes
  function relabelWeather(lang) {
    setWeather(prev => {
      if (!prev || !prev.conditionKey) return prev
      const wmo = resolveWmo(
        Object.keys(WMO_CODES).find(k => WMO_CODES[k].labelKey === prev.conditionKey),
        lang
      )
      return { ...prev, condition: wmo.label }
    })
  }

  function requestLocation() {
    if (!navigator?.geolocation) {
      setError(t.weatherNoGeo)
      setLoading(false)
      return
    }
    const isSecure = window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    if (!isSecure) {
      setError(t.weatherNoHttps)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        try {
          const [weatherData, cityName] = await Promise.all([
            fetchWeatherData(lat, lon, lang),
            reverseGeocode(lat, lon),
          ])
          setWeather(weatherData)
          setLocation(cityName)
          setError(null)
        } catch (e) {
          setError(e.message)
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setError(geoErrorMessage(err))
        setLoading(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  }

  useEffect(() => { requestLocation() }, [])

  // When language switches, re-label the condition string without re-fetching
  useEffect(() => { relabelWeather(lang) }, [lang])

  return { weather, location, loading, error, refetch: requestLocation, fetchByCity }
}
