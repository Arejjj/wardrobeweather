import { Shirt, Shuffle } from 'lucide-react'

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

export default function OutfitSuggestion({ outfit, weather, onReshuffle, t }) {
  if (!outfit || outfit.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
        <Shirt className="mx-auto text-gray-300 mb-3" size={40} />
        <p className="text-gray-400">{t.outfitEmpty}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">{t.outfitTitle}</h2>
          {weather && (
            <p className="text-sm text-gray-400">{t.outfitSubtitle(weather.temp, weather.condition)}</p>
          )}
        </div>
        <button
          onClick={onReshuffle}
          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Shuffle size={15} />
          {t.outfitReshuffle}
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {outfit.map(item => (
          <div key={item.id} className="flex items-center gap-4 px-6 py-4">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                {CATEGORY_ICONS[item.category] ?? '👔'}
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-400">{item.category}</p>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {item.isDefault && (
                <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{t.outfitStandard}</span>
              )}
              {item.rain && (
                <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">{t.outfitRain}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
