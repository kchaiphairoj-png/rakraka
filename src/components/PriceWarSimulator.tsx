import { useState } from 'react'
import { simulatePriceWar } from '../lib/pricing'
import type { PricingInputs, PriceWarResult } from '../lib/pricing'

interface PriceWarSimulatorProps {
  inputs: PricingInputs
}

const RECOMMENDATION_CONFIG = {
  match: {
    icon: '✅',
    label: 'ลดตามได้',
    color: '#15803d',
    bg: '#dcfce7',
  },
  bundle: {
    icon: '📦',
    label: 'ทำ Bundle แทน',
    color: '#b45309',
    bg: '#fffbeb',
  },
  value: {
    icon: '💎',
    label: 'สู้ด้วยคุณค่า',
    color: '#1d4ed8',
    bg: '#eff6ff',
  },
  impossible: {
    icon: '🚫',
    label: 'ห้ามลดราคา',
    color: '#b91c1c',
    bg: '#fee2e2',
  },
}

function ResultCard({ result, myPrice, competitorPrice }: {
  result: PriceWarResult
  myPrice: number
  competitorPrice: number
}) {
  const rc = RECOMMENDATION_CONFIG[result.recommendation]

  return (
    <div className="card animate-in" style={{ padding: '28px' }} data-testid="pricewar-result">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1c1917' }}>
          ผลวิเคราะห์สงครามราคา
        </h3>
        <div
          style={{
            background: rc.bg,
            color: rc.color,
            fontSize: 13,
            fontWeight: 700,
            padding: '6px 14px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {rc.icon} {rc.label}
        </div>
      </div>

      {/* Price comparison */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 12,
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ background: '#f0fafa', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#78716c', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
            ราคาของเรา
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0d4f4f', fontVariantNumeric: 'tabular-nums' }}>
            ฿{myPrice.toLocaleString('th-TH')}
          </div>
        </div>
        <div style={{ fontSize: 20, color: '#a8a29e', fontWeight: 700 }}>VS</div>
        <div style={{ background: '#fff1f2', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#78716c', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
            ราคาคู่แข่ง
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#b91c1c', fontVariantNumeric: 'tabular-nums' }}>
            ฿{competitorPrice.toLocaleString('th-TH')}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fafaf9', borderRadius: 8, padding: '14px' }}>
          <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            กำไรถ้าลดตาม
          </div>
          <div style={{
            fontSize: 20,
            fontWeight: 800,
            color: result.profitIfMatch >= 0 ? '#15803d' : '#b91c1c',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {result.profitIfMatch >= 0 ? '+' : ''}฿{result.profitIfMatch.toFixed(2)}
          </div>
        </div>
        <div style={{ background: '#fafaf9', borderRadius: 8, padding: '14px' }}>
          <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Margin ถ้าลดตาม
          </div>
          <div style={{
            fontSize: 20,
            fontWeight: 800,
            color: result.marginIfMatch >= 10 ? '#15803d' : result.marginIfMatch >= 0 ? '#ca8a04' : '#b91c1c',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {result.marginIfMatch.toFixed(1)}%
          </div>
        </div>
        <div style={{ background: '#fafaf9', borderRadius: 8, padding: '14px' }}>
          <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            กำไรที่หายไป
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#b91c1c', fontVariantNumeric: 'tabular-nums' }}>
            ฿{result.profitLoss.toFixed(2)}
          </div>
        </div>
        {result.extraUnitsNeeded !== null && (
          <div style={{ background: '#fffbeb', borderRadius: 8, padding: '14px', border: '1px solid #fde047' }}>
            <div style={{ fontSize: 11, color: '#854d0e', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ขายเพิ่มถึงคุ้ม
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#b45309', fontVariantNumeric: 'tabular-nums' }}>
              +{result.extraUnitsNeeded} ชิ้น
            </div>
          </div>
        )}
      </div>

      {/* Advice list */}
      <div style={{ background: '#0d4f4f', borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, color: '#4ecdc4', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          กลยุทธ์แนะนำ
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {result.advice.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(78, 205, 196, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, color: '#4ecdc4', fontWeight: 700, marginTop: 1 }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 14, color: '#d0f0f0', lineHeight: 1.6, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PriceWarSimulator({ inputs }: PriceWarSimulatorProps) {
  const [competitorPrice, setCompetitorPrice] = useState<number>(inputs.price * 0.85)
  const [result, setResult] = useState<PriceWarResult | null>(null)
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyze = () => {
    const r = simulatePriceWar(inputs, competitorPrice)
    setResult(r)
    setAnalyzed(true)
  }

  const gap = inputs.price - competitorPrice
  const gapPct = inputs.price > 0 ? ((gap / inputs.price) * 100).toFixed(1) : '0'

  return (
    <section
      id="pricewar"
      data-testid="pricewar-simulator"
      style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-label" style={{ marginBottom: 10 }}>
          เครื่องมือที่ 4
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
          Price War Simulator
        </h2>
        <p style={{ fontSize: 16, color: '#78716c', margin: '0 0 36px', lineHeight: 1.6 }}>
          ใส่ราคาคู่แข่ง แล้วดูว่าถ้าลดตามจะเกิดอะไรขึ้นกับกำไรของคุณ
        </p>

        <div className="card" style={{ padding: '28px', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#44403c', marginBottom: 6 }}>
                ราคาขายของเรา (฿)
              </label>
              <div
                style={{
                  padding: '10px 12px',
                  background: '#f0fafa',
                  border: '1.5px solid #b2e8e8',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0d4f4f',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ฿{inputs.price.toLocaleString('th-TH')}
              </div>
              <div style={{ fontSize: 11, color: '#a8a29e', marginTop: 4 }}>
                จากเครื่องคำนวณหลัก
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#44403c', marginBottom: 6 }}>
                ราคาคู่แข่ง (฿)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#a8a29e', fontSize: 14, fontWeight: 600, pointerEvents: 'none' }}>
                  ฿
                </span>
                <input
                  type="number"
                  className="input-field"
                  value={competitorPrice}
                  onChange={(e) => {
                    setCompetitorPrice(parseFloat(e.target.value) || 0)
                    setAnalyzed(false)
                  }}
                  min={0}
                  step={1}
                  style={{ paddingLeft: 24 }}
                  data-testid="competitor-price-input"
                />
              </div>
              {gap > 0 && (
                <div style={{ fontSize: 11, color: '#b91c1c', marginTop: 4, fontWeight: 500 }}>
                  ต่ำกว่าราคาเรา {gap.toFixed(0)} บาท ({gapPct}%)
                </div>
              )}
              {gap < 0 && (
                <div style={{ fontSize: 11, color: '#15803d', marginTop: 4, fontWeight: 500 }}>
                  สูงกว่าราคาเรา {Math.abs(gap).toFixed(0)} บาท ({Math.abs(parseFloat(gapPct))}%)
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: '#78716c', alignSelf: 'center' }}>ตั้งด่วน:</span>
            {[5, 10, 15, 20].map((pct) => (
              <button
                key={pct}
                className="btn-ghost"
                onClick={() => {
                  setCompetitorPrice(Math.round(inputs.price * (1 - pct / 100)))
                  setAnalyzed(false)
                }}
                style={{ fontSize: 13 }}
              >
                คู่แข่งถูกกว่า {pct}%
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={handleAnalyze}
            style={{ width: '100%', fontSize: 16, padding: '14px' }}
            data-testid="analyze-pricewar-btn"
          >
            วิเคราะห์สงครามราคา →
          </button>
        </div>

        {result && analyzed && (
          <ResultCard result={result} myPrice={inputs.price} competitorPrice={competitorPrice} />
        )}
      </div>
    </section>
  )
}
