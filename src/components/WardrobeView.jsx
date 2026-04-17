import { useState, useRef } from 'react'
import { Plus, Trash2, X, Check, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES } from '../data/defaultWardrobe'

const CATEGORY_ICONS = {
  'Oberteil': '👕',          'Top': '👕',
  'Pullover/Sweatshirt': '🧥', 'Sweater/Sweatshirt': '🧥',
  'Hose/Rock': '👖',          'Trousers/Skirt': '👖',
  'Kleid': '👗',              'Dress': '👗',
  'Jacke/Mantel': '🧣',       'Jacket/Coat': '🧣',
  'Thermolayer': '🔵',
  'Schuhe': '👟',             'Shoes': '👟',
  'Accessoire': '🧤',         'Accessory': '🧤',
}

function AddItemForm({ onAdd, onCancel, t }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES.TOP)
  const [tempMin, setTempMin] = useState(10)
  const [tempMax, setTempMax] = useState(25)
  const [photo, setPhoto] = useState(null)
  const fileRef = useRef()

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), category, tempMin: Number(tempMin), tempMax: Number(tempMax), photo, layer: 1, tags: [], gender: 'all' })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
      <h3 className="font-semibold text-gray-700 mb-4">{t.formTitle}</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <label className="text-xs text-gray-500 mb-1 block">{t.formName}</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t.formNamePlaceholder}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">{t.formCategory}</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">{t.formPhoto}</label>
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
          >
            {photo ? t.formPhotoChosen : t.formPhotoUpload}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">{t.formTempMin}</label>
          <input type="number" value={tempMin} onChange={e => setTempMin(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">{t.formTempMax}</label>
          <input type="number" value={tempMax} onChange={e => setTempMax(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
      </div>
      {photo && <img src={photo} alt="Preview" className="w-20 h-20 rounded-xl object-cover mb-3" />}
      <div className="flex gap-2">
        <button type="submit" className="flex items-center gap-1.5 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          <Check size={15} /> {t.formAdd}
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 bg-white text-gray-500 px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
          <X size={15} /> {t.formCancel}
        </button>
      </div>
    </form>
  )
}

const WEATHER_FILTERS = ['all', 'rain', 'sun', 'cold', 'warm']

export default function WardrobeView({ items, onAdd, onRemove, t }) {
  const [showForm, setShowForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [weatherFilter, setWeatherFilter] = useState('all')
  const [tempRange, setTempRange] = useState({ min: -20, max: 40 })

  const categories = ['all', ...Object.values(CATEGORIES)]

  const weatherFilterLabels = {
    all:  t.filterWeatherAll,
    rain: t.filterWeatherRain,
    sun:  t.filterWeatherSun,
    cold: t.filterWeatherCold,
    warm: t.filterWeatherWarm,
  }

  function matchesWeatherFilter(item) {
    switch (weatherFilter) {
      case 'rain': return item.rain === true
      case 'sun':  return item.tempMax >= 20 && !item.rain
      case 'cold': return item.tempMin <= 5
      case 'warm': return item.tempMax >= 20
      default: return true
    }
  }

  const filtered = items.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
    if (!matchesWeatherFilter(item)) return false
    // Temp range: item must overlap with selected range
    if (item.tempMax < tempRange.min || item.tempMin > tempRange.max) return false
    return true
  })

  const hasActiveFilters = weatherFilter !== 'all' || tempRange.min !== -20 || tempRange.max !== 40

  function resetFilters() {
    setWeatherFilter('all')
    setTempRange({ min: -20, max: 40 })
  }

  function handleAdd(item) {
    onAdd(item)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-lg">{t.wardrobeTitle}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={15} />
            {t.filterTitle}
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-500 ml-0.5" />}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-gray-800 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus size={15} /> {t.wardrobeAdd}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          {/* Weather filter */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              {t.filterWeather}
            </label>
            <div className="flex flex-wrap gap-2">
              {WEATHER_FILTERS.map(wf => (
                <button
                  key={wf}
                  onClick={() => setWeatherFilter(wf)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    weatherFilter === wf
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {weatherFilterLabels[wf]}
                </button>
              ))}
            </div>
          </div>

          {/* Temp range */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              {t.filterTempLabel}: {tempRange.min}° – {tempRange.max}°
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="range" min={-20} max={40} step={1}
                value={tempRange.min}
                onChange={e => setTempRange(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max - 1) }))}
                className="flex-1 accent-blue-500"
              />
              <input
                type="range" min={-20} max={40} step={1}
                value={tempRange.max}
                onChange={e => setTempRange(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min + 1) }))}
                className="flex-1 accent-blue-500"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600 underline">
              {t.filterReset}
            </button>
          )}
        </div>
      )}

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {CATEGORY_ICONS[cat] && `${CATEGORY_ICONS[cat]} `}{cat === 'all' ? t.filterAll : cat}
          </button>
        ))}
      </div>

      {showForm && <AddItemForm onAdd={handleAdd} onCancel={() => setShowForm(false)} t={t} />}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-full h-32 object-cover" />
            ) : (
              <div className="w-full h-32 bg-gray-50 flex items-center justify-center text-4xl">
                {CATEGORY_ICONS[item.category] ?? '👔'}
              </div>
            )}
            <div className="p-3">
              <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
              <p className="text-xs text-gray-400">{item.tempMin}° – {item.tempMax}°</p>
              <div className="flex items-center justify-between mt-2">
                {item.isDefault
                  ? <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{t.wardrobeDefault}</span>
                  : <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{t.wardrobeCustom}</span>
                }
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">{t.wardrobeEmpty}</div>
      )}
    </div>
  )
}
