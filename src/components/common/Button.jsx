import Spinner from './Spinner'

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  style = {},
}) {
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-light)',
    },
    danger: {
      background: 'var(--danger-dim)',
      color: 'var(--danger)',
      border: '1px solid rgba(255,84,112,0.25)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none',
    },
    success: {
      background: 'var(--success-dim)',
      color: 'var(--success)',
      border: '1px solid rgba(34,211,165,0.25)',
    },
  }

  const sizes = {
    sm: { padding: '6px 14px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14 },
    lg: { padding: '13px 28px', fontSize: 15 },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all var(--transition)',
        letterSpacing: '-0.01em',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.currentTarget.style.background = 'var(--accent-hover)'
          if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--accent)'
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.background = 'var(--accent)'
        if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--border-light)'
      }}
    >
      {loading && <Spinner size={14} color={variant === 'primary' ? '#fff' : 'var(--accent)'} />}
      {children}
    </button>
  )
}
