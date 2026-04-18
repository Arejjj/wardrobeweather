import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { seedDefaultWardrobeIfNeeded } from '../lib/seedDefaultWardrobe'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) await seedDefaultWardrobeIfNeeded(u.id)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  async function signUp(email, password) {
    setError(null)
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err) {
      setError(err.message)
      return null
    }
    // Seed default wardrobe for new user
    if (data.user) {
      await seedDefaultWardrobeIfNeeded(data.user.id)
    }
    return data.user
  }

  async function signIn(email, password) {
    setError(null)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      return null
    }
    if (data.user) {
      setUser(data.user)
      // Ensure user has default wardrobe (in case they signed up elsewhere)
      await seedDefaultWardrobeIfNeeded(data.user.id)
    }
    return data.user
  }

  async function signOut() {
    setError(null)
    const { error: err } = await supabase.auth.signOut()
    if (err) {
      setError(err.message)
      return false
    }
    setUser(null)
    return true
  }

  return { user, loading, error, signUp, signIn, signOut }
}
