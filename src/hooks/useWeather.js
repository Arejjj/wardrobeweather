import { useState, useEffect } from 'react'

const WMO_CODES = {
  0: { label: 'Klar', icon: '☀️', rain: false },
  1: { label: 'Überwiegend klar', icon: '🌤️', rain: false },
  2: { label: 'Teilweise bewölkt', icon: '⛅', rain: false },
  3: { label: 'Bedeckt', icon: '☁️', rain: false },
  45: { label: 'Nebel', icon: '🌫️', rain: false },
  48: { label: 'Reifnebel', icon: '🌫️', rain: false },
  51: { label: 'Leichter Nieselregen', icon: '🌧️', rain: true },
  53: { label: 'Nieselregen', icon: '🌧️', rain: true },
  55: { label: 'Starker Nieselregen', icon: '🌧️', rain: true },
  61: { label: 'Leichter Regen', icon: '🌧️', rain: true },
  63: { label: 'Regen', icon: '🌧️', rain: true },
  65: { label: 'Starker Regen', icon: '🌧️', rain: true },
  71: { label: 'Leichter Schnee', icon: '🌨️', rain: false },
  73: { label: 'Schnee', icon: '❄️', rain: false },
  75: { label: 'Starker Schnee', icon: '❄️', rain: false },
  80: { label: 'Regenschauer', icon: '🌦️', rain: true },
  81: { label: 'Regenschauer', icon: '🌦️', rain: true },
  82: { label: 'Starke Regenschauer', icon: '⛈️', rain: true },
  95: { label: 'Gewitter', icon: '⛈️', rain: true },
  96: { label: 'Gewitter mit Hagel', icon: '⛈️', rain: true },
  99: { label: 'Schweres Gewitter', icon: '⛈️', rain: true },
}

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchByCity(cityName) {
    setLoading(true)
    setError(null)
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=de&format=json`
      )
      const geoData = await geoRes.json()
      if (!geoData.results?.length) throw new Error(`Stadt "${cityName}" nicht gefunden.`)
      const { latitude, longitude, name } = geoData.results[0]
      const weatherData = await fetchWeather(latitude, longitude)
      setWeather(weatherData)
      setLocation(name)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=1`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Wetterdaten konnten nicht geladen werden')
    const data = await res.json()
    const code = data.current.weathercode
    const wmo = WMO_CODES[code] ?? { label: 'Unbekannt', icon: '🌡️', rain: false }
    return {
      temp: Math.round(data.current.temperature_2m),
      tempMax: Math.round(data.daily.temperature_2m_max[0]),
      tempMin: Math.round(data.daily.temperature_2m_min[0]),
      condition: wmo.label,
      icon: wmo.icon,
      rain: wmo.rain,
      windspeed: Math.round(data.current.windspeed_10m),
    }
  }

  async function fetchCityName(lat, lon) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
      const data = await res.json()
      return data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Dein Standort'
    } catch {
      return 'Dein Standort'
    }
  }

  function requestLocation() {
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        try {
          const [weatherData, cityName] = await Promise.all([
            fetchWeather(lat, lon),
            fetchCityName(lat, lon),
          ])
          setWeather(weatherData)
          setLocation(cityName)
        } catch (e) {
          setError(e.message)
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Standortzugriff verweigert. Bitte erlaube den Zugriff in deinem Browser.')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return { weather, location, loading, error, refetch: requestLocation, fetchByCity }
}
