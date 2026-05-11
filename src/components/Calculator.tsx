import type { PricingInputs } from '../lib/pricing'

interface CalculatorProps {
  inputs: PricingInputs
  onChange: (inputs: PricingInputs) => void
  onReset: () => void
}

interface FieldConfig {
  key: keyof PricingInputs
  label: string
  sublabel?: string
  type: 'text' | 'number' | 'percent'
  placeholder?: string
  min?: number
  max?: number
  step?: number
}

const FIELDS: FieldConfig[] = [
  {
    key: 'productName',
    label: 'ชื่อสินค้า',
    type: 'text',
    placeholder: 'เช่น ครีมกันแดด SPF50',
  },
  {
    key: 'price',
    label: 'ราคาขาย',
    sublabel: '฿',
    type: 'number',
    placeholder: '350',
    min: 0,
    step: 1,
  },
  {
    key: 'productCost',
    label: 'ต้นทุนสินค้า',
    sublabel: '฿',
    type: 'number',
    placeholder: '150',
    min: 0,
    step: 1,
  },
  {
    key: 'packagingCost',
    label: 'ค่ากล่อง/แพ็กของ',
    sublabel: '฿',
    type: 'number',
    placeholder: '15',
    min: 0,
    step: 0.5,
  },
  {
    key: 'shippingSubsidy',
    label: 'ค่าส่งที่ร้านรับเอง',
    sublabel: '฿',
    type: 'number',
    placeholder: '40',
    min: 0,
    step: 1,
  },
  {
    key: 'platformFeePercent',
    label: 'ค่าธรรมเนียมแพลตฟอร์ม',
    sublabel: '%',
    type: 'percent',
    placeholder: '5',
    min: 0,
    max: 50,
    step: 0.5,
  },
  {
    key: 'adCost',
    label: 'ค่าแอดต่อออเดอร์',
    sublabel: '฿',
    type: 'number',
    placeholder: '20',
    min: 0,
    step: 1,
  },
  {
    key: 'discount',
    label: 'ส่วนลด/คูปอง',
    sublabel: '฿',
    type: 'number',
    placeholder: '0',
    min: 0,
    step: 1,
  },
  {
    key: 'affiliatePercent',
    label: 'ค่าคอม Affiliate',
    sublabel: '%',
    type: 'percent',
    placeholder: '0',
    min: 0,
    max: 50,
    step: 0.5,
  },
  {
    key: 'returnRatePercent',
    label: 'อัตราคืนสินค้า/ของเสีย',
    sublabel: '%',
    type: 'percent',
    placeholder: '2',
    min: 0,
    max: 50,
    step: 0.5,
  },
  {
    key: 'targetMarginPercent',
    label: 'เป้าหมายกำไร',
    sublabel: '%',
    type: 'percent',
    placeholder: '25',
    min: 0,
    max: 100,
    step: 1,
  },
]

const PLATFORM_PRESETS = [
  { label: 'Shopee', fee: 5 },
  { label: 'TikTok Shop', fee: 4 },
  { label: 'Lazada', fee: 6 },
  { label: 'Facebook', fee: 0 },
  { label: 'LINE OA', fee: 0 },
]

export function Calculator({ inputs, onChange, onReset }: CalculatorProps) {
  const handleChange = (key: keyof PricingInputs, value: string | number) => {
    onChange({ ...inputs, [key]: value })
  }

  const applyPreset = (fee: number) => {
    onChange({ ...inputs, platformFeePercent: fee })
  }

  return (
    <section
      id="calculator"
      data-testid="calculator"
      style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ marginBottom: 40 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>
          เครื่องคำนวณ
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
          Profit Reality Engine
        </h2>
        <p style={{ fontSize: 16, color: '#78716c', margin: 0 }}>
          กรอกข้อมูลแล้วดูผลลัพธ์แบบ real-time ทางขวา
        </p>
      </div>

      {/* Platform presets */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: '#78716c', fontWeight: 600, marginBottom: 10 }}>
          เลือกแพลตฟอร์มที่ขาย (ตั้งค่าธรรมเนียมอัตโนมัติ)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PLATFORM_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.fee)}
              data-testid={`preset-${p.label}`}
              className={`btn-ghost ${inputs.platformFeePercent === p.fee ? 'active' : ''}`}
            >
              {p.label} {p.fee > 0 ? `(${p.fee}%)` : '(ฟรี)'}
            </button>
          ))}
        </div>
      </div>

      <div
        className="card"
        style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}
      >
        {FIELDS.map((field) => (
          <div key={field.key} data-testid={`field-${field.key}`}>
            <label
              htmlFor={`input-${field.key}`}
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#44403c',
                marginBottom: 6,
              }}
            >
              {field.label}
              {field.sublabel && (
                <span style={{ color: '#a8a29e', fontWeight: 400, marginLeft: 4 }}>
                  ({field.sublabel})
                </span>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              {field.sublabel && field.sublabel !== '%' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a8a29e',
                    fontSize: 14,
                    fontWeight: 600,
                    pointerEvents: 'none',
                  }}
                >
                  {field.sublabel}
                </span>
              )}
              <input
                id={`input-${field.key}`}
                type={field.type === 'text' ? 'text' : 'number'}
                className="input-field"
                value={inputs[field.key] as string | number}
                onChange={(e) =>
                  handleChange(
                    field.key,
                    field.type === 'text' ? e.target.value : parseFloat(e.target.value) || 0
                  )
                }
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
                style={{
                  paddingLeft: field.sublabel && field.sublabel !== '%' ? 24 : 12,
                  paddingRight: field.sublabel === '%' ? 28 : 12,
                }}
              />
              {field.sublabel === '%' && (
                <span
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a8a29e',
                    fontSize: 13,
                    pointerEvents: 'none',
                  }}
                >
                  %
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Reset button */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            className="btn-ghost"
            onClick={onReset}
            data-testid="reset-btn"
            style={{ width: '100%', padding: '10px 16px', color: '#78716c' }}
          >
            ↺ รีเซ็ตค่าทั้งหมด
          </button>
        </div>
      </div>
    </section>
  )
}
