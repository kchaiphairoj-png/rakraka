interface FeatureItem {
  icon: string
  title: string
  titleEn: string
  desc: string
  color: string
  bg: string
}

const FEATURES: FeatureItem[] = [
  {
    icon: '⚙️',
    title: 'Profit Reality Engine',
    titleEn: 'คำนวณกำไรจริง',
    desc: 'คำนวณกำไรหลังหักต้นทุนและค่าใช้จ่ายซ่อนเร้นทั้งหมด ทั้งค่าแพลตฟอร์ม ค่าแอด ค่าคืนสินค้า แบบ real-time',
    color: '#0d4f4f',
    bg: '#e0f5f5',
  },
  {
    icon: '🎯',
    title: 'Price Strategy Advisor',
    titleEn: 'แนะนำราคา 3 ระดับ',
    desc: 'แนะนำราคาขาย 3 ระดับ: สู้ตลาด สมดุล และพรีเมียม พร้อมอธิบายเหตุผลเชิงกลยุทธ์แบบภาษาไทย',
    color: '#1d4ed8',
    bg: '#eff6ff',
  },
  {
    icon: '📊',
    title: 'Promotion Simulator',
    titleEn: 'จำลองโปรก่อนลงจริง',
    desc: 'จำลองผลลัพธ์ก่อนลงโปร เช่น ลดราคา ส่งฟรี Flash Sale Bundle และ Affiliate รู้ก่อนว่ายังกำไรหรือขาดทุน',
    color: '#b45309',
    bg: '#fffbeb',
  },
  {
    icon: '⚔️',
    title: 'Price War Simulator',
    titleEn: 'วิเคราะห์สงครามราคา',
    desc: 'เปรียบเทียบกับราคาคู่แข่งและแนะนำกลยุทธ์: ลดตามได้ไหม ทำ bundle ดีกว่าไหม หรือควรสู้ด้วยคุณค่า',
    color: '#9f1239',
    bg: '#fff1f2',
  },
  {
    icon: '💬',
    title: 'AI Value Justifier',
    titleEn: 'สร้างข้อความโน้มน้าว',
    desc: 'สร้างข้อความตอบลูกค้าที่ต่อราคา แคปชันขายเน้นคุณค่า และเหตุผลที่สินค้าคุ้มกว่าราคาถูก',
    color: '#6b21a8',
    bg: '#faf5ff',
  },
]

export function Features({ onStart }: { onStart: () => void }) {
  return (
    <section
      id="features"
      data-testid="features"
      style={{
        padding: '80px 24px',
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>
            เครื่องมือทั้งหมด
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              color: '#1c1917',
              letterSpacing: '-0.03em',
              margin: '0 0 16px',
              lineHeight: 1.15,
            }}
          >
            5 เครื่องมือที่เปลี่ยน<br />
            <span style={{ color: '#0d4f4f' }}>วิธีตั้งราคาของคุณ</span>
          </h2>
          <p style={{ fontSize: 17, color: '#78716c', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            ไม่ใช่แค่เครื่องคิดเลข แต่คือที่ปรึกษาราคาที่บอกว่าต้องทำอะไรต่อ
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card-sm"
              data-testid={`feature-card-${i}`}
              style={{
                padding: '28px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: f.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  marginBottom: 16,
                }}
              >
                {f.icon}
              </div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1c1917', marginBottom: 2 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 13, color: f.color, fontWeight: 600 }}>
                  {f.titleEn}
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#78716c', lineHeight: 1.65, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}

          {/* CTA card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0d4f4f 0%, #116060 100%)',
              borderRadius: 12,
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
              minHeight: 180,
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: 10 }}>
                พร้อมเริ่ม<br />คำนวณแล้วหรือยัง?
              </div>
              <p style={{ fontSize: 14, color: '#a5d6d6', lineHeight: 1.6, margin: 0 }}>
                ใช้งานฟรี ไม่ต้องสมัครสมาชิก เริ่มได้เดี๋ยวนี้
              </p>
            </div>
            <button
              onClick={onStart}
              style={{
                background: '#4ecdc4',
                color: '#0d4f4f',
                border: 'none',
                borderRadius: 10,
                padding: '12px 20px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Noto Sans Thai', system-ui, sans-serif",
                transition: 'background 0.15s',
              }}
            >
              เริ่มคำนวณกำไรจริง →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
