export default function GenderOnboarding({ onSelect, t }) {
  const options = [
    { value: 'female', emoji: '👗', label: t.onboardingFemale, desc: t.onboardingFemaleDesc },
    { value: 'male',   emoji: '👔', label: t.onboardingMale,   desc: t.onboardingMaleDesc   },
    { value: 'all',    emoji: '✨', label: t.onboardingAll,    desc: t.onboardingAllDesc    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#fbf8f3' }}>
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-5">👕</div>
        <h1 className="font-serif text-3xl font-semibold mb-2" style={{ color: '#2b2f38', letterSpacing: '-0.01em' }}>{t.onboardingWelcome}</h1>
        <p className="text-sm mb-8" style={{ color: '#5b6270' }}>{t.onboardingQuestion}</p>
        <div className="space-y-3">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#e8dfcc] hover:border-[#ef7a46] hover:shadow-[0_4px_16px_rgba(239,122,70,0.12)] transition-all text-left"
            >
              <span className="text-3xl">{opt.emoji}</span>
              <div>
                <p className="font-semibold" style={{ color: '#2b2f38' }}>{opt.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#5b6270' }}>{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs mt-6" style={{ color: '#5b6270' }}>{t.onboardingNote}</p>
      </div>
    </div>
  )
}
