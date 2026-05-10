interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'mark'
}

export function Logo({ size = 'md', variant = 'full' }: LogoProps) {
  const sizeMap = {
    sm: { mark: 28, text: 18 },
    md: { mark: 34, text: 22 },
    lg: { mark: 44, text: 28 },
  }
  const s = sizeMap[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, userSelect: 'none' }}>
      {/* SVG mark */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="logo-mark"
      >
        <rect width="40" height="40" rx="10" fill="#0D4F4F" />
        {/* P letterform stylized */}
        <rect x="11" y="10" width="4" height="20" rx="2" fill="#4ECDC4" />
        <path
          d="M15 10h6a7 7 0 0 1 0 14h-6V10z"
          fill="#4ECDC4"
          opacity="0.9"
        />
        <path
          d="M15 17h6a0.5 0.5 0 0 1 0 0"
          fill="#0D4F4F"
        />
        {/* profit arrow */}
        <circle cx="29" cy="28" r="4.5" fill="#16A34A" />
        <path
          d="M27 29.5 L29 27.5 L31 29.5"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {variant === 'full' && (
        <span
          style={{
            fontSize: s.text,
            fontWeight: 800,
            color: '#0D4F4F',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          rakraka
        </span>
      )}
    </div>
  )
}
