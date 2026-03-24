import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMember, removeMember, fetchSingleSpace } from '../../features/spaces/spaceSlice'
import api from '../../services/api'
import Button from './Button'
import Spinner from './Spinner'
import { showToast } from './Toast'

export default function MemberPanel({ space, spaceId }) {
  const dispatch = useDispatch()
  const { user: currentUser } = useSelector((s) => s.auth)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [pendingAdd, setPendingAdd] = useState([])
  const [pendingRemove, setPendingRemove] = useState([])
  const [saving, setSaving] = useState(false)

  const existingParticipants = space?.participants || []
  const existingIds = existingParticipants.map((p) => p.user?._id || p.user)
  const pendingAddIds = pendingAdd.map((u) => u._id)
  const hasPendingChanges = pendingAdd.length > 0 || pendingRemove.length > 0

  // Derive key IDs
  const currentUserId = currentUser?._id
  const ownerId = space?.owner?._id || space?.owner  // owner can be populated obj or raw id

  const isOwner = currentUserId === ownerId

  const visibleMembers = [
    ...existingParticipants.filter((p) => {
      const uid = p.user?._id || p.user
      return !pendingRemove.includes(uid)
    }),
    ...pendingAdd.map((u) => ({ user: u, role: 'member', _pending: true })),
  ]

  // ── Debounced search — fires 400ms after user stops typing ─
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      handleSearch()
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [searchQuery])

  // ── Search ──────────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}&spaceId=${space._id}`)
      setSearchResults(res.data.results || res.data || [])
    } catch {
      showToast('Search failed', 'error')
    } finally {
      setSearching(false)
    }
  }

  // ── Stage add ───────────────────────────────────────────
  const stageAdd = (user) => {
    if (existingIds.includes(user._id) || pendingAddIds.includes(user._id)) {
      showToast('User already in this space', 'info')
      return
    }
    setPendingRemove((prev) => prev.filter((id) => id !== user._id))
    setPendingAdd((prev) => [...prev, user])
    setSearchResults([])
    setSearchQuery('')
    showToast(`${user.name} staged for adding`, 'info')
  }

  // ── Stage remove ────────────────────────────────────────
  const stageRemove = (userId) => {
    if (pendingAddIds.includes(userId)) {
      setPendingAdd((prev) => prev.filter((u) => u._id !== userId))
      return
    }
    setPendingRemove((prev) => [...prev, userId])
  }

  const unstageRemove = (userId) => {
    setPendingRemove((prev) => prev.filter((id) => id !== userId))
  }

  // ── Save all ────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    let success = true

    if (pendingAdd.length > 0) {
      const result = await dispatch(addMember({
        spaceId: space._id,
        members: pendingAdd.map((u) => u._id),
      }))
      if (addMember.rejected.match(result)) {
        showToast(result.payload || 'Failed to add members', 'error')
        success = false
      }
    }

    if (pendingRemove.length > 0) {
      const result = await dispatch(removeMember({
        spaceId: space._id,
        members: pendingRemove,
      }))
      if (removeMember.rejected.match(result)) {
        showToast(result.payload || 'Failed to remove members', 'error')
        success = false
      }
    }

    if (success) {
      await dispatch(fetchSingleSpace(space._id))
      showToast('Members updated!', 'success')
      setPendingAdd([])
      setPendingRemove([])
    }

    setSaving(false)
  }

  const handleDiscard = () => {
    setPendingAdd([])
    setPendingRemove([])
    showToast('Changes discarded', 'info')
  }

  // ── Render remove button logic ──────────────────────────
  // Rules:
  //   - Owner can remove anyone EXCEPT themselves
  //   - Non-owner can ONLY remove themselves (leave space)
  //   - Owner row never shows a remove button
  const getRemoveButton = (m, uid, isPendingRemove) => {
    const isSelf = uid === currentUserId
    const isOwnerRow = m.role === 'owner' || uid === ownerId
    const isPendingAddRow = m._pending === true

    // Owner row: never show remove button (owner can't be removed)
    if (isOwnerRow) return null

    // If current user is owner → can remove anyone except owner row (already handled above)
    // If current user is NOT owner → can only remove self (leave button)
    const canRemove = isOwner || isSelf

    if (!canRemove) return null

    if (isPendingRemove) {
      return (
        <button
          onClick={() => unstageRemove(uid)}
          style={{
            background: 'var(--danger-dim)', border: '1px solid rgba(255,84,112,0.25)',
            color: 'var(--danger)', cursor: 'pointer', fontSize: 11, fontWeight: 600,
            padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)',
          }}
        >
          Undo
        </button>
      )
    }

    return (
      <button
        onClick={() => stageRemove(uid)}
        title={isSelf && !isOwner ? 'Leave space' : 'Remove member'}
        style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', fontSize: 15, padding: '2px 6px',
          transition: 'color var(--transition)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        {isSelf && !isOwner ? '← Leave' : '✕'}
      </button>
    )
  }

  return (
    <div>
      {/* Search — only visible to owner */}
      {isOwner && (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Add Members
          </p>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              style={{
                width: '100%', background: 'var(--bg-secondary)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                padding: '9px 36px 9px 13px', color: 'var(--text-primary)',
                fontSize: 13, outline: 'none', fontFamily: 'var(--font-body)',
                transition: 'border-color var(--transition)',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            {searching && (
              <div style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              }}>
                <Spinner size={14} />
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', marginBottom: 20, overflow: 'hidden',
            }}>
              {searchResults.map((u) => {
                const alreadyIn = existingIds.includes(u._id) || pendingAddIds.includes(u._id)
                return (
                  <div key={u._id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderBottom: '1px solid var(--border)',
                    opacity: alreadyIn ? 0.5 : 1,
                  }}>
                    <Avatar user={u} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</p>
                    </div>
                    <Button size="sm" variant={alreadyIn ? 'secondary' : 'success'}
                      onClick={() => !alreadyIn && stageAdd(u)} disabled={alreadyIn}>
                      {alreadyIn ? 'Added' : '+ Stage'}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Pending Changes Banner */}
      {hasPendingChanges && (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, color: 'var(--warning)', fontWeight: 500 }}>
              Unsaved:
              {pendingAdd.length > 0 && ` ${pendingAdd.length} to add`}
              {pendingAdd.length > 0 && pendingRemove.length > 0 && ','}
              {pendingRemove.length > 0 && ` ${pendingRemove.length} to remove`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="ghost" onClick={handleDiscard}>Discard</Button>
            <Button size="sm" onClick={handleSave} loading={saving}>Save Changes</Button>
          </div>
        </div>
      )}

      {/* Members List */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        Members ({visibleMembers.length})
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visibleMembers.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
            No members yet.
          </p>
        ) : visibleMembers.map((m) => {
          const user = m.user
          const uid = user?._id
          const isPendingAdd = m._pending === true
          const isPendingRemove = pendingRemove.includes(uid)
          const isSelf = uid === currentUserId
          const isOwnerRow = m.role === 'owner' || uid === ownerId

          return (
            <div key={uid} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: isPendingAdd
                ? 'rgba(34,211,165,0.05)'
                : isPendingRemove
                  ? 'rgba(255,84,112,0.05)'
                  : 'var(--bg-secondary)',
              border: `1px solid ${
                isPendingAdd
                  ? 'rgba(34,211,165,0.3)'
                  : isPendingRemove
                    ? 'rgba(255,84,112,0.3)'
                    : 'var(--border)'
              }`,
              borderRadius: 'var(--radius-sm)', padding: '10px 14px',
              transition: 'all var(--transition)',
            }}>
              <Avatar user={user} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{
                    fontSize: 13, fontWeight: 500,
                    textDecoration: isPendingRemove ? 'line-through' : 'none',
                    color: isPendingRemove ? 'var(--text-muted)' : 'var(--text-primary)',
                  }}>
                    {user?.name}
                  </p>
                  {/* "You" badge */}
                  {isSelf && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: 'var(--accent-dim)', color: 'var(--accent)',
                      border: '1px solid rgba(108,99,255,0.25)',
                      padding: '1px 6px', borderRadius: 10,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      You
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {isOwnerRow ? 'owner' : m.role || 'member'}
                  </p>
                  {isPendingAdd && <Badge color="success" label="+ pending" />}
                  {isPendingRemove && (
                    <Badge
                      color="danger"
                      label={isSelf && !isOwner ? '− leaving' : '− removing'}
                    />
                  )}
                </div>
              </div>

              {getRemoveButton(m, uid, isPendingRemove)}
            </div>
          )
        })}
      </div>

      {/* Bottom save */}
      {hasPendingChanges && (
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={handleDiscard}>Discard All</Button>
          <Button onClick={handleSave} loading={saving}>
            Save Changes ({pendingAdd.length + pendingRemove.length})
          </Button>
        </div>
      )}
    </div>
  )
}

function Avatar({ user }) {
  return user?.picture ? (
    <img src={user.picture} alt={user.name}
      style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
  ) : (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: 'var(--accent-dim)', border: '1.5px solid var(--accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, color: 'var(--accent)',
    }}>
      {user?.name?.[0]?.toUpperCase() || 'U'}
    </div>
  )
}

function Badge({ color, label }) {
  const colors = {
    success: { bg: 'var(--success-dim)', text: 'var(--success)', border: 'rgba(34,211,165,0.25)' },
    danger:  { bg: 'var(--danger-dim)',  text: 'var(--danger)',  border: 'rgba(255,84,112,0.25)' },
  }
  const c = colors[color]
  return (
    <span style={{
      fontSize: 10, fontWeight: 700,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      padding: '1px 6px', borderRadius: 10,
      textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {label}
    </span>
  )
}