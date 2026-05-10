import type { PricingResults, PricingInputs } from '../lib/pricing'

interface DashboardSummaryProps {
  results: PricingResults
  inputs: PricingInputs
}

function ScoreRing({ score }: { score: number }) {
  const size = 100
  const strokeWidth = 8
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 70 ? '#16a34a' : score >= 45 ? '#ca8a04' : score >= 25 ? '#ea580c' : '#b91c1c'

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f0eeeb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 9, color: '#a8a29e', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          /100
        </span>
      </div>
    </div>
  )
}

const RISK_CONFIG = {
  loss: { label: 'สูง', color: '#b91c1c', bg: '#fee2e2', icon: '🔴' },
  thin: { label: 'ปานกลาง', color: '#c2410c', bg: '#ffedd5', icon: '🟠' },
  fair: { label: 'ต่ำปานกลาง', color: '#854d0e', bg: '#fef9c3', icon: '🟡' },
  healthy: { label: 'ต่ำ', color: '#15803d', bg: '#dcfce7', icon: '🟢' },
}

const ACTION_MAP = {
  loss: 'ขึ้นราคาขายหรือลดต้นทุนโดยด่วนก่อนรับออเดอร์เพิ่ม',
  thin: 'ปรับราคาขายให้ได้ margin อย่างน้อย 15% ก่อนลงโปรใดๆ',
  fair: 'รักษา margin ปัจจุบัน หลีกเลี่ยงโปรลึก และหาทางเพิ่มคุณค่าแทนลดราคา',
  healthy: 'ยอดเยี่ยม รักษาระดับนี้ไว้ และใช้ส่วนต่างออกแบบโปรที่มีกลยุทธ์',
}

function MetricRow({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #f5f4f2',
      }}
    >
      <div>
        <div style={{ fontSize: 14, color: '#44403c', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#a8a29e', marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || '#1c1917', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  )
}

function fmtInt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  return `฿${Math.round(n).toLocaleString('th-TH')}`
}

export function DashboardSummary({ results, inputs }: DashboardSummaryProps) {
  const risk = RISK_CONFIG[results.status]
  const action = ACTION_MAP[results.status]
  const productName = inputs.productName || 'สินค้าของคุณ'

  return (
    <section
      id="dashboard"
      data-testid="dashboard-summary"
      style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="section-label" style={{ marginBottom: 10 }}>
        Dashboard
      </div>
      <h2
        style={{
          fontSize: 'clamp(26px, 3.5vw, 36px)',
          fontWeight: 800,
          color: '#1c1917',
          letterSpacing: '-0.03em',
          margin: '0 0 12px',
        }}
      >
        Business Health Summary
      </h2>
      <p style={{ fontSize: 16, color: '#78716c', margin: '0 0 40px', lineHeight: 1.6 }}>
        ภาพรวมสุขภาพธุรกิจของ{' '}
        <strong style={{ color: '#0d4f4f' }}>{productName}</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Health Score Card */}
        <div
          className="card"
          style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: 24 }}
          data-testid="health-score-card"
        >
          <ScoreRing score={results.profitHealthScore} />
          <div>
            <div style={{ fontSize: 12, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Profit Health Score
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1c1917', marginBottom: 4 }}>
              {results.statusLabel}
            </div>
            <div style={{ fontSize: 13, color: '#78716c', lineHeight: 1.5 }}>
              {results.statusMessage}
            </div>
          </div>
        </div>

        {/* Risk Level */}
        <div
          className="card"
          style={{ padding: '28px' }}
          data-testid="risk-level-card"
        >
          <div style={{ fontSize: 12, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
            ระดับความเสี่ยง
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: risk.bg,
              color: risk.color,
              borderRadius: 10,
              padding: '12px 18px',
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 20 }}>{risk.icon}</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{risk.label}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <MetricRow label="Margin ปัจจุบัน" value={`${results.margin.toFixed(1)}%`} color={results.margin >= 25 ? '#15803d' : results.margin >= 10 ? '#ca8a04' : '#b91c1c'} />
            <MetricRow label="กำไรต่อชิ้น" value={`${results.profit >= 0 ? '+' : ''}฿${results.profit.toFixed(2)}`} color={results.profit >= 0 ? '#15803d' : '#b91c1c'} />
          </div>
        </div>

        {/* Price targets */}
        <div className="card" style={{ padding: '28px' }} data-testid="price-targets-card">
          <div style={{ fontSize: 12, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
            เป้าหมายราคา
          </div>
          <MetricRow
            label="ราคาปัจจุบัน"
            value={`฿${inputs.price.toLocaleString('th-TH')}`}
            color="#1c1917"
          />
          <MetricRow
            label="ราคาขั้นต่ำ (ไม่ขาดทุน)"
            value={fmtInt(results.breakEvenPrice)}
            color="#b91c1c"
            sub="ต้องไม่ขายต่ำกว่านี้"
          />
          <MetricRow
            label="ราคาสมดุล (เป้าหมาย)"
            value={fmtInt(results.balancedPrice)}
            color="#0d4f4f"
            sub={`Margin ${inputs.targetMarginPercent}%`}
          />
          <MetricRow
            label="ราคาพรีเมียม"
            value={fmtInt(results.premiumPrice)}
            color="#15803d"
            sub={`Margin ${inputs.targetMarginPercent + 15}%`}
          />
        </div>

        {/* Next best action */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0d4f4f 0%, #116060 100%)',
            borderRadius: 16,
            padding: '28px',
            gridColumn: 'span 1',
          }}
          data-testid="next-action-card"
        >
          <div style={{ fontSize: 12, color: '#4ecdc4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Next Best Action
          </div>
          <p style={{ fontSize: 16, color: '#ffffff', lineHeight: 1.7, margin: '0 0 20px', fontWeight: 500 }}>
            {action}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              results.margin < 15 && '→ ปรับราคาขายขึ้นอีก ' + Math.ceil(results.breakEvenPrice * 1.15 - inputs.price) + ' บาท',
              inputs.adCost > results.profit * 0.3 && '→ ค่าแอดสูงเกิน ลองลด budget หรือปรับ targeting',
              inputs.discount > 0 && results.margin < 20 && '→ ลองยกเลิกส่วนลดและสื่อสารคุณค่าแทน',
              results.status === 'healthy' && '→ พิจารณาเพิ่มราคาพรีเมียมเพื่อเพิ่ม margin ต่อชิ้น',
            ].filter(Boolean).slice(0, 3).map((tip, i) => (
              <div key={i} style={{ fontSize: 13, color: '#a5d6d6', display: 'flex', gap: 8 }}>
                <span style={{ flexShrink: 0 }}></span>
                <span>{tip as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
