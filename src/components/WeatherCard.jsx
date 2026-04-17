import { useState } from 'react'
import { getTempLabel } from '../utils/outfitMatcher'
import { RefreshCw, Search } from 'lucide-react'

export default function WeatherCard({ weather, location, loading, error, onRefetch, onCitySearch, t }) {
  const [cityInput, setCityInput] = useState('')

  function handleCitySubmit(e) {
    e.preventDefault()
    if (cityInput.trim()) onCitySearch(cityInput.trim())
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-12 bg-gray-200 rounded w-1/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
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

  return (
    <div className={`${bg} rounded-2xl p-6 border border-gray-100`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{location}</p>
          <div className="flex items-end gap-3">
            <span className="text-6xl font-light">{weather.icon}</span>
            <div>
              <span className="text-5xl font-bold text-gray-800">{weather.temp}°</span>
              <p className="text-gray-500 text-sm">
                {weather.tempMin}° / {weather.tempMax}° · {weather.condition}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 ${color}`}>
              {label}
            </span>
            {weather.rain && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                {t.outfitRain}
              </span>
            )}
          </div>
        </div>
        <button onClick={onRefetch} className="text-gray-400 hover:text-gray-600 transition-colors p-1" title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  )
}
