export default function GenderOnboarding({ onSelect }) {
  const options = [
    { value: 'female', emoji: '👗', label: 'Weiblich', desc: 'Kleider, Röcke, Blusen & mehr' },
    { value: 'male',   emoji: '👔', label: 'Männlich', desc: 'Hemden, Hosen & klassische Looks' },
    { value: 'all',    emoji: '✨', label: 'Alle Styles', desc: 'Zeig mir alles, egal welche Kategorie' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-4">👕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Willkommen!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Welche Kleidungsstücke sollen dir vorgeschlagen werden?
        </p>
        <div className="space-y-3">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all text-left"
            >
              <span className="text-3xl">{opt.emoji}</span>
              <div>
                <p className="font-semibold text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Du kannst das jederzeit in den Einstellungen ändern.
        </p>
      </div>
    </div>
  )
}
