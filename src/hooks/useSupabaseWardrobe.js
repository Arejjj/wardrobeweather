import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Map DB snake_case → app camelCase
function toClient(item) {
  return {
    ...item,
    tempMin:   item.temp_min,
    tempMax:   item.temp_max,
    isDefault: item.is_default,
  }
}

export function useSupabaseWardrobe(userId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(!userId)
  const [error, setError] = useState(null)

  // Fetch items for current user
  useEffect(() => {
    if (!userId) {
      setItems([])
      setLoading(false)
      return
    }

    async function fetchItems() {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (err) {
        setError(err.message)
      } else {
        setItems((data ?? []).map(toClient))
      }
      setLoading(false)
    }

    fetchItems()

    // Listen for real-time changes
    const channel = supabase
      .channel(`wardrobe:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wardrobe_items', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(i => i.id !== payload.old.id))
          } else {
            setItems(prev => {
              const item = toClient(payload.new)
              const idx = prev.findIndex(i => i.id === item.id)
              if (idx >= 0) {
                const newItems = [...prev]
                newItems[idx] = item
                return newItems
              }
              return [item, ...prev]
            })
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  async function addItem(item) {
    if (!userId) return null
    const { data, error: err } = await supabase
      .from('wardrobe_items')
      .insert([{
        ...item,
        user_id: userId,
        is_default: item.isDefault ?? false,
      }])
      .select()

    if (err) {
      setError(err.message)
      return null
    }
    return data?.[0] ?? null
  }

  async function removeItem(itemId) {
    const { error: err } = await supabase
      .from('wardrobe_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId)

    if (err) {
      setError(err.message)
      return false
    }
    return true
  }

  return { items, loading, error, addItem, removeItem }
}
