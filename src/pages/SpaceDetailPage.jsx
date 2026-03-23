import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSpaces, setCurrentSpace, updateSpace } from '../features/spaces/spaceSlice'
import { fetchDocuments, clearDocuments } from '../features/documents/documentSlice'
import { clearAnswers } from '../features/ask/askSlice'
import PageLayout from '../components/layout/PageLayout'
import DocumentPanel from '../components/common/DocumentPanel'
import AskPanel from '../components/common/AskPanel'
import MemberPanel from '../components/common/MemberPanel'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import { showToast } from '../components/common/Toast'

const TABS = ['Documents', 'Ask AI', 'Members', 'Settings']

export default function SpaceDetailPage() {
  const { spaceId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { spaces, loading: spacesLoading } = useSelector((s) => s.spaces)

  const [activeTab, setActiveTab] = useState('Documents')
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [saving, setSaving] = useState(false)

  const space = spaces.find((s) => s._id === spaceId)

  // participants count from the populated array
  const participantCount = space?.participants?.length ?? 0

  useEffect(() => {
    if (spaces.length === 0) dispatch(fetchSpaces())
  }, [dispatch, spaces.length])

  useEffect(() => {
    if (spaceId) {
      dispatch(fetchDocuments(spaceId))
      dispatch(clearAnswers())
    }
    return () => { dispatch(clearDocuments()) }
  }, [dispatch, spaceId])

  useEffect(() => {
    if (space) {
      dispatch(setCurrentSpace(space))
      setEditName(space.name || '')
      setEditDesc(space.description || '')
    }
  }, [space, dispatch])

  const handleSaveSettings = async () => {
    setSaving(true)
    const result = await dispatch(updateSpace({ spaceId, data: { name: editName, description: editDesc } }))
    setSaving(false)
    if (updateSpace.fulfilled.match(result)) {
      showToast('Space updated!', 'success')
    } else {
      showToast(result.payload || 'Update failed', 'error')
    }
  }

  if (spacesLoading) {
    return (
      <PageLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Spinner size={36} />
        </div>
      </PageLayout>
    )
  }

  if (!space) {
    return (
      <PageLayout>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ marginBottom: 8 }}>Space not found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            This space may have been deleted or you don't have access.
          </p>
          <Button onClick={() => navigate('/dashboard')}>← Back to Dashboard</Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: 13, marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: 0, fontFamily: 'var(--font-body)',
          }}
        >
          ← All Spaces
        </button>

        {/* Space Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 32,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px 28px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, var(--accent), var(--success))',
          }} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 50, height: 50, borderRadius: 12,
              background: 'var(--accent-dim)', border: '1.5px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>
              {space.emoji || (space.type === 'team' ? '👥' : '📁')}
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>
                {space.name}
              </h1>
              {space.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{space.description}</p>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                {/* type badge */}
                <Chip
                  label={space.type === 'team' ? '👥 Team' : '👤 Personal'}
                  color={space.type === 'team' ? 'accent' : 'success'}
                />
                {/* participant count */}
                <Chip label={`${participantCount} member${participantCount !== 1 ? 's' : ''}`} />
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
            ⚙ Settings
          </Button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 2, marginBottom: 28,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: 4,
          width: 'fit-content',
        }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === tab ? 'var(--accent)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                transition: 'all var(--transition)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '28px',
          minHeight: 400,
        }}>
          {activeTab === 'Documents' && <DocumentPanel spaceId={spaceId} />}
          {activeTab === 'Ask AI' && <AskPanel spaceId={spaceId} />}
          {activeTab === 'Members' && <MemberPanel space={space} spaceId={spaceId} />}
          {activeTab === 'Settings' && (
            <div style={{ maxWidth: 480 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Space Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Input
                  label="Space Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Space name"
                />
                <Input
                  label="Description"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Describe this space..."
                  multiline rows={3}
                />
                <div>
                  <Button onClick={handleSaveSettings} loading={saving} disabled={!editName.trim()}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Settings Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Space">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <Input label="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} multiline rows={3} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={async () => { await handleSaveSettings(); setShowEdit(false) }} loading={saving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}

function Chip({ label, color }) {
  const colorMap = {
    accent: { bg: 'var(--accent-dim)', text: 'var(--accent)', border: 'rgba(108,99,255,0.25)' },
    success: { bg: 'var(--success-dim)', text: 'var(--success)', border: 'rgba(34,211,165,0.25)' },
    default: { bg: 'var(--bg-secondary)', text: 'var(--text-muted)', border: 'var(--border)' },
  }
  const c = colorMap[color] || colorMap.default
  return (
    <span style={{
      fontSize: 12, color: c.text,
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 20, padding: '2px 10px',
      fontWeight: color ? 600 : 400,
    }}>
      {label}
    </span>
  )
}