import { useState } from 'react'
import { generateValueMessages } from '../lib/pricing'
import type { PricingInputs, PricingResults, ValueMessage } from '../lib/pricing'

interface ValueJustifierProps {
  inputs: PricingInputs
  results: PricingResults
}

const TYPE_ICONS: Record<string, string> = {
  reply: '💬',
  caption: '📣',
  reason: '💡',
}

function MessageCard({ msg, index }: { msg: ValueMessage; index: number }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select text
    }
  }

  return (
    <div
      className="card-sm animate-in"
      data-testid={`value-message-${index}`}
      style={{
        padding: '24px',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{TYPE_ICONS[msg.type]}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0d4f4f' }}>
            {msg.label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? '#dcfce7' : '#f0fafa',
            color: copied ? '#15803d' : '#0d4f4f',
            border: '1.5px solid',
            borderColor: copied ? '#bbf7d0' : '#b2e8e8',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: "'Noto Sans Thai', system-ui, sans-serif",
          }}
        >
          {copied ? '✓ คัดลอกแล้ว' : 'คัดลอก'}
        </button>
      </div>
      <p
        style={{
          fontSize: 14,
          color: '#44403c',
          lineHeight: 1.75,
          margin: 0,
          whiteSpace: 'pre-line',
          background: '#fafaf9',
          borderRadius: 8,
          padding: '14px 16px',
          border: '1px solid #f0eeeb',
        }}
      >
        {msg.text}
      </p>
    </div>
  )
}

export function ValueJustifier({ inputs, results }: ValueJustifierProps) {
  const [messages, setMessages] = useState<ValueMessage[] | null>(null)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    const msgs = generateValueMessages(inputs, results)
    setMessages(msgs)
    setGenerated(true)
  }

  const productName = inputs.productName || 'สินค้าของคุณ'

  return (
    <section
      id="justifier"
      data-testid="value-justifier"
      style={{
        padding: '80px 24px',
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="section-label" style={{ marginBottom: 10 }}>
          เครื่องมือที่ 5
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
          AI Value Justifier
        </h2>
        <p style={{ fontSize: 16, color: '#78716c', margin: '0 0 12px', lineHeight: 1.6 }}>
          สร้างข้อความโน้มน้าวลูกค้าจากข้อมูลจริงของสินค้าคุณ ไม่ต้องลดราคา แต่อธิบายให้ลูกค้าเห็นคุณค่า
        </p>
        <p style={{ fontSize: 14, color: '#a8a29e', margin: '0 0 36px' }}>
          สร้างจากข้อมูลที่กรอกในเครื่องคำนวณหลัก — ยิ่งกรอกครบ ข้อความยิ่งแม่นยำ
        </p>

        {/* Context preview */}
        <div
          style={{
            background: '#f7f6f3',
            borderRadius: 12,
            padding: '18px 20px',
            marginBottom: 28,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            border: '1px solid #e8e6e3',
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>สินค้า</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1c1917', marginTop: 2 }}>{productName}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ราคา</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0d4f4f', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
              ฿{inputs.price.toLocaleString('th-TH')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>กำไรจริง</div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: results.profit >= 0 ? '#15803d' : '#b91c1c',
              marginTop: 2,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {results.profit >= 0 ? '+' : ''}฿{results.profit.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Margin</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1c1917', marginTop: 2 }}>
              {results.margin.toFixed(1)}%
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleGenerate}
          data-testid="generate-value-btn"
          style={{
            width: '100%',
            fontSize: 16,
            padding: '15px',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          ✨ สร้างข้อความโน้มน้าว
        </button>

        {!generated && (
          <div
            style={{
              padding: '36px',
              background: '#fafaf9',
              borderRadius: 12,
              border: '1.5px dashed #e5e4e1',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
            <div style={{ fontSize: 15, color: '#78716c', lineHeight: 1.6 }}>
              กดปุ่มด้านบนเพื่อสร้างข้อความตอบลูกค้า<br />
              แคปชันขาย และเหตุผลที่สินค้าคุ้มค่า
            </div>
          </div>
        )}

        {generated && messages && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => (
              <MessageCard key={msg.type} msg={msg} index={i} />
            ))}
            <div
              style={{
                background: '#f0fafa',
                border: '1px solid #b2e8e8',
                borderRadius: 10,
                padding: '14px 18px',
                fontSize: 13,
                color: '#0d4f4f',
                lineHeight: 1.6,
              }}
            >
              💡 <strong>เคล็ดลับ:</strong> ปรับข้อความด้านบนให้เข้ากับน้ำเสียงของแบรนด์คุณ
              แล้วเพิ่ม emoji หรือชื่อสินค้าจริงเพื่อให้ดูเป็นธรรมชาติมากขึ้น
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
