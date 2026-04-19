import { supabase } from './supabase'
import { defaultWardrobe } from '../data/defaultWardrobe'

/**
 * Seed default wardrobe items for a user on first login
 * Checks if user already has items before inserting
 */
export async function seedDefaultWardrobeIfNeeded(userId) {
  if (!userId) return

  // Check if user already has items
  const { count, error: countError } = await supabase
    .from('wardrobe_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (countError) {
    console.error('Error checking wardrobe:', countError)
    return
  }

  // If user already has items, don't seed defaults
  if (count && count > 0) {
    return
  }

  // Map defaultWardrobe to database format
  const itemsToInsert = defaultWardrobe.map(item => ({
    user_id:    userId,
    name:       item.name,
    category:   item.category,
    temp_min:   item.tempMin,
    temp_max:   item.tempMax,
    rain:       item.rain ?? false,
    is_default: true,
    photo:      item.photo,
    gender:     item.gender ?? 'all',
    tags:       item.tags ?? [],
  }))

  // Insert all default items
  const { error } = await supabase
    .from('wardrobe_items')
    .insert(itemsToInsert)

  if (error) {
    console.error('Error seeding default wardrobe:', error.message, error.details, error.hint)
  }
}
