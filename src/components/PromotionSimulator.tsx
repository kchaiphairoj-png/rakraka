import { useState } from 'react'
import { simulatePromotion } from '../lib/pricing'
import type { PricingInputs, PricingResults, PromotionResult } from '../lib/pricing'

interface PromotionSimulatorProps {
  inputs: PricingInputs
  baseResults: PricingResults
}

const PROMOS = [
  { id: 'discount10', label: 'ลด 10%', icon: '🏷️', desc: 'ส่วนลดตรงๆ 10%' },
  { id: 'freeship30', label: 'ส่งฟรี ฿30', icon: '🚚', desc: 'ร้านออกค่าส่งให้' },
  { id: 'affiliate10', label: 'Affiliate 10%', icon: '🤝', desc: 'ค่าคอมนักรีวิว' },
  { id: 'flashsale20', label: 'Flash Sale 20%', icon: '⚡', desc: 'ลดหนักช่วงสั้น' },
  { id: 'bundle2', label: 'Bundle 2 ชิ้น', icon: '📦', desc: 'ซื้อ 2 ลด 10%' },
]

const statusStyles = {
  loss: { bg: '#fee2e2', color: '#b91c1c', label: 'เสี่ยงขาดทุน' },
  thin: { bg: '#ffedd5', color: '#c2410c', label: 'กำไรบาง' },
  fair: { bg: '#fef9c3', color: '#854d0e', label: 'พอใช้' },
  healthy: { bg: '#dcfce7', color: '#15803d', label: 'รอด' },
}

function PromoResult({ result, base }: { result: PromotionResult; base: PricingResults }) {
  const s = statusStyles[result.status]
  const profitDelta = result.profit - base.profit
  const marginDelta = result.margin - base.margin

  return (
    <div
      className="card animate-in"
      style={{ padding: '24px', marginTop: 24 }}
      data-testid="promo-result"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1c1917' }}>
          ผลลัพธ์: {result.label}
        </h3>
        <span
          style={{
            background: s.bg,
            color: s.color,
            fontSize: 13,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 20,
          }}
        >
          {s.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          {
            label: 'กำไรหลังโปร',
            value: `${result.profit >= 0 ? '+' : ''}฿${result.profit.toFixed(2)}`,
            delta: profitDelta,
            unit: '฿',
            color: result.profit >= 0 ? '#15803d' : '#b91c1c',
          },
          {
            label: 'Margin หลังโปร',
            value: `${result.margin.toFixed(1)}%`,
            delta: marginDelta,
            unit: '%',
            color: result.margin >= 15 ? '#15803d' : result.margin >= 0 ? '#ca8a04' : '#b91c1c',
          },
        ].map((m) => (
          <div key={m.label} style={{ background: '#fafaf9', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: '#a8a29e', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {m.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {m.value}
            </div>
            <div style={{ fontSize: 12, color: m.delta >= 0 ? '#16a34a' : '#b91c1c', marginTop: 4, fontWeight: 600 }}>
              {m.delta >= 0 ? '▲' : '▼'} {Math.abs(m.delta).toFixed(m.unit === '%' ? 1 : 2)}
              {m.unit} จากปกติ
            </div>
          </div>
        ))}
      </div>

      {result.extraUnitsSold !== undefined && result.extraUnitsSold > 0 && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde047',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 16,
            fontSize: 14,
            color: '#854d0e',
          }}
        >
          ⚠️ ถ้าลงโปรนี้ คุณต้องขายเพิ่มอีก{' '}
          <strong>{result.extraUnitsSold.toLocaleString('th-TH')} ชิ้น</strong> ถึงจะได้กำไรเท่าเดิม
        </div>
      )}

      <div
        style={{
          background: '#0d4f4f',
          borderRadius: 10,
          padding: '14px 18px',
        }}
      >
        <div style={{ fontSize: 11, color: '#4ecdc4', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          คำแนะนำ
        </div>
        <p style={{ fontSize: 14, color: '#d0f0f0', lineHeight: 1.65, margin: 0 }}>
          {result.advice}
        </p>
      </div>
    </div>
  )
}

export function PromotionSimulator({ inputs, baseResults }: PromotionSimulatorProps) {
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null)
  const [promoResult, setPromoResult] = useState<PromotionResult | null>(null)

  const runPromo = (promoId: string) => {
    if (selectedPromo === promoId) {
      setSelectedPromo(null)
      setPromoResult(null)
      return
    }
    setSelectedPromo(promoId)
    setPromoResult(simulatePromotion(baseResults, inputs, promoId))
  }

  return (
    <section
      id="promotion"
      data-testid="promotion-simulator"
      style={{ padding: '80px 24px', background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.05)' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-label" style={{ marginBottom: 10 }}>
          เครื่องมือที่ 3
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
          Promotion Simulator
        </h2>
        <p style={{ fontSize: 16, color: '#78716c', margin: '0 0 36px', lineHeight: 1.6 }}>
          กดเลือกโปรเพื่อดูว่าถ้าลงจริงจะกำไรหรือขาดทุน — คำนวณจากข้อมูลที่กรอกไว้แล้ว
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {PROMOS.map((promo) => (
            <button
              key={promo.id}
              onClick={() => runPromo(promo.id)}
              data-testid={`promo-btn-${promo.id}`}
              style={{
                background: selectedPromo === promo.id ? '#0d4f4f' : '#fafaf9',
                color: selectedPromo === promo.id ? '#ffffff' : '#1c1917',
                border: `1.5px solid ${selectedPromo === promo.id ? '#0d4f4f' : '#e5e4e1'}`,
                borderRadius: 12,
                padding: '16px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
                fontFamily: "'Noto Sans Thai', system-ui, sans-serif",
              }}
              onMouseEnter={(e) => {
                if (selectedPromo !== promo.id) {
                  e.currentTarget.style.borderColor = '#0d4f4f'
                  e.currentTarget.style.background = '#f0fafa'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPromo !== promo.id) {
                  e.currentTarget.style.borderColor = '#e5e4e1'
                  e.currentTarget.style.background = '#fafaf9'
                }
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{promo.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{promo.label}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{promo.desc}</div>
            </button>
          ))}
        </div>

        {!selectedPromo && (
          <div
            style={{
              marginTop: 32,
              padding: '24px',
              background: '#fafaf9',
              borderRadius: 12,
              border: '1.5px dashed #e5e4e1',
              textAlign: 'center',
              color: '#a8a29e',
              fontSize: 15,
            }}
          >
            กดเลือกโปรโมชันด้านบนเพื่อดูผลลัพธ์
          </div>
        )}

        {promoResult && <PromoResult result={promoResult} base={baseResults} />}
      </div>
    </section>
  )
}
