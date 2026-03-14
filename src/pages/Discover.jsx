import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Discover.css'

const TIMELINE = [
  { year: '2022', title: 'Fondazione', desc: 'Valiance nasce come piccolo gruppo di amici appassionati di PvP Minecraft.' },
  { year: '2023', title: 'Crescita', desc: 'Raggiungiamo 50+ membri attivi e consolidiamo la nostra posizione su Coral.' },
  { year: '2024', title: 'Espansione', desc: 'Apertura del server Discord Gang, nuovi progetti e eventi community.' },
  { year: '2025', title: 'Oggi', desc: 'Continuiamo a crescere, a competere e a costruire una community solida.' },
]

const VALUES = [
  { icon: '🏆', label: 'Eccellenza', desc: 'Puntiamo sempre al meglio in ogni aspetto del gioco.' },
  { icon: '🤝', label: 'Rispetto',   desc: 'Ogni membro è trattato con dignità e rispetto.' },
  { icon: '🔥', label: 'Passione',   desc: 'Giochiamo perché amiamo Minecraft e la competizione.' },
  { icon: '🌐', label: 'Community',  desc: 'Una famiglia unita da obiettivi e valori condivisi.' },
]

export default function Discover() {
  return (
    <>
      <Navbar />
      <main className="discover-main">
        <div className="container">
          {/* Header */}
          <div className="discover-header">
            <Link to="/" className="back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Torna alla home
            </Link>
            <div className="section-label mt-2">Chi siamo</div>
            <h1 className="discover-title">Scopri Valiance</h1>
            <p className="muted discover-sub">
              Un clan fondato sulla competizione sana, il rispetto e la voglia di vincere ogni sfida.
            </p>
          </div>

          {/* Values */}
          <section className="discover-section">
            <h2>I nostri valori</h2>
            <div className="values-grid mt-2">
              {VALUES.map(v => (
                <div className="card value-card" key={v.label}>
                  <div className="value-icon">{v.icon}</div>
                  <h3>{v.label}</h3>
                  <p className="muted mt-1">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="discover-section">
            <h2>La nostra storia</h2>
            <div className="timeline mt-2">
              {TIMELINE.map((item, i) => (
                <div className="timeline-item" key={item.year}>
                  <div className="timeline-dot" />
                  {i < TIMELINE.length - 1 && <div className="timeline-line" />}
                  <div className="timeline-content card">
                    <span className="timeline-year">{item.year}</span>
                    <h3>{item.title}</h3>
                    <p className="muted mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Join CTA */}
          <section className="discover-section discover-cta">
            <div className="card cta-card">
              <h2>Vuoi unirti a noi?</h2>
              <p className="muted mt-1">
                Entra nel nostro Discord, presentati e aspetta che lo staff ti valuti.
                Cerchiamo giocatori appassionati e rispettosi.
              </p>
              <div className="cta-buttons mt-3">
                <a href="https://discord.gg/GVMGZuGZ8F" target="_blank" rel="noopener noreferrer"
                   className="btn btn-primary">
                  Discord Clan
                </a>
                <a href="https://discord.gg/YmZHAeSGzN" target="_blank" rel="noopener noreferrer"
                   className="btn btn-secondary">
                  Discord Gang
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
