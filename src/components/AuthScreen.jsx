import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'

async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
}

export default function AuthScreen({ onSignUp, onSignIn, loading, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')

  async function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'signin') {
      await onSignIn(email, password)
    } else {
      await onSignUp(email, password)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#fbf8f3' }}>
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-semibold mb-2" style={{ color: '#2b2f38', letterSpacing: '-0.01em' }}>
            DressCast
          </h1>
          <p style={{ color: '#5b6270' }}>Dress for the day, not just the weather.</p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-[#e8dfcc] px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#fbf8f3] hover:border-[#d0c8ba] transition-colors mb-4"
          style={{ color: '#2b2f38' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#e8dfcc]" />
          <span className="text-xs" style={{ color: '#5b6270' }}>or</span>
          <div className="flex-1 h-px bg-[#e8dfcc]" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e8dfcc] p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2b2f38' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-[#e8dfcc] bg-[#fbf8f3] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef7a46]/40 focus:border-[#ef7a46]"
              style={{ color: '#2b2f38' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2b2f38' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-[#e8dfcc] bg-[#fbf8f3] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef7a46]/40 focus:border-[#ef7a46]"
              style={{ color: '#2b2f38' }}
            />
          </div>

          {error && (
            <p className="text-sm rounded-lg p-3 bg-[#fdeadd]" style={{ color: '#d6612f' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#ef7a46] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#d6612f] disabled:opacity-50 transition-colors"
          >
            {mode === 'signin' ? (
              <>
                <LogIn size={16} />
                Sign In
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Create Account
              </>
            )}
          </button>

          <div className="text-center text-sm" style={{ color: '#5b6270' }}>
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-medium hover:text-[#ef7a46] transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-medium hover:text-[#ef7a46] transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
