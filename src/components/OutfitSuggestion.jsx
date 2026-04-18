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
      <div className="bg-white rounded-3xl p-8 text-center border border-[#e8dfcc]">
        <Shirt className="mx-auto mb-3" size={40} style={{ color: '#e8dfcc' }} />
        <p style={{ color: '#5b6270' }}>{t.outfitEmpty}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-[#e8dfcc] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#f4eee3] flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold" style={{ color: '#2b2f38', letterSpacing: '-0.01em' }}>{t.outfitTitle}</h2>
          {weather && (
            <p className="text-sm mt-0.5" style={{ color: '#5b6270' }}>{t.outfitSubtitle(weather.temp, weather.condition)}</p>
          )}
        </div>
        <button
          onClick={onReshuffle}
          className="flex items-center gap-1.5 bg-[#fbf8f3] hover:bg-[#f4eee3] border border-[#e8dfcc] px-3 py-2 rounded-full text-sm font-medium transition-colors"
          style={{ color: '#2b2f38' }}
        >
          <Shuffle size={15} />
          {t.outfitReshuffle}
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {outfit.map(item => (
          <div key={item.id} className="flex items-center gap-4 px-6 py-4">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-14 h-14 rounded-2xl object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#fbf8f3] border border-[#e8dfcc] flex items-center justify-center text-2xl">
                {CATEGORY_ICONS[item.category] ?? '👔'}
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium" style={{ color: '#2b2f38' }}>{item.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#5b6270' }}>{t.categoryLabels?.[item.category] ?? item.category}</p>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {item.isDefault && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#fbf8f3] border border-[#e8dfcc]" style={{ color: '#5b6270' }}>{t.outfitStandard}</span>
              )}
              {item.rain && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#e6f0f8', color: '#5aa4cf' }}>{t.outfitRain}</span>
              )}
              {item.layeringItem && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#fdeadd', color: '#d6612f' }}>🧅 {t.outfitLayering}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
