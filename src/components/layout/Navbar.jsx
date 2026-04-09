import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logoutUser } from '../../features/auth/authSlice'
import { showToast } from '../common/Toast'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((s) => s.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  // navRef wraps BOTH the sticky bar and the dropdown —
  // this way the outside-click handler never races with the toggle button
  const navRef = useRef(null)

  const handleLogout = async () => {
    setMenuOpen(false)
    await dispatch(logoutUser())
    navigate('/login')
    showToast('Logged out successfully', 'info')
  }

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/dashboard', label: 'Spaces', icon: '🗂️' },
    { to: '/subscription', label: 'Plans', icon: '💎' },
  ]

  // Close menu on outside click — scoped to the whole nav wrapper
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    // navRef on this wrapper div — covers both <nav> and the fixed dropdown
    <div ref={navRef}>
      <nav style={{
        background: 'rgba(17,17,24,0.85)',
        borderBottom: '1px solid var(--border)',
        padding: '0 20px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 200,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--accent)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px var(--accent-glow)',
            flexShrink: 0,
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20" height="20">
              <rect width="64" height="64" rx="14" fill="#6c63ff"/>
              <path d="M32 9 L51 20 L51 44 L32 55 L13 44 L13 20 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinejoin="round"/>
              <rect x="16" y="20" width="6" height="24" rx="2" fill="white"/>
              <rect x="13" y="20" width="12" height="5" rx="1.5" fill="white"/>
              <rect x="13" y="39" width="12" height="5" rx="1.5" fill="white"/>
              <rect x="30" y="20" width="6" height="24" rx="2" fill="white"/>
              <rect x="30" y="29.5" width="16" height="5" rx="2" fill="white"/>
              <rect x="40" y="20" width="6" height="24" rx="2" fill="white"/>
              <circle cx="51" cy="51" r="5" fill="rgba(255,255,255,0.4)"/>
              <circle cx="51" cy="51" r="2.5" fill="white"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>
            Insights<span style={{ color: 'var(--accent)' }}>Hub</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link key={link.to} to={link.to} style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-dim)' : 'transparent',
                transition: 'all var(--transition)',
                textDecoration: 'none',
              }}>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop User Info */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user?.picture ? (
            <img src={user.picture} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--border)' }} />
          ) : (
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent-dim)', border: '2px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'var(--accent)',
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span style={{
            fontSize: 14, color: 'var(--text-secondary)',
            maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'var(--bg-hover)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', padding: '6px 14px',
              borderRadius: 'var(--radius-sm)', fontSize: 13, cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'var(--danger)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
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
          style={{
            position: 'fixed',
            top: 60,
            left: 0,
            right: 0,
            zIndex: 199,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* User info row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
          }}>
            {user?.picture ? (
              <img src={user.picture} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--border)', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: 'var(--accent-dim)', border: '2px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, color: 'var(--accent)',
              }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div style={{ padding: '8px 12px' }}>
            {navLinks.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 15,
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--accent)' : 'var(--text-primary)',
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'background var(--transition)',
                    marginBottom: 2,
                  }}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Logout */}
          <div style={{ padding: '0 12px 8px' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 12px',
                borderRadius: 'var(--radius-sm)',
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
          </div>

          {/* Legal links */}
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '10px 12px 14px',
            display: 'flex', gap: 8,
          }}>
            <Link
              to="/terms"
              style={{
                flex: 1, padding: '9px 12px', textAlign: 'center',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: 13,
                textDecoration: 'none', transition: 'all var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              📋 Terms
            </Link>
            <Link
              to="/privacy"
              style={{
                flex: 1, padding: '9px 12px', textAlign: 'center',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: 13,
                textDecoration: 'none', transition: 'all var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              🔒 Privacy
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}