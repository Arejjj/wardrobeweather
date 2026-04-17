import { useState } from 'react'
import { getTempLabel } from '../utils/outfitMatcher'
import { RefreshCw, Search, Sunrise, Sunset } from 'lucide-react'
import TempCurve from './TempCurve'

export default function WeatherCard({ weather, location, loading, error, onRefetch, onCitySearch, t }) {
  const [cityInput, setCityInput] = useState('')

  function handleCitySubmit(e) {
    e.preventDefault()
    if (cityInput.trim()) onCitySearch(cityInput.trim())
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-12 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-16 bg-gray-100 rounded w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3">
        <p className="text-amber-700 text-sm">{error}</p>
        <button onClick={onRefetch} className="text-sm text-amber-600 underline block">
          {t.weatherRetry}
        </button>
        <form onSubmit={handleCitySubmit} className="flex gap-2 mt-1">
          <input
            value={cityInput}
            onChange={e => setCityInput(e.target.value)}
            placeholder={t.weatherCityPlaceholder}
            className="flex-1 rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button type="submit" className="bg-amber-500 text-white px-3 py-2 rounded-xl hover:bg-amber-600 transition-colors">
            <Search size={16} />
          </button>
        </form>
      </div>
    )
  }

  if (!weather) return null

  const { label, color, bg } = getTempLabel(weather.temp, t)
  const showLayeringHint = weather.spread >= 10

  return (
    <div className={`${bg} rounded-2xl p-5 border border-gray-100`}>
      {/* Top row: location + refresh */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{location}</p>
        <button onClick={onRefetch} className="text-gray-400 hover:text-gray-600 transition-colors p-1" title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Main temp + condition */}
      <div className="flex items-end gap-3 mb-2">
        <span className="text-5xl">{weather.icon}</span>
        <div>
          <span className="text-5xl font-bold text-gray-800 leading-none">{weather.temp}°</span>
          <p className="text-gray-500 text-sm mt-0.5">{weather.condition}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 ${color}`}>
          {label}
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 text-gray-500">
          ↓{weather.tempMin}° ↑{weather.tempMax}°
        </span>
        {weather.rain && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
            {t.outfitRain}
          </span>
        )}
        {showLayeringHint && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
            🧅 {t.layeringHint}
          </span>
        )}
      </div>

      {/* Temperature curve */}
      {weather.hourlyTemps?.length >= 2 && (
        <div className="bg-white/60 rounded-xl px-3 pt-2 pb-1">
          <TempCurve
            hourlyTemps={weather.hourlyTemps}
            currentHour={new Date().getHours()}
            t={t}
          />
        </div>
      )}

      {/* Sunrise / Sunset */}
      {(weather.sunrise || weather.sunset) && (
        <div className="flex gap-4 mt-2 pt-2 border-t border-white/40">
          {weather.sunrise && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Sunrise size={12} className="text-amber-400" />
              {weather.sunrise}
            </span>
          )}
          {weather.sunset && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Sunset size={12} className="text-orange-400" />
              {weather.sunset}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
