import { useState } from 'react'
import { Logo } from './Logo'

interface HeaderProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const NAV_ITEMS = [
  { id: 'calculator', label: 'เครื่องคำนวณ' },
  { id: 'promotion', label: 'โปรโมชัน' },
  { id: 'pricewar', label: 'สงครามราคา' },
  { id: 'justifier', label: 'Value Justifier' },
  { id: 'dashboard', label: 'Dashboard' },
]

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (id: string) => {
    onNavigate(id)
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      data-testid="header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(247, 246, 243, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <button
          onClick={() => handleNav('hero')}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Logo size="sm" />
        </button>

        {/* Desktop nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flex: 1,
            justifyContent: 'center',
          }}
          className="hidden-mobile"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              data-testid={`nav-${item.id}`}
              style={{
                background: activeSection === item.id ? '#0d4f4f' : 'transparent',
                color: activeSection === item.id ? '#fff' : '#44403c',
                border: 'none',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 14,
                fontWeight: activeSection === item.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: "'Noto Sans Thai', system-ui, sans-serif",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn-primary"
            onClick={() => handleNav('calculator')}
            style={{ padding: '8px 18px', fontSize: 14 }}
          >
            เริ่มคำนวณ
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: 8,
              width: 36,
              height: 36,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 18,
            }}
            className="show-mobile"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(0,0,0,0.06)',
            background: 'rgba(247, 246, 243, 0.98)',
            padding: '8px 16px 16px',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: activeSection === item.id ? '#f0fafa' : 'transparent',
                color: activeSection === item.id ? '#0d4f4f' : '#44403c',
                border: 'none',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 15,
                fontWeight: activeSection === item.id ? 600 : 400,
                cursor: 'pointer',
                fontFamily: "'Noto Sans Thai', system-ui, sans-serif",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
