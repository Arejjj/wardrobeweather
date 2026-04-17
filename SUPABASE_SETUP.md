# Supabase Setup Guide for DressCast

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project (choose region closest to you)
3. Wait for project to initialize (~2 minutes)

## 2. Get Credentials

1. In Supabase Dashboard, go to **Settings > API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`

3. Update `.env.local`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 3. Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy & paste contents of `supabase/schema.sql`
4. Click **Run**

This creates:
- `wardrobe_items` table with RLS policies
- Indexes for performance
- User isolation (each user only sees their own items)

## 4. Test Locally

```bash
npm run dev
```

Visit `http://localhost:5176` and:
1. Sign up with email/password
2. Add some wardrobe items
3. They should sync across tabs/devices in real-time

## 5. Authentication Settings (Optional)

Go to **Authentication > Providers** to enable:
- Google OAuth
- GitHub OAuth
- Magic Links (passwordless)
- etc.

## API Structure

### Auth
```javascript
import { useAuth } from './hooks/useAuth'

const { user, signUp, signIn, signOut } = useAuth()
```

### Wardrobe
```javascript
import { useSupabaseWardrobe } from './hooks/useSupabaseWardrobe'

const { items, addItem, removeItem } = useSupabaseWardrobe(user?.id)
```

## Row-Level Security

Users can **only** access their own wardrobe items. The RLS policies enforce:
- SELECT: only own items
- INSERT: only as own user
- UPDATE: only own items
- DELETE: only own items

## Real-Time Sync

Changes sync instantly across browser tabs via Supabase's WebSocket channel for `wardrobe_items`.

## Photos

Photos are stored as base64 in the `photo` column. For production, consider using Supabase Storage instead (see Supabase docs).
