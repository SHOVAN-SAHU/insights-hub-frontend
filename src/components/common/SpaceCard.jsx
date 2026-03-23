import { useNavigate } from 'react-router-dom'

const SPACE_COLORS = [
  '#6c63ff', '#22d3a5', '#f59e0b', '#ff5470', '#3b82f6', '#a855f7',
]

function getColor(name = '') {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return SPACE_COLORS[code % SPACE_COLORS.length]
}

export default function SpaceCard({ space }) {
  const navigate = useNavigate()
  const color = getColor(space.name)
  const isTeam = space.type === 'team'

  // Format date
  const createdAt = space.createdAt
    ? new Date(space.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div
      onClick={() => navigate(`/space/${space._id}`)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 22,
        cursor: 'pointer',
        transition: 'all var(--transition)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* color accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
        borderRadius: '12px 12px 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: `${color}20`,
          border: `1.5px solid ${color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 18,
        }}>
          {space.emoji || (isTeam ? '👥' : '📁')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: 16, fontWeight: 700, marginBottom: 4,
            fontFamily: 'var(--font-display)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {space.name}
          </h3>
          {space.description ? (
            <p style={{
              fontSize: 13, color: 'var(--text-secondary)',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
              lineHeight: 1.5,
            }}>
              {space.description}
            </p>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No description
            </p>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginTop: 16, paddingTop: 14,
        borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}>
        {/* Type badge */}
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: isTeam ? 'var(--accent)' : 'var(--success)',
          background: isTeam ? 'var(--accent-dim)' : 'var(--success-dim)',
          border: `1px solid ${isTeam ? 'rgba(108,99,255,0.25)' : 'rgba(34,211,165,0.25)'}`,
          padding: '2px 8px', borderRadius: 20,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {isTeam ? '👥 Team' : '👤 Personal'}
        </span>

        {/* Created date */}
        {createdAt && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {createdAt}
          </span>
        )}

        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            fontSize: 12, color: color,
            background: `${color}18`,
            padding: '3px 10px', borderRadius: 20,
            fontWeight: 500,
          }}>
            Open →
          </span>
        </div>
      </div>
    </div>
  )
}