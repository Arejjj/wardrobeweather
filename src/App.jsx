import { useState, useMemo } from 'react'
import { CloudSun, Shirt } from 'lucide-react'
import { useWeather } from './hooks/useWeather'
import { useWardrobe } from './hooks/useWardrobe'
import { useGender } from './hooks/useGender'
import { useLanguage } from './hooks/useLanguage'
import { matchOutfit } from './utils/outfitMatcher'
import WeatherCard from './components/WeatherCard'
import OutfitSuggestion from './components/OutfitSuggestion'
import WardrobeView from './components/WardrobeView'
import GenderOnboarding from './components/GenderOnboarding'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [shuffleIndex, setShuffleIndex] = useState(0)

  const { lang, setLang, t } = useLanguage()
  const { weather, location, loading, error, refetch, fetchByCity } = useWeather(lang)
  const { items, addItem, removeItem } = useWardrobe()
  const { gender, setGender } = useGender()

  const outfit = useMemo(() => {
    if (!weather) return []
    return matchOutfit(items, weather, gender ?? 'all', shuffleIndex)
  }, [items, weather, gender, shuffleIndex])

  if (gender === null) {
    return <GenderOnboarding onSelect={setGender} t={t} />
  }

  const TABS = [
    { id: 'dashboard', label: t.navToday,    icon: CloudSun },
    { id: 'wardrobe',  label: t.navWardrobe, icon: Shirt    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">

        {/* Header */}
        <header className="px-5 pt-8 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.appTitle}</h1>
            <p className="text-sm text-gray-400">{t.appSubtitle}</p>
          </div>
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 mt-1">
            {['en', 'de'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  lang === l
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-5 pb-24 space-y-4">
          {tab === 'dashboard' && (
            <>
              <WeatherCard
                weather={weather}
                location={location}
                loading={loading}
                error={error}
                onRefetch={refetch}
                onCitySearch={fetchByCity}
                t={t}
              />
              <OutfitSuggestion
                outfit={outfit}
                weather={weather}
                onReshuffle={() => setShuffleIndex(i => i + 1)}
                t={t}
              />
            </>
          )}
          {tab === 'wardrobe' && (
            <WardrobeView
              items={items}
              onAdd={addItem}
              onRemove={removeItem}
              t={t}
            />
          )}
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-6 py-3 flex justify-around">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                tab === id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={tab === id ? 2.5 : 1.8} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
