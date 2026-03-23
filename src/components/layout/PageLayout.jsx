import Navbar from './Navbar'
import Toast from '../common/Toast'

export default function PageLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '32px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {children}
      </main>
      <Toast />
    </div>
  )
}
