import { useState, useEffect } from 'react'
import { defaultWardrobe } from '../data/defaultWardrobe'

const STORAGE_KEY = 'wardrobeweather_items'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useWardrobe() {
  const [items, setItems] = useState(() => {
    const stored = loadFromStorage()
    return stored ?? defaultWardrobe
  })

  useEffect(() => {
    saveToStorage(items)
  }, [items])

  function addItem(item) {
    const newItem = { ...item, id: `custom-${Date.now()}`, isDefault: false }
    setItems(prev => [...prev, newItem])
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateItem(id, changes) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i))
  }

  function resetToDefaults() {
    setItems(defaultWardrobe)
  }

  return { items, addItem, removeItem, updateItem, resetToDefaults }
}
