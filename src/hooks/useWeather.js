import { useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

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

function extractWeatherCode(current) {
  return current.weather_code ?? current.weathercode ?? 0
}

function resolveWmo(code, lang = 'en') {
  const wmo = WMO_CODES[code] ?? { icon: '🌡️', rain: false, labelKey: null }
  const t = translations[lang] ?? translations.en
  return { ...wmo, label: wmo.labelKey ? (t[wmo.labelKey] ?? wmo.labelKey) : 'Unknown' }
}

// Extract hourly temps for today at display hours: 6,9,12,15,18,21
function extractHourlyTemps(hourlyData, timezoneOffset) {
  const displayHours = [6, 9, 12, 15, 18, 21]
  const times = hourlyData.time        // ISO strings like "2024-04-17T06:00"
  const temps = hourlyData.temperature_2m

  // Use local date (not UTC) to match the API's timezone=auto times
  const today = new Date()
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')

  return displayHours.map(h => {
    const target = `${todayStr}T${String(h).padStart(2, '0')}:00`
    const idx = times.indexOf(target)
    return {
      hour: h,
      temp: idx >= 0 ? Math.round(temps[idx]) : null,
    }
  }).filter(p => p.temp !== null)
}

async function fetchWeatherData(lat, lon, lang = 'en') {
  const url = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,weathercode,windspeed_10m` +
    `&hourly=temperature_2m` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,weathercode,sunrise,sunset` +
    `&timezone=auto&forecast_days=1`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather data could not be loaded.')
  const data = await res.json()

  const code = extractWeatherCode(data.current)
  const wmo  = resolveWmo(code, lang)

  const tempMax = Math.round(data.daily.temperature_2m_max[0])
  const tempMin = Math.round(data.daily.temperature_2m_min[0])
  const hourlyTemps = extractHourlyTemps(data.hourly, data.utc_offset_seconds)

  // Peak hour = hour of day with highest temp (approx from hourly)
  const peakHour = hourlyTemps.reduce((best, p) => p.temp > best.temp ? p : best, hourlyTemps[0] ?? { hour: 14, temp: tempMax })

  return {
    temp:         Math.round(data.current.temperature_2m),
    tempMax,
    tempMin,
    spread:       tempMax - tempMin,          // Temperaturschwankung des Tages
    peakHour:     peakHour.hour,              // Tageszeit mit höchster Temperatur
    hourlyTemps,                              // [{hour, temp}, ...] für Chart
    condition:    wmo.label,
    conditionKey: wmo.labelKey,
    icon:         wmo.icon,
    rain:         wmo.rain,
    windspeed:    Math.round(data.current.windspeed_10m),
    sunrise:      data.daily.sunrise?.[0]?.slice(11, 16) ?? null,  // "06:42"
    sunset:       data.daily.sunset?.[0]?.slice(11, 16)  ?? null,  // "20:15"
  }
}

async function reverseGeocode(lat, lon, lang = 'en') {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: {
        'Accept-Language': lang,
        'User-Agent': 'DressCast/1.0 (https://github.com/wardrobeweather)',
      }}
    )
    const data = await res.json()
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      'Your location'
    )
  } catch {
    return 'Your location'
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
      setError(t.weatherNoGeo); setLoading(false); return
    }
    const isSecure = window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    if (!isSecure) {
      setError(t.weatherNoHttps); setLoading(false); return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        try {
          const [weatherData, cityName] = await Promise.all([
            fetchWeatherData(lat, lon, lang),
            reverseGeocode(lat, lon, lang),
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
      (err) => { setError(geoErrorMessage(err)); setLoading(false) },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  }

  useEffect(() => { requestLocation() }, [])
  useEffect(() => { relabelWeather(lang) }, [lang])

  return { weather, location, loading, error, refetch: requestLocation, fetchByCity }
}
