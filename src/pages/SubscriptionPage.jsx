import { useEffect, useState } from 'react'
import api from '../services/api'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { showToast } from '../components/common/Toast'

function PlanCard({ plan, onSubscribe, subscribing }) {
  const isPopular = plan.name === 'PRO'
  const isFree = plan.price === 0
  // price is in paise → convert to rupees
  const priceInRupees = Math.round(plan.price / 100)

  const features = [
    { icon: '☁️', text: `${plan.limits?.uploads ?? '—'} document uploads` },
    { icon: '🤖', text: `${plan.limits?.asks ?? '—'} AI questions` },
    { icon: '📅', text: `${plan.durationDays ?? 30} day access` },
  ]

  return (
    <div style={{
      background: isPopular ? 'linear-gradient(135deg, var(--bg-card), rgba(108,99,255,0.06))' : 'var(--bg-card)',
      border: `1px solid ${isPopular ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '28px 24px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      transition: 'all var(--transition)',
      boxShadow: isPopular ? 'var(--shadow-accent)' : 'none',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {isPopular && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--accent)', color: '#fff',
          fontSize: 11, fontWeight: 700, padding: '3px 14px',
          borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>
          Most Popular
        </div>
      )}

      {/* Plan name */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
        }}>
          {plan.name}
        </h3>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 24 }}>
        {isFree ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{
              fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)', lineHeight: 1,
            }}>
              Free
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>₹</span>
            <span style={{
              fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-display)',
              color: isPopular ? 'var(--accent)' : 'var(--text-primary)',
              lineHeight: 1,
            }}>
              {priceInRupees}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              /{plan.durationDays === 30 ? 'mo' : `${plan.durationDays}d`}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <div style={{ flex: 1, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13, color: 'var(--text-secondary)',
          }}>
            <span style={{ fontSize: 15 }}>{f.icon}</span>
            {f.text}
          </div>
        ))}
      </div>

      <Button
        variant={isFree ? 'secondary' : 'primary'}
        fullWidth
        onClick={() => onSubscribe(plan._id)}
        loading={subscribing === plan._id}
        disabled={isFree}
      >
        {isFree ? 'Free Plan' : `Get ${plan.name}`}
      </Button>
    </div>
  )
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans')
        setPlans(res.data || [])
      } catch {
        showToast('Failed to load plans', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handleSubscribe = async (planId) => {
    setSubscribing(planId)
    try {
      const res = await api.post('/subscription/create-sub', { planId })
      const shortUrl = res.data?.razorpayShortUrl

      console.log(shortUrl)
      if (shortUrl) {
        window.open(shortUrl, '_blank')
        showToast('Redirecting to payment...', 'info')
      } else {
        showToast('Subscription created!', 'success')
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Subscription failed', 'error')
    } finally {
      setSubscribing(null)
    }
  }

  return (
    <PageLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52, maxWidth: 560, margin: '0 auto 52px' }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--accent-dim)', border: '1px solid var(--accent)',
            borderRadius: 20, padding: '4px 16px',
            fontSize: 12, color: 'var(--accent)', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            Pricing Plans
          </div>
          <h1 style={{
            fontSize: 38, fontWeight: 800, letterSpacing: '-0.04em',
            marginBottom: 14, fontFamily: 'var(--font-display)',
          }}>
            Scale your intelligence
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>
            Choose the plan that fits your team. Upgrade or downgrade at any time.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <Spinner size={36} />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24, maxWidth: 960, margin: '0 auto',
          }}>
            {plans.map((plan) => (
              <PlanCard key={plan._id} plan={plan} onSubscribe={handleSubscribe} subscribing={subscribing} />
            ))}
          </div>
        )}

        {/* Trust badges */}
        <div style={{
          display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
          marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--border)',
          color: 'var(--text-muted)', fontSize: 13,
        }}>
          {['Secure payments via Razorpay', 'Pay once a month', '🇮🇳 GST compliant invoices'].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}