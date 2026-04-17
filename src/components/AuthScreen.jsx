import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'

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
