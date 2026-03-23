export default function Input({
  label, value, onChange, placeholder, type = 'text',
  error, disabled = false, style = {}, multiline = false, rows = 4,
}) {
  const sharedStyle = {
    width: '100%',
    background: 'var(--bg-secondary)',
    border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: 14,
    transition: 'border-color var(--transition)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    resize: multiline ? 'vertical' : 'none',
    ...style,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={sharedStyle}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={sharedStyle}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
        />
      )}
      {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}
