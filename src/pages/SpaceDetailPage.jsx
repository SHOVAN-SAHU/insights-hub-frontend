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
  const { user: currentUser } = useSelector((s) => s.auth)

  const [activeTab, setActiveTab] = useState('Documents')
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [saving, setSaving] = useState(false)

  const space = spaces.find((s) => s._id === spaceId)
  const ownerId = space?.owner?._id || space?.owner
  const isOwner = currentUser?._id === ownerId
  const participantCount = space?.participants?.length ?? 0

  useEffect(() => { if (spaces.length === 0) dispatch(fetchSpaces()) }, [dispatch, spaces.length])
  useEffect(() => {
    if (spaceId) { dispatch(fetchDocuments(spaceId)); dispatch(clearAnswers()) }
    return () => { dispatch(clearDocuments()) }
  }, [dispatch, spaceId])
  useEffect(() => {
    if (space) { dispatch(setCurrentSpace(space)); setEditName(space.name || ''); setEditDesc(space.description || '') }
  }, [space, dispatch])

  const handleSaveSettings = async () => {
    setSaving(true)
    const result = await dispatch(updateSpace({ spaceId, data: { name: editName, description: editDesc } }))
    setSaving(false)
    if (updateSpace.fulfilled.match(result)) showToast('Space updated!', 'success')
    else showToast(result.payload || 'Update failed', 'error')
  }

  if (spacesLoading) return (
    <PageLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Spinner size={36} />
      </div>
    </PageLayout>
  )

  if (!space) return (
    <PageLayout>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ marginBottom: 8 }}>Space not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This space may have been deleted or you don't have access.</p>
        <Button onClick={() => navigate('/dashboard')}>← Back to Dashboard</Button>
      </div>
    </PageLayout>
  )

  return (
    <PageLayout>
      <style>{`
        .space-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
        .tabs-row { display: flex; gap: 2; margin-bottom: 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 4px; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .tabs-row::-webkit-scrollbar { display: none; }
        .tab-btn { padding: 8px 14px; border-radius: var(--radius-sm); border: none; cursor: pointer; font-size: 13px; transition: all var(--transition); font-family: var(--font-body); white-space: nowrap; flex-shrink: 0; }
        .tab-content { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; min-height: 300px; }
        @media (max-width: 640px) {
          .space-header { gap: 12px; }
          .space-title { font-size: 20px !important; }
          .tab-content { padding: 16px; }
        }
      `}</style>

      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Breadcrumb */}
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', fontSize: 13, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: 0, fontFamily: 'var(--font-body)',
        }}>
          ← All Spaces
        </button>

        {/* Space Header */}
        <div className="space-header" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '20px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent), var(--success))' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: 'var(--accent-dim)', border: '1.5px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>
              {space.emoji || (space.type === 'team' ? '👥' : '📁')}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 className="space-title" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {space.name}
              </h1>
              {space.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>{space.description}</p>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Chip label={space.type === 'team' ? '👥 Team' : '👤 Personal'} color={space.type === 'team' ? 'accent' : 'success'} />
                <Chip label={`${participantCount} member${participantCount !== 1 ? 's' : ''}`} />
              </div>
            </div>
          </div>
          {isOwner && (
            <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)} style={{ flexShrink: 0 }}>
              ⚙ Settings
            </Button>
          )}
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="tabs-row">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="tab-btn" style={{
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              fontWeight: activeTab === tab ? 600 : 400,
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'Documents' && <DocumentPanel spaceId={spaceId} />}
          {activeTab === 'Ask AI' && <AskPanel spaceId={spaceId} />}
          {activeTab === 'Members' && <MemberPanel space={space} spaceId={spaceId} />}
          {activeTab === 'Settings' && (
            isOwner ? (
              <div style={{ maxWidth: 480 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Space Settings</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Only the space owner can edit these settings.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Input label="Space Name" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Space name" />
                  <Input label="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Describe this space..." multiline rows={3} />
                  <div><Button onClick={handleSaveSettings} loading={saving} disabled={!editName.trim()}>Save Changes</Button></div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240, textAlign: 'center', gap: 12 }}>
                <span style={{ fontSize: 40 }}>🔒</span>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>Owner only</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 300 }}>Only the space owner can change the name and description.</p>
              </div>
            )
          )}
        </div>
      </div>

      {isOwner && (
        <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Space">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <Input label="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} multiline rows={3} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
              <Button onClick={async () => { await handleSaveSettings(); setShowEdit(false) }} loading={saving}>Save</Button>
            </div>
          </div>
        </Modal>
      )}
    </PageLayout>
  )
}

function Chip({ label, color }) {
  const colorMap = {
    accent:  { bg: 'var(--accent-dim)',  text: 'var(--accent)',  border: 'rgba(108,99,255,0.25)' },
    success: { bg: 'var(--success-dim)', text: 'var(--success)', border: 'rgba(34,211,165,0.25)' },
    default: { bg: 'var(--bg-secondary)', text: 'var(--text-muted)', border: 'var(--border)' },
  }
  const c = colorMap[color] || colorMap.default
  return (
    <span style={{ fontSize: 12, color: c.text, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: '2px 10px', fontWeight: color ? 600 : 400 }}>
      {label}
    </span>
  )
}