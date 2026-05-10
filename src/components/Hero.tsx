import type { PricingResults } from '../lib/pricing'

interface HeroProps {
  results: PricingResults
  onStart: () => void
  onViewFeatures: () => void
}

function LiveCard({ results }: { results: PricingResults }) {
  const statusColor: Record<string, string> = {
    loss: '#b91c1c',
    thin: '#c2410c',
    fair: '#854d0e',
    healthy: '#15803d',
  }
  const statusBg: Record<string, string> = {
    loss: '#fee2e2',
    thin: '#ffedd5',
    fair: '#fef9c3',
    healthy: '#dcfce7',
  }
  const color = statusColor[results.status]
  const bg = statusBg[results.status]

  const fmt = (n: number) =>
    n === Infinity || isNaN(n) ? '—' : `฿${n.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <div
      data-testid="hero-live-card"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 20,
        padding: '28px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        minWidth: 300,
        width: '100%',
        maxWidth: 360,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#78716c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          ตัวอย่างผลลัพธ์
        </span>
        <span
          style={{
            background: bg,
            color: color,
            fontSize: 12,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 20,
          }}
        >
          {results.statusLabel}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <MetricItem
          label="กำไรจริง/ชิ้น"
          value={results.profit >= 0 ? `+${fmt(results.profit)}` : fmt(results.profit)}
          color={results.profit >= 0 ? '#15803d' : '#b91c1c'}
          big
        />
        <MetricItem
          label="Margin จริง"
          value={`${results.margin.toFixed(1)}%`}
          color={results.profit >= 0 ? '#0d4f4f' : '#b91c1c'}
          big
        />
        <MetricItem label="ราคาขั้นต่ำ" value={fmt(results.breakEvenPrice)} />
        <MetricItem label="ต้นทุนรวม" value={fmt(results.totalCost)} />
      </div>

      <div style={{ borderTop: '1px solid #f0eeeb', paddingTop: 16 }}>
        <div style={{ fontSize: 12, color: '#78716c', marginBottom: 8, fontWeight: 600 }}>
          ราคาแนะนำ 3 ระดับ
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <PriceTier label="สู้ตลาด" value={fmt(results.competitivePrice)} color="#0d4f4f" dot="#4ecdc4" />
          <PriceTier label="สมดุล" value={fmt(results.balancedPrice)} color="#0d4f4f" dot="#0d4f4f" />
          <PriceTier label="พรีเมียม" value={fmt(results.premiumPrice)} color="#0d4f4f" dot="#16a34a" />
        </div>
      </div>
    </div>
  )
}

function MetricItem({ label, value, color, big }: {
  label: string; value: string; color?: string; big?: boolean
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500, marginBottom: 3, letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{
        fontSize: big ? 22 : 16,
        fontWeight: 700,
        color: color || '#1c1917',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
    </div>
  )
}

function PriceTier({ label, value, color, dot }: {
  label: string; value: string; color: string; dot: string
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: dot }} />
        <span style={{ fontSize: 13, color: '#78716c' }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
    </div>
  )
}

export function Hero({ results, onStart, onViewFeatures }: HeroProps) {
  return (
    <section
      id="hero"
      data-testid="hero"
      style={{
        padding: '80px 24px',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 48,
        justifyContent: 'space-between',
      }}
    >
      {/* Left: copy */}
      <div style={{ flex: '1 1 420px', maxWidth: 560 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#e0f5f5',
            color: '#0d4f4f',
            borderRadius: 20,
            padding: '5px 14px',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 24,
            border: '1px solid #b2e8e8',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          Pricing Intelligence Platform สำหรับผู้ประกอบการไทย
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            color: '#1c1917',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: '0 0 20px',
          }}
        >
          ขายดี{' '}
          <span style={{ color: '#b91c1c' }}>แต่เงิน<br />ไม่เหลือ?</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: '#57534e',
            lineHeight: 1.7,
            margin: '0 0 12px',
            maxWidth: 480,
          }}
        >
          rakraka.com ช่วยตั้งราคาขายให้เหลือกำไรจริง คำนวณต้นทุน ค่าธรรมเนียม
          ค่าแอด ส่วนลด และความเสี่ยงก่อนลงขายจริง
        </p>
        <p
          style={{
            fontSize: 15,
            color: '#a8a29e',
            marginBottom: 36,
            fontWeight: 500,
          }}
        >
          Price smarter. Profit better.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button className="btn-primary" onClick={onStart} style={{ fontSize: 16, padding: '14px 28px' }}>
            เริ่มคำนวณกำไรจริง →
          </button>
          <button className="btn-secondary" onClick={onViewFeatures} style={{ fontSize: 16, padding: '13px 28px' }}>
            ดูฟีเจอร์ทั้งหมด
          </button>
        </div>

        <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {[
            { label: 'ใช้งานฟรี', sub: 'ไม่ต้องสมัครสมาชิก' },
            { label: 'Real-time', sub: 'คำนวณทันทีที่กรอก' },
            { label: '5 เครื่องมือ', sub: 'ครบในที่เดียว' },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0d4f4f' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#a8a29e', marginTop: 1 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: live card */}
      <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
        <LiveCard results={results} />
      </div>
    </section>
  )
}
