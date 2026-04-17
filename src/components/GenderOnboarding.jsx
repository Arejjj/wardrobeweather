export default function GenderOnboarding({ onSelect, t }) {
  const options = [
    { value: 'female', emoji: '👗', label: t.onboardingFemale, desc: t.onboardingFemaleDesc },
    { value: 'male',   emoji: '👔', label: t.onboardingMale,   desc: t.onboardingMaleDesc   },
    { value: 'all',    emoji: '✨', label: t.onboardingAll,    desc: t.onboardingAllDesc    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-4">👕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.onboardingWelcome}</h1>
        <p className="text-gray-500 text-sm mb-8">{t.onboardingQuestion}</p>
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
        <p className="text-xs text-gray-400 mt-6">{t.onboardingNote}</p>
      </div>
    </div>
  )
}
