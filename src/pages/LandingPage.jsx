import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'

const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Q&A',
    desc: 'Ask anything about your documents and get instant, accurate answers powered by state-of-the-art AI.',
  },
  {
    icon: '📂',
    title: 'Smart Document Upload',
    desc: 'Upload PDFs, Word docs, and more. InsightsHub indexes everything so your knowledge is always at hand.',
  },
  {
    icon: '🚀',
    title: 'Collaborative Spaces',
    desc: 'Organise knowledge into Spaces, invite teammates, and work together without losing context.',
  },
  {
    icon: '🔒',
    title: 'Enterprise-grade Security',
    desc: 'Your data stays yours. End-to-end encryption and granular access controls keep sensitive content safe.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const handleLogout = async () => {
    setMenuOpen(false)
    await dispatch(logoutUser())
    navigate('/')
  }

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 60,
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, flexShrink: 0 }}>
            <img src="/favicon.svg" alt="InsightsHub logo" style={{ width: 34, height: 34 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
            Insights<span style={{ color: 'var(--accent)' }}>Hub</span>
          </span>
        </div>

        {/* Desktop buttons */}
        <div className="landing-desktop-nav" style={{ display: 'flex', gap: 12 }}>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 20px', borderRadius: 'var(--radius-md)',
                background: 'transparent', border: '1px solid var(--danger)',
                color: 'var(--danger)', fontSize: 14, transition: 'var(--transition)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-dim)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '8px 20px', borderRadius: 'var(--radius-md)',
                background: 'transparent', border: '1px solid var(--border-light)',
                color: 'var(--text-primary)', fontSize: 14, transition: 'var(--transition)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            >
              Sign in
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 20px', borderRadius: 'var(--radius-md)',
              background: 'var(--accent)', border: 'none',
              color: '#fff', fontSize: 14, fontWeight: 600,
              boxShadow: 'var(--shadow-accent)', transition: 'var(--transition)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
          >
            Go to Dashboard
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="landing-mobile-btn"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text-primary)', cursor: 'pointer',
            width: 38, height: 38, borderRadius: 'var(--radius-sm)',
            display: 'none', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: 60, left: 0, right: 0,
            zIndex: 199,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ padding: '12px' }}>
            {!isAuthenticated && (
              <button
                onClick={() => { setMenuOpen(false); navigate('/login') }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px', borderRadius: 'var(--radius-sm)',
                  background: 'transparent', border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  fontSize: 15, fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  marginBottom: 8, transition: 'all var(--transition)',
                }}
              >
                <span>👤</span> Sign in
              </button>
            )}
            <button
              onClick={() => { setMenuOpen(false); navigate('/dashboard') }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px', borderRadius: 'var(--radius-sm)',
                background: 'var(--accent)', border: 'none',
                color: '#fff', cursor: 'pointer',
                fontSize: 15, fontWeight: 600,
                fontFamily: 'var(--font-body)',
                marginBottom: isAuthenticated ? 8 : 0,
                transition: 'all var(--transition)',
              }}
            >
              <span>🗂️</span> Go to Dashboard
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--danger-dim)',
                  border: '1px solid rgba(255,84,112,0.2)',
                  color: 'var(--danger)', cursor: 'pointer',
                  fontSize: 15, fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  transition: 'all var(--transition)',
                }}
              >
                <span>🚪</span> Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{
        maxWidth: 860, margin: '0 auto', padding: '80px 24px 60px',
        textAlign: 'center', animation: 'fadeIn 0.6s ease forwards',
      }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: 999,
          background: 'var(--accent-dim)', border: '1px solid rgba(108,99,255,0.3)',
          color: 'var(--accent)', fontSize: 13, fontWeight: 500, marginBottom: 28,
          letterSpacing: '0.04em',
        }}>
          ✦ AI Knowledge Management, Reimagined
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 24,
        }}>
          Turn your documents into{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--accent), #a78bfa, var(--success))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            instant answers
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--text-secondary)',
          lineHeight: 1.7, maxWidth: 620, margin: '0 auto 44px',
        }}>
          InsightsHub lets you upload documents, ask questions in plain English, and collaborate with your team — all in one intelligent workspace.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 32px', borderRadius: 'var(--radius-md)',
                background: 'var(--accent)', border: 'none',
                color: '#fff', fontSize: 16, fontWeight: 700,
                boxShadow: '0 0 40px rgba(108,99,255,0.35)', transition: 'var(--transition)',
                cursor: 'pointer', letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Get Started — It's Free
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '14px 32px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)', border: '1px solid var(--border-light)',
              color: 'var(--text-primary)', fontSize: 16, fontWeight: 600,
              transition: 'var(--transition)', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Open Dashboard →
          </button>
        </div>

        {/* ── Product Preview ── */}
        <div style={{ position: 'relative', margin: '64px auto 0', maxWidth: 720 }}>

          {/* Background glow */}
          <div style={{
            position: 'absolute', inset: '-40px',
            background: 'radial-gradient(ellipse at 50% 60%, rgba(108,99,255,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Floating stat — top left */}
          <div className="floating-stat" style={{
            position: 'absolute', top: -18, left: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)', padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: 'var(--shadow-md)', zIndex: 2,
            animation: 'fadeIn 0.6s ease 0.2s both',
          }}>
            <span style={{ fontSize: 20 }}>📄</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>12,000+</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Docs indexed</div>
            </div>
          </div>

          {/* Floating stat — top right */}
          <div className="floating-stat" style={{
            position: 'absolute', top: -18, right: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)', padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: 'var(--shadow-md)', zIndex: 2,
            animation: 'fadeIn 0.6s ease 0.35s both',
          }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{'<2s'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Avg. answer time</div>
            </div>
          </div>

          {/* Main mock card */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)', marginTop: 28,
          }}>
            {/* Card top bar */}
            <div style={{
              background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
              padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5470', opacity: 0.7 }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', opacity: 0.7 }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22d3a5', opacity: 0.7 }} />
              <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                InsightsHub · Q&amp;A
              </span>
            </div>

            {/* Chat messages */}
            <div style={{ padding: '24px 24px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* User question */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  background: 'var(--accent)', color: '#fff',
                  borderRadius: '14px 14px 4px 14px',
                  padding: '10px 16px', fontSize: 13, maxWidth: '75%', lineHeight: 1.5,
                }}>
                  What were the key findings from the Q3 financial report?
                </div>
              </div>

              {/* AI answer */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--accent-dim)', border: '1px solid rgba(108,99,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>🧠</div>
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: '14px 14px 14px 4px',
                  padding: '10px 16px', fontSize: 13, maxWidth: '80%', lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}>
                  Based on your <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Q3_Financial_Report.pdf</span>, revenue grew <span style={{ color: 'var(--success)', fontWeight: 600 }}>+24% YoY</span>, operating costs reduced by 11%, and the APAC region was the top performer with $4.2M in new ARR.
                </div>
              </div>

              {/* Source chip */}
              <div style={{ display: 'flex', gap: 8, paddingLeft: 38 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 999,
                  background: 'var(--accent-dim)', border: '1px solid rgba(108,99,255,0.25)',
                  fontSize: 11, color: 'var(--accent)',
                }}>
                  📎 Q3_Financial_Report.pdf · p.7
                </div>
              </div>

              {/* Typing input bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '10px 14px', marginTop: 8,
              }}>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text-muted)' }}>Ask anything about your documents…</span>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'var(--accent)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>↑</div>
              </div>
            </div>

            {/* Bottom padding */}
            <div style={{ height: 16 }} />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{
          textAlign: 'center', fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700,
          marginBottom: 12, letterSpacing: '-0.02em',
        }}>
          Everything you need to work smarter
        </h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-secondary)', fontSize: 16,
          maxWidth: 480, margin: '0 auto 56px',
        }}>
          Built for modern teams who need answers fast, not filing cabinets.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '28px 24px',
                transition: 'var(--transition)', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: 30, marginBottom: 16,
                width: 52, height: 52, borderRadius: 'var(--radius-md)',
                background: 'var(--accent-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 17,
                fontWeight: 700, marginBottom: 8,
              }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 100px', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '48px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Accent glow */}
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,99,255,0.2), transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'inline-flex', gap: 6, alignItems: 'center',
            padding: '5px 14px', borderRadius: 999,
            background: 'var(--success-dim)', border: '1px solid rgba(34,211,165,0.25)',
            color: 'var(--success)', fontSize: 12, fontWeight: 600, marginBottom: 20,
          }}>
            ✓ Always free to start
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
            fontWeight: 700, marginBottom: 14,
          }}>
            Simple, transparent pricing
          </h2>
          <p style={{
            color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 32,
          }}>
            Start for free with your first Space and documents. Upgrade to <strong style={{ color: 'var(--accent)' }}>Pro</strong> when your team needs more power — unlimited Spaces, priority AI, and advanced analytics.
          </p>
          <button
            onClick={() => navigate('/subscription')}
            style={{
              padding: '12px 28px', borderRadius: 'var(--radius-md)',
              background: 'var(--accent)', border: 'none',
              color: '#fff', fontSize: 15, fontWeight: 600,
              boxShadow: 'var(--shadow-accent)', transition: 'var(--transition)', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
          >
            View Plans
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28 }}>
            <img src="/favicon.svg" alt="InsightsHub logo" style={{ width: 28, height: 28 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
            Insights<span style={{ color: 'var(--accent)' }}>Hub</span>
          </span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Made with <span style={{ color: 'var(--danger)' }}>♥</span> by{' '}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Shovan</span>
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          © {new Date().getFullYear()} InsightsHub · Your knowledge, amplified by AI.
        </p>
      </footer>

    </div>
  )
}