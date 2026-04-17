import { useState, useMemo } from 'react'
import { CloudSun, Shirt } from 'lucide-react'
import { useWeather } from './hooks/useWeather'
import { useWardrobe } from './hooks/useWardrobe'
import { useGender } from './hooks/useGender'
import { matchOutfit } from './utils/outfitMatcher'
import WeatherCard from './components/WeatherCard'
import OutfitSuggestion from './components/OutfitSuggestion'
import WardrobeView from './components/WardrobeView'
import GenderOnboarding from './components/GenderOnboarding'

const TABS = [
  { id: 'dashboard', label: 'Heute', icon: CloudSun },
  { id: 'wardrobe', label: 'Garderobe', icon: Shirt },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [shuffleIndex, setShuffleIndex] = useState(0)

  const { weather, location, loading, error, refetch, fetchByCity } = useWeather()
  const { items, addItem, removeItem } = useWardrobe()
  const { gender, setGender } = useGender()

  const outfit = useMemo(() => {
    if (!weather) return []
    return matchOutfit(items, weather, gender ?? 'all', shuffleIndex)
  }, [items, weather, gender, shuffleIndex])

  function handleReshuffle() {
    setShuffleIndex(i => i + 1)
  }

  // Onboarding wenn Gender noch nicht gesetzt
  if (gender === null) {
    return <GenderOnboarding onSelect={setGender} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="px-5 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">WardrobeWeather</h1>
          <p className="text-sm text-gray-400">Was ziehe ich heute an?</p>
        </header>

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
              />
              <OutfitSuggestion
                outfit={outfit}
                weather={weather}
                onReshuffle={handleReshuffle}
              />
            </>
          )}
          {tab === 'wardrobe' && (
            <WardrobeView
              items={items}
              onAdd={addItem}
              onRemove={removeItem}
            />
          )}
        </main>

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
