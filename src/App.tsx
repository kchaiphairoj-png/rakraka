import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Calculator } from './components/Calculator'
import { ResultsPanel } from './components/ResultsPanel'
import { PromotionSimulator } from './components/PromotionSimulator'
import { PriceWarSimulator } from './components/PriceWarSimulator'
import { ValueJustifier } from './components/ValueJustifier'
import { DashboardSummary } from './components/DashboardSummary'
import { Footer } from './components/Footer'
import { calculate, DEFAULT_INPUTS } from './lib/pricing'
import type { PricingInputs, PricingResults } from './lib/pricing'

export default function App() {
  const [inputs, setInputs] = useState<PricingInputs>(DEFAULT_INPUTS)
  const [results, setResults] = useState<PricingResults>(() => calculate(DEFAULT_INPUTS))
  const [activeSection, setActiveSection] = useState('hero')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setResults(calculate(inputs))
  }, [inputs])

  useEffect(() => {
    document.body.style.background = darkMode ? '#111827' : '#f7f6f3'
  }, [darkMode])

  const handleInputChange = useCallback((newInputs: PricingInputs) => {
    setInputs(newInputs)
  }, [])

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      const offset = 72
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.25, rootMargin: '-72px 0px 0px 0px' }
    )

    const sections = ['hero', 'features', 'calculator', 'promotion', 'pricewar', 'justifier', 'dashboard']
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div
      data-testid="app"
      style={{
        minHeight: '100vh',
        background: darkMode ? '#111827' : '#f7f6f3',
        transition: 'background 0.3s',
        color: darkMode ? '#f9fafb' : '#1c1917',
      }}
    >
      <Header
        activeSection={activeSection}
        onNavigate={scrollToSection}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      <main>
        <Hero
          results={results}
          onStart={() => scrollToSection('calculator')}
          onViewFeatures={() => scrollToSection('features')}
        />

        <Features onStart={() => scrollToSection('calculator')} />

        {/* Calculator + Results layout */}
        <div style={{ background: darkMode ? '#1f2937' : '#f7f6f3' }}>
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
              gap: 32,
              alignItems: 'start',
              padding: '0 24px',
            }}
            className="calc-grid"
          >
            <Calculator inputs={inputs} onChange={handleInputChange} />
            <div
              id="results"
              style={{ position: 'sticky', top: 80, paddingTop: 80, paddingBottom: 80 }}
            >
              <div className="section-label" style={{ marginBottom: 10 }}>
                ผลลัพธ์ Real-time
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#1c1917',
                  margin: '0 0 24px',
                  letterSpacing: '-0.02em',
                }}
              >
                กำไรจริงของคุณ
              </h3>
              <ResultsPanel results={results} inputs={inputs} />
            </div>
          </div>
        </div>

        <PromotionSimulator inputs={inputs} baseResults={results} />
        <PriceWarSimulator inputs={inputs} />
        <ValueJustifier inputs={inputs} results={results} />
        <DashboardSummary results={results} inputs={inputs} />
      </main>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
          .calc-grid > div:last-child {
            position: static !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
