import { useState } from 'react'
import { supabase } from '../supabaseClient.js'

const MIN_PASSWORD_LENGTH = 6

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (mode === 'register' && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      return
    }
    if (!password) {
      setError('Password is required')
      return
    }
    setLoading(true)
    try {
      if (mode === 'register') {
        const { error: err } = await supabase.auth.signUp({ email: email.trim(), password })
        if (err) throw err
        setError(null)
        onSuccess?.()
        onClose()
        return
      }
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (err) throw err
      setError(null)
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="auth-title" className="modal__title">{mode === 'login' ? 'Login' : 'Register'}</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          {error && <p className="text-error" role="alert">{error}</p>}
          <div className="modal__label">
            <span className="modal__label-text">Email</span>
            <input
              type="email"
              className="modal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="modal__label">
            <span className="modal__label-text">Password</span>
            <input
              type="password"
              className="modal__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? MIN_PASSWORD_LENGTH : undefined}
              disabled={loading}
            />
          </div>
          {mode === 'register' && (
            <p className="modal__hint">Password must be at least {MIN_PASSWORD_LENGTH} characters.</p>
          )}
          <button type="submit" className="modal__button" disabled={loading}>
            {loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
