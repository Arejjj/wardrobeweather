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

const INPUT_CLS = "w-full rounded-xl border border-[#e8dfcc] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef7a46]/40 focus:border-[#ef7a46]"

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
    <form onSubmit={handleSubmit} className="bg-[#f4eee3] rounded-2xl p-5 border border-[#e8dfcc]">
      <h3 className="font-serif text-lg font-semibold mb-4" style={{ color: '#2b2f38' }}>{t.formTitle}</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <label className="text-xs mb-1 block" style={{ color: '#5b6270' }}>{t.formName}</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t.formNamePlaceholder}
            className={INPUT_CLS}
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#5b6270' }}>{t.formCategory}</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className={INPUT_CLS}>
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#5b6270' }}>{t.formPhoto}</label>
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="w-full rounded-xl border border-dashed border-[#e8dfcc] bg-white px-3 py-2 text-sm transition-colors hover:border-[#ef7a46]"
            style={{ color: photo ? '#2b2f38' : '#5b6270' }}
          >
            {photo ? t.formPhotoChosen : t.formPhotoUpload}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#5b6270' }}>{t.formTempMin}</label>
          <input type="number" value={tempMin} onChange={e => setTempMin(e.target.value)} className={INPUT_CLS} />
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#5b6270' }}>{t.formTempMax}</label>
          <input type="number" value={tempMax} onChange={e => setTempMax(e.target.value)} className={INPUT_CLS} />
        </div>
      </div>
      {photo && <img src={photo} alt="Preview" className="w-20 h-20 rounded-xl object-cover mb-3" />}
      <div className="flex gap-2">
        <button type="submit" className="flex items-center gap-1.5 bg-[#ef7a46] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#d6612f] transition-colors">
          <Check size={15} /> {t.formAdd}
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full text-sm border border-[#e8dfcc] hover:bg-[#fbf8f3] transition-colors" style={{ color: '#5b6270' }}>
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
        <h2 className="font-serif text-2xl font-semibold" style={{ color: '#2b2f38', letterSpacing: '-0.01em' }}>{t.wardrobeTitle}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors border ${
              showFilters || hasActiveFilters
                ? 'bg-[#fdeadd] border-[#ffb38a] text-[#d6612f]'
                : 'bg-white border-[#e8dfcc] text-[#5b6270] hover:bg-[#fbf8f3]'
            }`}
          >
            <SlidersHorizontal size={15} />
            {t.filterTitle}
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#ef7a46] ml-0.5" />}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[#2b2f38] text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-black transition-colors"
          >
            <Plus size={15} /> {t.wardrobeAdd}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-[#e8dfcc] p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#5b6270' }}>
              {t.filterWeather}
            </label>
            <div className="flex flex-wrap gap-2">
              {WEATHER_FILTERS.map(wf => (
                <button
                  key={wf}
                  onClick={() => setWeatherFilter(wf)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    weatherFilter === wf
                      ? 'bg-[#ef7a46] text-white'
                      : 'bg-[#fbf8f3] text-[#5b6270] border border-[#e8dfcc] hover:bg-[#f4eee3]'
                  }`}
                >
                  {weatherFilterLabels[wf]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#5b6270' }}>
              {t.filterTempLabel}: {tempRange.min}° – {tempRange.max}°
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="range" min={-20} max={40} step={1}
                value={tempRange.min}
                onChange={e => setTempRange(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max - 1) }))}
                className="flex-1 accent-[#ef7a46]"
              />
              <input
                type="range" min={-20} max={40} step={1}
                value={tempRange.max}
                onChange={e => setTempRange(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min + 1) }))}
                className="flex-1 accent-[#ef7a46]"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-xs underline hover:text-[#d6612f]" style={{ color: '#ef7a46' }}>
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
                ? 'bg-[#2b2f38] text-white'
                : 'bg-white text-[#5b6270] border border-[#e8dfcc] hover:bg-[#fbf8f3]'
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
          <div key={item.id} className="bg-white rounded-2xl border border-[#e8dfcc] overflow-hidden group">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-full h-32 object-cover" />
            ) : (
              <div className="w-full h-32 bg-[#fbf8f3] flex items-center justify-center text-4xl">
                {CATEGORY_ICONS[item.category] ?? '👔'}
              </div>
            )}
            <div className="p-3">
              <p className="font-medium text-sm truncate" style={{ color: '#2b2f38' }}>{item.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#5b6270' }}>{item.tempMin}° – {item.tempMax}°</p>
              <div className="flex items-center justify-between mt-2">
                {item.isDefault
                  ? <span className="text-xs px-2 py-0.5 rounded-full bg-[#fbf8f3] border border-[#e8dfcc]" style={{ color: '#5b6270' }}>{t.wardrobeDefault}</span>
                  : <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#fdeadd', color: '#d6612f' }}>{t.wardrobeCustom}</span>
                }
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-[#e8dfcc] hover:text-[#d6612f] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-sm" style={{ color: '#5b6270' }}>{t.wardrobeEmpty}</div>
      )}
    </div>
  )
}
