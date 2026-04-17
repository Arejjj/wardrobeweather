import { useState } from 'react'

const STORAGE_KEY = 'wardrobeweather_gender'

export function useGender() {
  const [gender, setGenderState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? null // null = noch nicht gesetzt
  })

  function setGender(value) {
    localStorage.setItem(STORAGE_KEY, value)
    setGenderState(value)
  }

  return { gender, setGender }
}
