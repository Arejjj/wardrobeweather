import { useState } from 'react'
import { getTempLabel } from '../utils/outfitMatcher'
import { RefreshCw, Search, Sunrise, Sunset } from 'lucide-react'
import TempCurve from './TempCurve'

export default function WeatherCard({ weather, location, loading, error, onRefetch, onCitySearch, t }) {
  const [cityInput, setCityInput] = useState('')
  const [editingLocation, setEditingLocation] = useState(false)

  function handleCitySubmit(e) {
    e.preventDefault()
    if (cityInput.trim()) {
      onCitySearch(cityInput.trim())
      setCityInput('')
      setEditingLocation(false)
    }
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
    <div className="rounded-3xl p-6 border border-[#e8dfcc] bg-white shadow-[0_1px_2px_rgba(43,47,56,0.04)]">
      {/* Top row: location + actions */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setEditingLocation(v => !v)}
          className="flex items-center gap-1.5 text-sm font-medium tracking-wide uppercase hover:text-[#ef7a46] transition-colors group"
          style={{ color: '#5b6270', letterSpacing: '0.08em' }}
        >
          {location}
          <Search size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#ef7a46' }} />
        </button>
        <button onClick={onRefetch} className="text-[#5b6270] hover:text-[#2b2f38] transition-colors p-1" title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Inline location search */}
      {editingLocation && (
        <form onSubmit={handleCitySubmit} className="flex gap-2 mb-4">
          <input
            value={cityInput}
            onChange={e => setCityInput(e.target.value)}
            placeholder={t.weatherCityPlaceholder}
            autoFocus
            className="flex-1 rounded-full border border-[#e8dfcc] bg-[#fbf8f3] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef7a46]/40 focus:border-[#ef7a46]"
            style={{ color: '#2b2f38' }}
          />
          <button type="submit" className="bg-[#ef7a46] text-white px-3 py-2 rounded-full hover:bg-[#d6612f] transition-colors">
            <Search size={15} />
          </button>
        </form>
      )}

      {/* Main temp + condition */}
      <div className="flex items-end gap-4 mb-3">
        <span className="text-6xl">{weather.icon}</span>
        <div>
          <span className="font-serif text-6xl font-semibold leading-none" style={{ color: '#2b2f38', letterSpacing: '-0.03em' }}>{weather.temp}°</span>
          <p className="font-serif italic text-base mt-1" style={{ color: '#5b6270' }}>{weather.condition}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fbf8f3] border border-[#e8dfcc]" style={{ color: '#2b2f38' }}>
          {label}
        </span>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#fbf8f3] border border-[#e8dfcc]" style={{ color: '#5b6270' }}>
          ↓{weather.tempMin}° ↑{weather.tempMax}°
        </span>
        {weather.rain && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#e6f0f8', color: '#5aa4cf' }}>
            {t.outfitRain}
          </span>
        )}
        {showLayeringHint && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#fdeadd', color: '#d6612f' }}>
            🧅 {t.layeringHint}
          </span>
        )}
      </div>

      {/* Temperature curve */}
      {weather.hourlyTemps?.length >= 2 && (
        <div className="bg-[#fbf8f3] rounded-2xl px-3 pt-2 pb-1 border border-[#e8dfcc]">
          <TempCurve
            hourlyTemps={weather.hourlyTemps}
            currentHour={new Date().getHours()}
            t={t}
          />
        </div>
      )}

      {/* Sunrise / Sunset */}
      {(weather.sunrise || weather.sunset) && (
        <div className="flex gap-4 mt-3 pt-3 border-t border-[#e8dfcc]">
          {weather.sunrise && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#5b6270' }}>
              <Sunrise size={13} style={{ color: '#e6c76a' }} />
              {weather.sunrise}
            </span>
          )}
          {weather.sunset && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#5b6270' }}>
              <Sunset size={13} style={{ color: '#ef7a46' }} />
              {weather.sunset}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
