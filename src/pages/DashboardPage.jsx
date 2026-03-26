import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSpaces, createSpace } from '../features/spaces/spaceSlice'
import PageLayout from '../components/layout/PageLayout'
import SpaceCard from '../components/common/SpaceCard'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import { showToast } from '../components/common/Toast'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { spaces, loading } = useSelector((s) => s.spaces)
  const { user } = useSelector((s) => s.auth)

  const [showCreate, setShowCreate] = useState(false)
  const [spaceName, setSpaceName] = useState('')
  const [spaceDesc, setSpaceDesc] = useState('')
  const [spaceType, setSpaceType] = useState('personal')
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { dispatch(fetchSpaces()) }, [dispatch])

  const handleCreateSpace = async () => {
    if (!spaceName.trim()) return
    setCreating(true)
    const result = await dispatch(createSpace({ name: spaceName.trim(), description: spaceDesc.trim(), type: spaceType }))
    setCreating(false)
    if (createSpace.fulfilled.match(result)) {
      showToast('Space created!', 'success')
      setShowCreate(false)
      setSpaceName(''); setSpaceDesc(''); setSpaceType('personal')
    } else {
      showToast(result.payload || 'Failed to create space', 'error')
    }
  }

  const filtered = Array.isArray(spaces)
    ? spaces.filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()))
    : []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const planColor = user?.plan === 'PRO' ? 'var(--accent)' : user?.plan === 'BUSINESS' ? 'var(--warning)' : 'var(--success)'
  const isFree = !user?.plan || user.plan === 'FREE'
  const expiry = user?.currentPeriodEnd
    ? new Date(user.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null
  const expirySub = isFree ? 'No expiry · Free forever' : expiry ? `Expires ${expiry}` : 'Active plan'

  const stats = [
    { label: 'Current Plan', value: user?.plan || 'FREE', sub: expirySub, icon: '💎', color: planColor },
    { label: 'Uploads Used', value: user?.uploadUsed ?? 0, sub: 'documents uploaded', icon: '☁️', color: 'var(--success)' },
    { label: 'Questions Asked', value: user?.askedUsed ?? 0, sub: 'AI queries used', icon: '🧠', color: '#3b82f6' },
  ]

  return (
    <PageLayout>
      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .spaces-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
        .dash-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 36px; }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; gap: 10px; }
          .spaces-grid { grid-template-columns: 1fr !important; }
          .dash-header { margin-bottom: 24px; }
          .dash-header h1 { font-size: 24px !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div className="dash-header">
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>
              {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>Your Spaces</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 6 }}>
              Organize documents and ask AI questions within each space.
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} size="md">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Space
          </Button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 32 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{stat.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search spaces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '10px 16px',
              color: 'var(--text-primary)', fontSize: 14,
              width: '100%', maxWidth: 360, outline: 'none',
              fontFamily: 'var(--font-body)', transition: 'border-color var(--transition)',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Spaces Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Spinner size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--bg-card)', border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{search ? '🔍' : '🗂️'}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
              {search ? 'No spaces found' : 'Create your first space'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
              {search ? 'Try a different search term.' : 'Organize your documents into spaces to get started.'}
            </p>
            {!search && <Button onClick={() => setShowCreate(true)}>Create Space</Button>}
          </div>
        ) : (
          <div className="spaces-grid">
            {filtered.map((space) => <SpaceCard key={space._id} space={space} />)}
          </div>
        )}
      </div>

      {/* Create Space Modal */}
      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setSpaceType('personal') }} title="Create New Space">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Space Name *" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} placeholder="e.g. Research Papers, Product Docs..." />
          <Input label="Description (optional)" value={spaceDesc} onChange={(e) => setSpaceDesc(e.target.value)} placeholder="What is this space for?" multiline rows={3} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Space Type</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['personal', 'team'].map((type) => (
                <button key={type} onClick={() => setSpaceType(type)} style={{
                  flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${spaceType === type ? 'var(--accent)' : 'var(--border)'}`,
                  background: spaceType === type ? 'var(--accent-dim)' : 'var(--bg-secondary)',
                  color: spaceType === type ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 13, fontWeight: spaceType === type ? 600 : 400,
                  fontFamily: 'var(--font-body)', transition: 'all var(--transition)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <span>{type === 'personal' ? '👤' : '👥'}</span>
                  <span style={{ textTransform: 'capitalize' }}>{type}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {spaceType === 'personal' ? 'Only you can access this space.' : 'Invite team members to collaborate.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => { setShowCreate(false); setSpaceType('personal') }}>Cancel</Button>
            <Button onClick={handleCreateSpace} loading={creating} disabled={!spaceName.trim()}>Create Space</Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}