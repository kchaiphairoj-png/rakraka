import type { PricingResults, PricingInputs } from '../lib/pricing'

interface ResultsPanelProps {
  results: PricingResults
  inputs: PricingInputs
}

function fmt(n: number, prefix = '฿'): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  return `${prefix}${n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtInt(n: number, prefix = '฿'): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  return `${prefix}${Math.round(n).toLocaleString('th-TH')}`
}

const statusStyles = {
  loss: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca', dot: '#b91c1c' },
  thin: { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa', dot: '#ea580c' },
  fair: { bg: '#fef9c3', color: '#854d0e', border: '#fde047', dot: '#ca8a04' },
  healthy: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', dot: '#16a34a' },
}

function CostBreakdown({ results, inputs }: { results: PricingResults; inputs: PricingInputs }) {
  const items = [
    { label: 'ต้นทุนสินค้า', value: inputs.productCost, type: 'cost' },
    { label: 'ค่ากล่อง/แพ็ก', value: inputs.packagingCost, type: 'cost' },
    { label: 'ค่าส่ง (รับเอง)', value: inputs.shippingSubsidy, type: 'cost' },
    { label: 'ค่าแอด', value: inputs.adCost, type: 'cost' },
    { label: 'ส่วนลด/คูปอง', value: inputs.discount, type: 'cost' },
    { label: `ค่าธรรมเนียมแพลตฟอร์ม (${inputs.platformFeePercent}%)`, value: results.platformFee, type: 'fee' },
    { label: `ค่าคอม Affiliate (${inputs.affiliatePercent}%)`, value: results.affiliateFee, type: 'fee' },
    { label: `ความเสี่ยงคืนสินค้า (${inputs.returnRatePercent}%)`, value: results.returnRiskCost, type: 'risk' },
  ].filter((i) => i.value > 0)

  const typeColor: Record<string, string> = {
    cost: '#78716c',
    fee: '#b45309',
    risk: '#be123c',
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#a8a29e', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
        รายละเอียดต้นทุน
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#78716c' }}>{item.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: typeColor[item.type], fontVariantNumeric: 'tabular-nums' }}>
              {fmt(item.value)}
            </span>
          </div>
        ))}
        <div style={{ height: 1, background: '#f0eeeb', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1c1917' }}>ต้นทุนรวม</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#b91c1c', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(results.totalCost)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ResultsPanel({ results, inputs }: ResultsPanelProps) {
  const s = statusStyles[results.status]

  return (
    <div data-testid="results-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status badge */}
      <div
        style={{
          background: s.bg,
          border: `1px solid ${s.border}`,
          borderRadius: 12,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: s.dot,
            flexShrink: 0,
            marginTop: 4,
          }}
        />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: s.color, marginBottom: 4 }}>
            {results.statusLabel}
          </div>
          <div style={{ fontSize: 13, color: s.color, opacity: 0.85, lineHeight: 1.5 }}>
            {results.statusMessage}
          </div>
        </div>
      </div>

      {/* Main metrics */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: '#a8a29e', fontWeight: 500, marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              กำไรจริง/ชิ้น
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: results.profit >= 0 ? '#15803d' : '#b91c1c',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
              data-testid="result-profit"
            >
              {results.profit >= 0 ? '+' : ''}{fmt(results.profit)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#a8a29e', fontWeight: 500, marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Margin จริง
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: results.margin >= 25 ? '#15803d' : results.margin >= 10 ? '#ca8a04' : '#b91c1c',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
              data-testid="result-margin"
            >
              {results.margin.toFixed(1)}%
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'รายได้สุทธิ', value: fmt(results.netRevenue), testId: 'result-netrev' },
            { label: 'ต้นทุนรวม', value: fmt(results.totalCost), testId: 'result-totalcost' },
            { label: 'ราคาขั้นต่ำ', value: fmtInt(results.breakEvenPrice), testId: 'result-breakeven' },
          ].map((m) => (
            <div key={m.label} style={{ background: '#fafaf9', borderRadius: 8, padding: '12px' }}>
              <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500, marginBottom: 4, letterSpacing: '0.04em' }}>
                {m.label}
              </div>
              <div
                style={{ fontSize: 15, fontWeight: 700, color: '#1c1917', fontVariantNumeric: 'tabular-nums' }}
                data-testid={m.testId}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <CostBreakdown results={results} inputs={inputs} />
      </div>

      {/* Recommended prices */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1c1917', marginBottom: 16 }}>
          ราคาแนะนำ 3 ระดับ
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              label: 'ราคาสู้ตลาด',
              sub: 'Margin 15%',
              value: fmtInt(results.competitivePrice),
              color: '#2aadad',
              bg: '#f0fafa',
              testId: 'result-competitive',
            },
            {
              label: 'ราคากำไรสมดุล',
              sub: `Margin ${inputs.targetMarginPercent}%`,
              value: fmtInt(results.balancedPrice),
              color: '#0d4f4f',
              bg: '#e0f5f5',
              testId: 'result-balanced',
            },
            {
              label: 'ราคาพรีเมียม',
              sub: `Margin ${inputs.targetMarginPercent + 15}%`,
              value: fmtInt(results.premiumPrice),
              color: '#15803d',
              bg: '#dcfce7',
              testId: 'result-premium',
            },
          ].map((tier) => (
            <div
              key={tier.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: tier.bg,
                borderRadius: 8,
                padding: '12px 14px',
              }}
              data-testid={tier.testId}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1c1917' }}>{tier.label}</div>
                <div style={{ fontSize: 12, color: '#a8a29e', marginTop: 1 }}>{tier.sub}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: tier.color, fontVariantNumeric: 'tabular-nums' }}>
                {tier.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div
        style={{
          background: '#0d4f4f',
          borderRadius: 12,
          padding: '20px 24px',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: '#4ecdc4', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
          คำแนะนำ
        </div>
        <p style={{ fontSize: 14, color: '#d0f0f0', lineHeight: 1.65, margin: 0 }} data-testid="result-recommendation">
          {results.recommendation}
        </p>
      </div>
    </div>
  )
}
