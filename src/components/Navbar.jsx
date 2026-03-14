import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const NAV_ITEMS = [
  { label: 'Staff',    href: '/#roster' },
  { label: 'Eventi',   href: '/#events' },
  { label: 'Regole',   href: '/#rules' },
  { label: 'Server',   href: '/#status' },
  { label: 'Discord',  href: '/#discord' },
  { label: 'Scopri',   href: '/discover' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <svg className="logo" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#90CC40" />
                  <stop offset="100%" stopColor="#DDB830" />
                </linearGradient>
              </defs>
              <path d="M3 12l6.5-6.5L12 8l2.5-2.5L21 12l-2 2-4.5-4.5L12 12l-2.5-2.5L5 14l-2-2z" fill="url(#ng)" />
            </svg>
            Valiance
          </Link>

          <nav className="nav-links">
            {NAV_ITEMS.map(item => (
              item.href.startsWith('/#')
                ? <a key={item.label} href={item.href}>{item.label}</a>
                : <Link key={item.label} to={item.href} className={location.pathname === item.href ? 'active' : ''}>{item.label}</Link>
            ))}
          </nav>

          <button className="hamburger" onClick={() => setOpen(true)} aria-label="Apri menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={`mobile-overlay ${open ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && setOpen(false)}>
        <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Chiudi menu">×</button>
        <nav className="mobile-nav">
          {NAV_ITEMS.map(item => (
            item.href.startsWith('/#')
              ? <a key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
              : <Link key={item.label} to={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
      </div>
    </>
  )
}
