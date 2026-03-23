import { useState, useEffect } from 'react'

let toastFn = null

export function showToast(message, type = 'info') {
  if (toastFn) toastFn(message, type)
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastFn = (message, type) => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3500)
    }
    return () => { toastFn = null }
  }, [])

  const colorMap = {
    success: 'var(--success)',
    error: 'var(--danger)',
    info: 'var(--accent)',
    warning: 'var(--warning)',
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: 'var(--bg-card)',
          border: `1px solid ${colorMap[t.type] || colorMap.info}40`,
          borderLeft: `3px solid ${colorMap[t.type] || colorMap.info}`,
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          color: 'var(--text-primary)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          animation: 'fadeIn 0.3s ease',
          maxWidth: 320,
          pointerEvents: 'all',
        }}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
