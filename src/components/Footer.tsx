import { Logo } from './Logo'

export function Footer() {
  return (
    <footer
      data-testid="footer"
      style={{
        borderTop: '1px solid rgba(0,0,0,0.06)',
        background: '#ffffff',
        padding: '48px 24px 32px',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 32,
            marginBottom: 40,
          }}
        >
          <div style={{ maxWidth: 280 }}>
            <Logo size="sm" />
            <p style={{ fontSize: 14, color: '#78716c', lineHeight: 1.65, marginTop: 14, marginBottom: 0 }}>
              Pricing Intelligence Platform สำหรับผู้ประกอบการไทย
              ช่วยตั้งราคาให้ฉลาด กำไรให้จริง
            </p>
            <p style={{ fontSize: 13, color: '#a8a29e', marginTop: 8, marginBottom: 0, fontStyle: 'italic' }}>
              Price smarter. Profit better.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1c1917', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                เครื่องมือ
              </div>
              {[
                'Profit Reality Engine',
                'Price Strategy Advisor',
                'Promotion Simulator',
                'Price War Simulator',
                'AI Value Justifier',
              ].map((t) => (
                <div key={t} style={{ fontSize: 14, color: '#78716c', marginBottom: 8 }}>{t}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1c1917', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                เหมาะสำหรับ
              </div>
              {[
                'แม่ค้าออนไลน์',
                'Shopee / TikTok Shop',
                'SME รายย่อย',
                'ร้านอาหาร / คาเฟ่',
                'ฟรีแลนซ์',
              ].map((t) => (
                <div key={t} style={{ fontSize: 14, color: '#78716c', marginBottom: 8 }}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #f0eeeb',
            paddingTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 13, color: '#a8a29e' }}>
            © 2026 rakraka.com — ตั้งราคาให้ฉลาด กำไรให้จริง
          </div>
          <div style={{ fontSize: 13, color: '#c4c0bc' }}>
            MVP v1.0 — ไม่ต้องสมัครสมาชิก ใช้ฟรีทันที
          </div>
        </div>
      </div>
    </footer>
  )
}
