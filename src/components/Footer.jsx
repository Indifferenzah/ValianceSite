import { Link } from 'react-router-dom'
import './Footer.css'

const NAV = [
  { label: 'Staff',   href: '/#roster' },
  { label: 'Eventi',  href: '/#events' },
  { label: 'Regole',  href: '/#rules' },
  { label: 'Server',  href: '/#status' },
  { label: 'Discord', href: '/#discord' },
  { label: 'Scopri',  href: '/discover' },
]

const LEGAL = [
  { label: 'Privacy Policy', to: '/policy/privacy' },
  { label: 'Cookie Policy',  to: '/policy/cookie' },
  { label: 'Termini',        to: '/policy/terms' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-top-inner">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#90CC40" />
                    <stop offset="100%" stopColor="#DDB830" />
                  </linearGradient>
                </defs>
                <path d="M3 12l6.5-6.5L12 8l2.5-2.5L21 12l-2 2-4.5-4.5L12 12l-2.5-2.5L5 14l-2-2z" fill="url(#fg)" />
              </svg>
              <span>Valiance</span>
            </div>
            <p className="footer-desc muted">
              Clan Minecraft PvP fondato sulla competizione,
              il rispetto e la voglia di migliorarsi ogni giorno.
            </p>
            <div className="footer-social">
              <a href="https://discord.gg/GVMGZuGZ8F" target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Discord
              </a>
              <a href="https://github.com/Indifferenzah" target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>

          <div className="footer-nav-col">
            <span className="footer-col-title condensed">Navigazione</span>
            <nav className="footer-nav">
              {NAV.map(item => (
                item.href.startsWith('/#')
                  ? <a key={item.label} href={item.href}>{item.label}</a>
                  : <Link key={item.label} to={item.href}>{item.label}</Link>
              ))}
            </nav>
          </div>

          <div className="footer-nav-col">
            <span className="footer-col-title condensed">Server Minecraft</span>
            <div className="footer-server">
              <code className="mono footer-ip">play.coralmc.it</code>
              <span className="muted" style={{ fontSize: '0.82rem' }}>Java Edition · 1.20+</span>
              <span className="muted" style={{ fontSize: '0.82rem' }}>Il server dove gioca Valiance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            © {year} Valiance — Non affiliato a Mojang / Microsoft
          </span>
          <div className="footer-legal">
            {LEGAL.map(l => (
              <Link key={l.label} to={l.to}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
