import { useState } from 'react'
import { Activity, ArrowRight, HeartPulse, LockKeyhole, UserRound } from 'lucide-react'
import { login } from '../services/authApi.js'

const INITIAL_CREDENTIALS = { username: '', password: '' }

function LoginPage({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState(INITIAL_CREDENTIALS)
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setCredentials((current) => ({ ...current, [name]: value }))
    setStatus(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setStatus(null)

    try {
      const result = await login(credentials)
      setStatus({ success: result.success, message: result.message })
      if (result.success) {
        onLoginSuccess(result.data?.username || credentials.username)
      }
    } catch {
      setStatus({
        success: false,
        message: 'Unable to connect to the API. Please start the backend and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="brand-panel" aria-label="Heart Disease Prediction">
        <div className="brand-mark"><HeartPulse size={25} strokeWidth={2.3} /></div>
        <div className="brand-name">Cardio<span>Sense</span></div>
        <div className="brand-copy">
          <p className="eyebrow">Heart Disease Prediction</p>
          <h1>Make every heartbeat count.</h1>
          <p className="intro">A clearer view of cardiovascular health starts with the right insight.</p>
        </div>
        <div className="signal-line" aria-hidden="true">
          <Activity size={19} />
          <span>Clinical intelligence, made human</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-mark"><HeartPulse size={22} /></div>
          <div className="welcome">
            <p className="eyebrow">Welcome back</p>
            <h2>Sign in to continue</h2>
            <p>Access your personalized prediction workspace.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <UserRound size={18} aria-hidden="true" />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {status && (
              <div className={`status ${status.success ? 'status-success' : 'status-error'}`} role="status">
                {status.message}
              </div>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="security-note"><span className="secure-dot" /> Your session is protected and private</p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
