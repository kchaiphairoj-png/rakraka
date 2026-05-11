import { useMemo } from 'react'
import { generateSellingPrices } from '../lib/pricing'
import type { PricingInputs, SellingPriceSuggestion } from '../lib/pricing'

interface SellingPriceOptimizerProps {
  inputs: PricingInputs
  onChange: (inputs: PricingInputs) => void
}

const statusStyles = {
  loss: { bg: '#fee2e2', color: '#b91c1c', label: 'เสี่ยงขาดทุน' },
  thin: { bg: '#ffedd5', color: '#c2410c', label: 'กำไรบาง' },
  fair: { bg: '#fef9c3', color: '#854d0e', label: 'พอใช้' },
  healthy: { bg: '#dcfce7', color: '#15803d', label: 'สุขภาพดี' },
}

function SuggestionCard({
  suggestion,
  currentPrice,
  onApply,
}: {
  suggestion: SellingPriceSuggestion
  currentPrice: number
  onApply: (price: number) => void
}) {
  const s = statusStyles[suggestion.status]
  const priceDiff = suggestion.price - currentPrice
  const isActive = suggestion.price === currentPrice
  const isBundle = suggestion.strategy === 'bundle'

  return (
    <div
      data-testid={`selling-price-${suggestion.strategy}`}
      style={{
        background: suggestion.highlight
          ? 'linear-gradient(135deg, #fffbf2 0%, #fff5e6 100%)'
          : '#ffffff',
        border: suggestion.highlight ? '1.5px solid #f59e0b' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: 14,
        padding: '24px',
        position: 'relative',
        boxShadow: suggestion.highlight
          ? '0 8px 24px rgba(245, 158, 11, 0.12), 0 2px 6px rgba(0,0,0,0.04)'
          : '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'transform 0.18s, box-shadow 0.18s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Badge top-right */}
      {suggestion.highlight && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: 18,
            background: '#f59e0b',
            color: '#ffffff',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 20,
            letterSpacing: '0.04em',
          }}
        >
          ⭐ แนะนำ
        </div>
      )}

      {/* Icon + Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: suggestion.highlight ? '#fef3c7' : '#f5f4f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {suggestion.icon}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1c1917', lineHeight: 1.2 }}>
              {suggestion.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: suggestion.highlight ? '#b45309' : '#78716c',
                fontWeight: 600,
                marginTop: 2,
                letterSpacing: '0.03em',
              }}
            >
              {suggestion.badge}
            </div>
          </div>
        </div>
        <span
          style={{
            background: s.bg,
            color: s.color,
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
          }}
        >
          {s.label}
        </span>
      </div>

      {/* Big price */}
      <div
        style={{
          background: '#fafaf9',
          borderRadius: 12,
          padding: '16px 18px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: suggestion.highlight ? '#b45309' : '#0d4f4f',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
          data-testid={`selling-price-value-${suggestion.strategy}`}
        >
          ฿{suggestion.price.toLocaleString('th-TH')}
        </div>
        {isBundle && (
          <div style={{ fontSize: 11, color: '#78716c', marginTop: 4 }}>
            (฿{Math.round(suggestion.price / 2).toLocaleString('th-TH')}/ชิ้น × 2 ชิ้น)
          </div>
        )}
        {!isBundle && priceDiff !== 0 && (
          <div
            style={{
              fontSize: 12,
              color: priceDiff > 0 ? '#15803d' : '#b91c1c',
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            {priceDiff > 0 ? '+' : ''}฿{priceDiff.toLocaleString('th-TH')} จากราคาปัจจุบัน
          </div>
        )}
      </div>

      {/* Profit + Margin */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: '#fafaf9', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            กำไร/ชุด
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: suggestion.profit >= 0 ? '#15803d' : '#b91c1c',
              fontVariantNumeric: 'tabular-nums',
              marginTop: 2,
            }}
          >
            {suggestion.profit >= 0 ? '+' : ''}฿{suggestion.profit.toFixed(0)}
          </div>
        </div>
        <div style={{ background: '#fafaf9', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Margin
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: suggestion.margin >= 25 ? '#15803d' : suggestion.margin >= 10 ? '#ca8a04' : '#b91c1c',
              fontVariantNumeric: 'tabular-nums',
              marginTop: 2,
            }}
          >
            {suggestion.margin.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Psychology explanation */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#0d4f4f',
            marginBottom: 6,
            letterSpacing: '0.02em',
          }}
        >
          💡 {suggestion.psychology}
        </div>
        <p
          style={{
            fontSize: 13,
            color: '#57534e',
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {suggestion.whyItWorks}
        </p>
      </div>

      {/* Best for */}
      <div
        style={{
          fontSize: 11,
          color: '#78716c',
          background: '#f5f4f2',
          borderRadius: 6,
          padding: '6px 10px',
          fontWeight: 500,
        }}
      >
        <strong style={{ color: '#44403c' }}>เหมาะกับ:</strong> {suggestion.bestFor}
      </div>

      {/* Apply button */}
      {!isBundle && (
        <button
          onClick={() => onApply(suggestion.price)}
          data-testid={`apply-price-${suggestion.strategy}`}
          disabled={isActive}
          style={{
            background: isActive ? '#e0f5f5' : suggestion.highlight ? '#f59e0b' : '#0d4f4f',
            color: isActive ? '#0d4f4f' : '#ffffff',
            border: 'none',
            borderRadius: 10,
            padding: '11px 16px',
            fontSize: 14,
            fontWeight: 700,
            cursor: isActive ? 'default' : 'pointer',
            fontFamily: "'Noto Sans Thai', system-ui, sans-serif",
            transition: 'background 0.15s, transform 0.1s',
            marginTop: 'auto',
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {isActive ? '✓ ใช้ราคานี้อยู่' : `ใช้ราคา ฿${suggestion.price.toLocaleString('th-TH')}`}
        </button>
      )}
      {isBundle && (
        <div
          style={{
            background: '#f0fafa',
            border: '1px dashed #b2e8e8',
            color: '#0d4f4f',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 12,
            textAlign: 'center',
            fontWeight: 500,
            marginTop: 'auto',
          }}
        >
          💡 ขายเป็นชุด — เพิ่มยอดต่อออเดอร์
        </div>
      )}
    </div>
  )
}

export function SellingPriceOptimizer({ inputs, onChange }: SellingPriceOptimizerProps) {
  const suggestions = useMemo(() => generateSellingPrices(inputs), [inputs])

  const handleApply = (price: number) => {
    onChange({ ...inputs, price })
    // Smooth scroll to top of calculator to see result
    setTimeout(() => {
      const el = document.getElementById('results')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <section
      id="selling-price"
      data-testid="selling-price-optimizer"
      style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #ffffff 0%, #fff9ed 100%)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label" style={{ marginBottom: 10 }}>
            เครื่องมือใหม่
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: '#1c1917',
              letterSpacing: '-0.03em',
              margin: '0 0 14px',
              lineHeight: 1.15,
            }}
          >
            ตั้งราคา<span style={{ color: '#b45309' }}>เท่าไหร่</span>ให้<span style={{ color: '#b45309' }}>ขายดี</span>?
          </h2>
          <p style={{ fontSize: 17, color: '#78716c', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
            5 กลยุทธ์ตั้งราคาแบบจิตวิทยาที่ทำให้ลูกค้าอยากกดสั่งซื้อ —
            พร้อมคำนวณกำไรจริงให้ดูทุกราคา
          </p>
        </div>

        {/* Current price context */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            padding: '14px 22px',
            marginBottom: 32,
            maxWidth: 480,
            margin: '0 auto 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ราคาปัจจุบันของคุณ
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0d4f4f', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
              ฿{inputs.price.toLocaleString('th-TH')}
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#78716c', textAlign: 'right' }}>
            ⬇ ลองเปรียบเทียบกับ<br />
            5 ราคาแนะนำด้านล่าง
          </div>
        </div>

        {/* Suggestions grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.strategy}
              suggestion={s}
              currentPrice={inputs.price}
              onApply={handleApply}
            />
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: 32,
            padding: '16px 20px',
            background: '#fffbeb',
            border: '1px solid #fde047',
            borderRadius: 10,
            fontSize: 13,
            color: '#854d0e',
            lineHeight: 1.6,
            textAlign: 'center',
          }}
        >
          💡 <strong>เคล็ดลับ:</strong> ราคาที่ "ขายดีที่สุด"
          ไม่จำเป็นต้องเป็นราคาที่กำไรเยอะที่สุด
          — เลือกตามกลุ่มลูกค้าและช่องทางการขาย
        </div>
      </div>
    </section>
  )
}
