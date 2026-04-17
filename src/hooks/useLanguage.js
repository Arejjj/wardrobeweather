import { useState } from 'react'
import { translations, detectLanguage } from '../i18n/translations'

const STORAGE_KEY = 'wardrobeweather_lang'

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? detectLanguage()
  })

  function setLang(value) {
    localStorage.setItem(STORAGE_KEY, value)
    setLangState(value)
  }

  const t = translations[lang] ?? translations.en

  return { lang, setLang, t }
}
