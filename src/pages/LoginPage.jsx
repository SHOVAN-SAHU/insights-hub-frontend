import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogle } from '../features/auth/authSlice'
import { showToast } from '../components/common/Toast'
import Toast from '../components/common/Toast'
import Spinner from '../components/common/Spinner'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const buttonRef = useRef(null)

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'rectangular',
        text: 'continue_with',
        width: 300,
      })
      window.google.accounts.id.prompt()
    }

    if (window.google) {
      initGoogle()
    } else {
      const interval = setInterval(() => {
        if (window.google) { clearInterval(interval); initGoogle() }
      }, 200)
      return () => clearInterval(interval)
    }
  }, [])

  const handleCredentialResponse = async (response) => {
    const result = await dispatch(loginWithGoogle(response.credential))
    if (loginWithGoogle.fulfilled.match(result)) {
      showToast('Welcome to Insights Hub!', 'success')
      navigate('/dashboard')
    } else {
      showToast(result.payload || 'Login failed', 'error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(34,211,165,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        padding: '0 20px',
        animation: 'fadeIn 0.5s ease',
      }}>
        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 40px',
          boxShadow: 'var(--shadow-lg), var(--shadow-accent)',
          textAlign: 'center',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 44, height: 44,
              background: 'var(--accent)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px var(--accent-glow)',
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="11" cy="11" r="3" fill="white"/>
              </svg>
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: '-0.04em',
            }}>
              Insights<span style={{ color: 'var(--accent)' }}>Hub</span>
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 10,
            letterSpacing: '-0.03em',
          }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 36, lineHeight: 1.5 }}>
            AI-powered document intelligence.<br />Ask anything, get instant answers.
          </p>

          {/* Features list */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 36,
            textAlign: 'left',
          }}>
            {[
              { icon: '📄', text: 'Upload and manage documents' },
              { icon: '🤖', text: 'Ask questions with AI (RAG)' },
              { icon: '👥', text: 'Collaborate in shared spaces' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Google Sign In Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14 }}>
                <Spinner size={20} /> Signing you in...
              </div>
            ) : (
              <div ref={buttonRef} style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden' }} />
            )}
            {error && (
              <p style={{
                fontSize: 13, color: 'var(--danger)',
                background: 'var(--danger-dim)',
                border: '1px solid rgba(255,84,112,0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 14px',
              }}>
                {error}
              </p>
            )}
          </div>

          <p style={{ marginTop: 28, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Secure authentication powered by Google
        </p>
      </div>
      <Toast />
    </div>
  )
}
