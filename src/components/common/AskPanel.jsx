import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { askQuestion, clearAnswers } from '../../features/ask/askSlice'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import { showToast } from '../common/Toast'

function AnswerBubble({ item }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeIn 0.35s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          background: 'var(--accent)', color: '#fff',
          padding: '10px 14px', borderRadius: '14px 14px 4px 14px',
          fontSize: 14, maxWidth: '85%', lineHeight: 1.5, wordBreak: 'break-word',
        }}>
          {item.question}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: 'var(--accent-dim)', border: '1.5px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, marginTop: 2,
        }}>🧠</div>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          padding: '12px 14px', borderRadius: '4px 14px 14px 14px',
          fontSize: 14, lineHeight: 1.65, color: 'var(--text-primary)',
          maxWidth: '88%', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {typeof item.answer === 'string' ? item.answer : item.answer?.answer || item.answer?.text || JSON.stringify(item.answer)}
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AskPanel({ spaceId }) {
  const dispatch = useDispatch()
  const { answers, loading } = useSelector((s) => s.ask)
  const [question, setQuestion] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [answers, loading])

  const handleAsk = async () => {
    const q = question.trim()
    if (!q) return
    setQuestion('')
    const result = await dispatch(askQuestion({ spaceId, question: q }))
    if (askQuestion.rejected.match(result)) showToast(result.payload || 'Failed to get answer', 'error')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 380 }}>
      {/* Conversation */}
      <div style={{
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 18,
        padding: '12px 4px', minHeight: 240, maxHeight: 420,
      }}>
        {answers.length === 0 && !loading ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 36, marginBottom: 10 }}>💬</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Ask anything about your documents</p>
            <p style={{ fontSize: 13 }}>AI will search through all documents to find answers.</p>
          </div>
        ) : answers.map((item) => <AnswerBubble key={item.id} item={item} />)}

        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-dim)', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🧠</div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '4px 14px 14px 14px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
              <Spinner size={14} /> Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 8 }}>
        {answers.length > 0 && (
          <button onClick={() => dispatch(clearAnswers())} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', marginBottom: 10, padding: '2px 0' }}>
            Clear conversation
          </button>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question… (Enter to send)"
            rows={2}
            style={{
              flex: 1, background: 'var(--bg-secondary)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              padding: '10px 12px', color: 'var(--text-primary)',
              fontSize: 14, resize: 'none', outline: 'none',
              fontFamily: 'var(--font-body)', lineHeight: 1.5,
              transition: 'border-color var(--transition)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          <Button onClick={handleAsk} loading={loading} disabled={!question.trim() || loading}
            style={{ alignSelf: 'flex-end', minWidth: 56, height: 42, fontSize: 13 }}>
            Send
          </Button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Shift+Enter for new line · Enter to send</p>
      </div>
    </div>
  )
}