import { useState, useMemo } from 'react'
import { CloudSun, Shirt, LogOut } from 'lucide-react'
import { useWeather } from './hooks/useWeather'
import { useWardrobe } from './hooks/useWardrobe'
import { useSupabaseWardrobe } from './hooks/useSupabaseWardrobe'
import { useGender } from './hooks/useGender'
import { useLanguage } from './hooks/useLanguage'
import { useAuth } from './hooks/useAuth'
import { matchOutfit } from './utils/outfitMatcher'
import WeatherCard from './components/WeatherCard'
import OutfitSuggestion from './components/OutfitSuggestion'
import WardrobeView from './components/WardrobeView'
import GenderOnboarding from './components/GenderOnboarding'
import AuthScreen from './components/AuthScreen'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [shuffleIndex, setShuffleIndex] = useState(0)

  const { lang, setLang, t } = useLanguage()
  const { user, loading: authLoading, error: authError, signUp, signIn, signOut } = useAuth()

  // Use Supabase wardrobe if logged in, otherwise use localStorage
  const supabaseWardrobe = useSupabaseWardrobe(user?.id)
  const localWardrobe = useWardrobe()
  const { items, addItem, removeItem } = user ? supabaseWardrobe : localWardrobe

  const { weather, location, loading, error, refetch, fetchByCity } = useWeather(lang)
  const { gender, setGender } = useGender()

  const outfit = useMemo(() => {
    if (!weather) return []
    return matchOutfit(items, weather, gender ?? 'all', shuffleIndex)
  }, [items, weather, gender, shuffleIndex])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fbf8f3' }}>
        <div className="text-center">
          <div className="animate-pulse text-3xl font-serif mb-4" style={{ color: '#2b2f38' }}>DressCast</div>
          <p style={{ color: '#5b6270' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen onSignUp={signUp} onSignIn={signIn} loading={authLoading} error={authError} />
  }

  if (gender === null) {
    return <GenderOnboarding onSelect={setGender} t={t} />
  }

  const TABS = [
    { id: 'dashboard', label: t.navToday,    icon: CloudSun },
    { id: 'wardrobe',  label: t.navWardrobe, icon: Shirt    },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#fbf8f3' }}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">

        {/* Header */}
        <header className="px-5 pt-10 pb-5 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight" style={{ color: '#2b2f38' }}>
              {t.appTitle}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#5b6270' }}>{t.appSubtitle}</p>
          </div>
          {/* Language Selector + Sign Out */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/70 border border-[#e8dfcc] rounded-full p-1 backdrop-blur">
              {['en', 'de'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    lang === l
                      ? 'bg-[#2b2f38] text-white'
                      : 'text-[#5b6270] hover:text-[#2b2f38]'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={signOut}
              className="text-[#5b6270] hover:text-[#ef7a46] transition-colors p-2"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
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
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur border-t border-[#e8dfcc] px-6 py-3 flex justify-around">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                tab === id ? 'text-[#ef7a46]' : 'text-[#5b6270] hover:text-[#2b2f38]'
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
