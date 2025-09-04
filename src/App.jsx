import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Theme } from '@carbon/react'
import Home from './pages/Home.jsx'
import Diagram from './pages/Diagram.jsx'
import HeaderBar from './components/HeaderBar.jsx'

const STORAGE_KEY = 'cds-theme'

const getInitialTheme = () => {
  // 1) saved preference
  const saved = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)
  if (saved === 'g10' || saved === 'g90') return saved
  // 2) system preference
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'g90' : 'g10'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  // keep localStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  // live-update when OS theme changes (only if user hasn't explicitly chosen yet)
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mql) return
    const handler = (e) => {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved !== 'g10' && saved !== 'g90') {
        setTheme(e.matches ? 'g90' : 'g10')
      }
    }
    mql.addEventListener?.('change', handler)
    return () => mql.removeEventListener?.('change', handler)
  }, [])

  const toggleTheme = useMemo(
    () => () => setTheme((t) => (t === 'g10' ? 'g90' : 'g10')),
    []
  )

  return (
    <Theme theme={theme}>
      <HeaderBar theme={theme} toggleTheme={toggleTheme} />
      {/* Carbon Header is fixed; give content breathing room */}
      <main style={{ paddingTop: '3.5rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagram/:slug" element={<Diagram />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Theme>
  )
}