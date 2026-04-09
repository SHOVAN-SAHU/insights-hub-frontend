import { useNavigate } from 'react-router-dom'

const sections = [
  {
    title: '1. Introduction',
    content: `InsightsHub ("we", "our", or "us") is committed to protecting your personal data. This Privacy Policy explains what information we collect, how we use it, how we store it, and your rights in relation to it. This policy is compliant with India's Digital Personal Data Protection Act (DPDPA) 2023.

By using InsightsHub, you consent to the data practices described in this policy.`,
  },
  {
    title: '2. Information We Collect',
    content: `We collect the following categories of data:

Account Data (via Google OAuth):
• Full name
• Email address
• Google profile picture URL

Document Data:
• Files you upload: PDF, CSV, TXT, DOCX
• Extracted text content from those files
• Semantic embeddings derived from the extracted content

Usage Data:
• Questions you ask the platform
• Timestamps of actions
• Subscription and payment status (not raw payment details)`,
  },
  {
    title: '3. How We Store Your Data',
    content: `Your data is stored across the following systems:

• ElasticLake Object Storage — raw uploaded files are stored here securely.
• MongoDB — extracted text chunks from your documents are stored here.
• Qdrant Vector Database — semantic embeddings of your document content are stored here to enable AI-powered search and Q&A.
• Our primary application database — your account information (name, email, profile picture, subscription status) is stored here.

All databases are access-controlled and not publicly accessible.`,
  },
  {
    title: '4. How We Use Your Data',
    content: `We use your data exclusively to provide and improve the InsightsHub service:

• To authenticate you via Google OAuth.
• To process, index, and store your uploaded documents.
• To generate AI answers to your questions based on your document content.
• To manage your subscription and payment status.
• To communicate with you about your account or service updates.

We do not use your documents or questions to train AI models. We do not sell or share your data with third parties for advertising.`,
  },
  {
    title: '5. AI Processing & Third-Party LLM',
    content: `InsightsHub uses Groq, a cloud-hosted AI inference provider, to generate answers from your document content. When you ask a question, relevant text chunks from your documents are sent to Groq's API along with your query to produce an answer.

Please note: Groq processes this data under their own privacy and data handling policies. We send only the minimum necessary context (relevant document chunks) and do not send your personal account details to Groq.`,
  },
  {
    title: '6. Payment Data',
    content: `Payments are processed by Razorpay. InsightsHub does not collect or store your credit/debit card numbers, UPI credentials, or any raw payment details. We only store your subscription plan, payment status, and plan expiry date.

Razorpay processes your payment data under their own Privacy Policy and PCI-DSS compliance standards.`,
  },
  {
    title: '7. Data Retention',
    content: `We retain your data for as long as your account is active. If you delete your account:

• Your uploaded files will be removed from ElasticLake object storage.
• Your extracted text chunks will be deleted from MongoDB.
• Your embeddings will be removed from Qdrant.
• Your account data will be deleted from our primary database.

Note: Some anonymised usage logs may be retained for up to 90 days for security and diagnostic purposes.`,
  },
  {
    title: '8. Your Rights (DPDPA 2023)',
    content: `Under India's Digital Personal Data Protection Act (DPDPA) 2023, you have the following rights:

• Right to Access — You may request a summary of the personal data we hold about you.
• Right to Correction — You may request correction of inaccurate personal data.
• Right to Erasure — You may request deletion of your personal data.
• Right to Grievance Redressal — You may raise a complaint about how your data is handled.
• Right to Nominate — You may nominate a person to exercise your rights on your behalf in case of death or incapacity.

To exercise any of these rights, please contact us at shovansahu000@gmail.com.`,
  },
  {
    title: '9. Cookies & Local Storage',
    content: `InsightsHub may use browser localStorage or session cookies to maintain your login session and user preferences. We do not use third-party tracking cookies or advertising cookies. You can clear cookies via your browser settings at any time, though this will log you out of the platform.`,
  },
  {
    title: '10. Data Security',
    content: `We take reasonable technical and organisational measures to protect your data from unauthorised access, loss, or misuse. These include access-controlled infrastructure, encrypted connections (HTTPS), and restricted access to production databases. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '11. Children\'s Privacy',
    content: `InsightsHub is not intended for use by individuals under the age of 18. We do not knowingly collect personal data from children. If you believe a minor has created an account on our platform, please contact us and we will promptly delete the data.`,
  },
  {
    title: '12. Changes to this Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on the platform. Continued use of InsightsHub after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: '13. Contact & Grievance Officer',
    content: `For any privacy-related questions, data requests, or grievances, please contact:\n\nInsightsHub\nEmail: shovansahu000@gmail.com\nWebsite: https://insightshub.in\n\nWe aim to respond to all data-related requests within 30 days.`,
  },
]

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 60,
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{ width: 34, height: 34, flexShrink: 0 }}>
            <img src="/favicon.svg" alt="InsightsHub logo" style={{ width: 34, height: 34 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
            Insights<span style={{ color: 'var(--accent)' }}>Hub</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 20px', borderRadius: 'var(--radius-md)',
            background: 'transparent', border: '1px solid var(--border-light)',
            color: 'var(--text-primary)', fontSize: 14, transition: 'var(--transition)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        >
          ← Back to Home
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        maxWidth: 860, margin: '0 auto', padding: '64px 24px 40px',
        textAlign: 'center', animation: 'fadeIn 0.6s ease forwards',
      }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: 999,
          background: 'var(--accent-dim)', border: '1px solid rgba(108,99,255,0.3)',
          color: 'var(--accent)', fontSize: 13, fontWeight: 500, marginBottom: 24,
          letterSpacing: '0.04em',
        }}>
          🔒 Privacy
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 16,
        }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 12 }}>
          Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p style={{
          color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7,
          maxWidth: 580, margin: '0 auto',
        }}>
          Your privacy matters to us. This policy explains exactly what data we collect, how it's stored, and the rights you have over it.
        </p>
      </section>

      {/* QUICK SUMMARY CARD */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 8px' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(34,211,165,0.3)',
          borderRadius: 'var(--radius-lg)', padding: '24px 32px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20,
        }}>
          {[
            { icon: '🚫', label: 'No ads, ever' },
            { icon: '🤝', label: 'No data selling' },
            { icon: '🧠', label: 'No AI training on your docs' },
            { icon: '🗑️', label: 'Delete your data anytime' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '20px 24px 80px' }}>
        {sections.map((s, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '28px 32px',
              marginBottom: 12, transition: 'var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: 12,
            }}>
              {s.title}
            </h2>
            <p style={{
              color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.85,
              whiteSpace: 'pre-line', margin: 0,
            }}>
              {s.content}
            </p>
          </div>
        ))}

        <div style={{
          marginTop: 8, padding: '24px 32px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', textAlign: 'center',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Also read our{' '}
            <span
              onClick={() => navigate('/terms')}
              style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
            >
              Terms &amp; Conditions
            </span>
            {' '}for the full usage agreement.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28 }}>
            <img src="/favicon.svg" alt="InsightsHub logo" style={{ width: 28, height: 28 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
            Insights<span style={{ color: 'var(--accent)' }}>Hub</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Made with <span style={{ color: 'var(--danger)' }}>♥</span> by{' '}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Shovan</span>
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          © {new Date().getFullYear()} InsightsHub · Your knowledge, amplified by AI.
        </p>
      </footer>

    </div>
  )
}