import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigError = (!supabaseUrl || !supabaseAnonKey)
  ? 'Missing Supabase credentials. Create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  : null

// Use placeholder values when credentials are missing so the module loads
// without throwing. App.jsx checks supabaseConfigError and renders an error
// screen before any API calls are made.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key',
)
