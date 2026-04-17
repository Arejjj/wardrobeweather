import { useState, useRef } from 'react'
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react'
import { CATEGORIES } from '../data/defaultWardrobe'

const CATEGORY_ICONS = {
  'Oberteil': '👕',
  'Pullover/Sweatshirt': '🧥',
  'Hose/Rock': '👖',
  'Kleid': '👗',
  'Jacke/Mantel': '🧣',
  'Thermolayer': '🔵',
  'Schuhe': '👟',
  'Accessoire': '🧤',
}

function AddItemForm({ onAdd, onCancel }) {
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
    onAdd({ name: name.trim(), category, tempMin: Number(tempMin), tempMax: Number(tempMax), photo, layer: 1, tags: [] })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
      <h3 className="font-semibold text-gray-700 mb-4">Neues Kleidungsstück</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <label className="text-xs text-gray-500 mb-1 block">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="z.B. Mein Lieblingsshirt"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Kategorie</label>
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
          <label className="text-xs text-gray-500 mb-1 block">Foto (optional)</label>
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
          >
            {photo ? '✓ Foto gewählt' : '📷 Hochladen'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Min. Temperatur (°C)</label>
          <input
            type="number"
            value={tempMin}
            onChange={e => setTempMin(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Max. Temperatur (°C)</label>
          <input
            type="number"
            value={tempMax}
            onChange={e => setTempMax(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
      {photo && (
        <img src={photo} alt="Vorschau" className="w-20 h-20 rounded-xl object-cover mb-3" />
      )}
      <div className="flex gap-2">
        <button type="submit" className="flex items-center gap-1.5 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          <Check size={15} /> Hinzufügen
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 bg-white text-gray-500 px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
          <X size={15} /> Abbrechen
        </button>
      </div>
    </form>
  )
}

export default function WardrobeView({ items, onAdd, onRemove }) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('Alle')

  const categories = ['Alle', ...Object.values(CATEGORIES)]
  const filtered = filter === 'Alle' ? items : items.filter(i => i.category === filter)

  function handleAdd(item) {
    onAdd(item)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-lg">Meine Garderobe</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-gray-800 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} /> Hinzufügen
        </button>
      </div>

      {/* Kategorie-Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === cat ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {CATEGORY_ICONS[cat] && `${CATEGORY_ICONS[cat]} `}{cat}
          </button>
        ))}
      </div>

      {showForm && <AddItemForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}

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
                {item.isDefault ? (
                  <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Standard</span>
                ) : (
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Eigenes</span>
                )}
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
        <div className="text-center py-10 text-gray-400 text-sm">
          Keine Kleidungsstücke in dieser Kategorie.
        </div>
      )}
    </div>
  )
}
