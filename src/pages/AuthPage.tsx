import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Mail, Lock, User, Sparkles } from 'lucide-react'
import { loginUser, registerUser, type AuthUser } from '../lib/auth'

type Props = {
  mode: 'login' | 'signup'
  onClose: () => void
  onAuth: (user: AuthUser) => void
}

export default function AuthPage({ mode, onClose, onAuth }: Props) {
  const [formMode, setFormMode] = useState<'login' | 'signup'>(mode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setFormMode(mode)
    setError('')
    setSuccess('')
  }, [mode])

  const title = useMemo(() => formMode === 'login' ? 'Welcome back' : 'Create your account', [formMode])
  const subtitle = useMemo(() => formMode === 'login'
    ? 'Sign in to save favorites, orders, and your address.'
    : 'Join Prajahita to track orders and save your favorite soaps.', [formMode])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (formMode === 'signup') {
      const result = await registerUser(name, email, password)
      if (!result.success) {
        setError(result.error)
        return
      }
      if (result.needsVerification) {
        setSuccess(result.message ?? 'Verification email sent. Please verify your email before signing in.')
        return
      }
      setSuccess('Account created successfully!')
      return
    }

    const result = await loginUser(email, password)
    if (!result.success) {
      setError(result.error)
      return
    }

    setSuccess('Signed in successfully!')
    onAuth(result.user)
    onClose()
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(245,232,210,0.95))] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-cream-200 bg-white shadow-2xl overflow-hidden">
        <div className="bg-sage-600 px-6 py-6 text-cream-50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sage-100">Prajahita</p>
              <h2 className="font-serif text-xl font-semibold">{title}</h2>
            </div>
          </div>
          <p className="text-sm text-sage-100">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formMode === 'signup' && (
            <label className="block">
              <span className="text-sm font-medium text-brown-700 mb-2 flex items-center gap-2">
                <User size={14} /> Full name
              </span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-2xl border border-cream-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                placeholder="Asha Sharma"
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-medium text-brown-700 mb-2 flex items-center gap-2">
              <Mail size={14} /> Email
            </span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-cream-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-brown-700 mb-2 flex items-center gap-2">
              <Lock size={14} /> Password
            </span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-cream-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="Enter password"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-sage-700">{success}</p>}

          <button className="w-full btn-primary py-3 rounded-2xl font-semibold flex items-center justify-center gap-2">
            Continue
            <ArrowRight size={16} />
          </button>

          <div className="text-center text-sm text-brown-600">
            {formMode === 'login' ? (
              <>
                New here?{' '}
                <button type="button" onClick={() => setFormMode('signup')} className="font-semibold text-sage-700">Create an account</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setFormMode('login')} className="font-semibold text-sage-700">Sign in</button>
              </>
            )}
          </div>

          <button type="button" onClick={onClose} className="w-full border border-cream-300 py-3 rounded-2xl text-sm font-semibold text-brown-700 hover:bg-cream-100">
            Back to shop
          </button>
        </form>
      </div>
    </div>
  )
}
