import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadDocument, deleteDocument } from '../../features/documents/documentSlice'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import { showToast } from '../common/Toast'

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ name }) {
  const ext = name?.split('.').pop()?.toLowerCase()
  const map = { pdf: '📕', doc: '📘', docx: '📘', txt: '📝', csv: '📊', xlsx: '📊', png: '🖼️', jpg: '🖼️' }
  return <span style={{ fontSize: 20 }}>{map[ext] || '📄'}</span>
}

export default function DocumentPanel({ spaceId }) {
  const dispatch = useDispatch()
  const { documents, loading, uploading } = useSelector((s) => s.documents)
  const fileRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const handleUpload = async (files) => {
    if (!files?.length) return
    const formData = new FormData()
    formData.append('file', files[0])
    const result = await dispatch(uploadDocument({ spaceId, formData }))
    if (uploadDocument.fulfilled.match(result)) {
      showToast('Document uploaded!', 'success')
    } else {
      showToast(result.payload || 'Upload failed', 'error')
    }
  }

  const handleDelete = async (docId) => {
    setDeletingId(docId)
    const result = await dispatch(deleteDocument(docId))
    setDeletingId(null)
    if (deleteDocument.fulfilled.match(result)) {
      showToast('Document deleted', 'info')
    } else {
      showToast(result.payload || 'Delete failed', 'error')
    }
  }

  return (
    <div>
      {/* Drop Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleUpload(e.dataTransfer.files) }}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'var(--accent-dim)' : 'var(--bg-secondary)',
          transition: 'all var(--transition)',
          marginBottom: 20,
        }}
      >
        <input ref={fileRef} type="file" multiple hidden onChange={(e) => handleUpload(e.target.files)} />
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Spinner size={28} />
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Uploading...</span>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 32, marginBottom: 10 }}>☁️</div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              Drop files here or click to browse
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              PDF, DOCX, TXT, CSV supported
            </p>
          </>
        )}
      </div>

      {/* Document List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <Spinner size={24} />
        </div>
      ) : documents.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '32px 20px',
          color: 'var(--text-muted)', fontSize: 14,
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>📂</span>
          No documents yet. Upload your first one!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </p>
          {documents.map((doc) => (
            <div key={doc._id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              transition: 'border-color var(--transition)',
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <FileIcon name={doc.name || doc.filename} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 500,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {doc.name || doc.filename || 'Untitled'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {formatBytes(doc.size)} · {doc.status || 'Ready'}
                </p>
              </div>
              <button
                onClick={() => handleDelete(doc._id)}
                disabled={deletingId === doc._id}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer',
                  padding: '4px 8px', borderRadius: 4,
                  fontSize: 16, transition: 'color var(--transition)',
                  display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {deletingId === doc._id ? <Spinner size={14} color="var(--danger)" /> : '🗑'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
