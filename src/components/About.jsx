import { useInView, useCounter } from '../hooks/useInView'
import './About.css'

function StatCounter({ value, label, delay = 0 }) {
  const [ref, inView] = useInView()
  const numeric = parseInt(String(value).replace(/\D/g, ''), 10)
  const suffix = String(value).replace(/[0-9]/g, '')
  const count = useCounter(numeric, 1600, inView)

  return (
    <div ref={ref} className={`about-stat card reveal ${inView ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>
      <strong className="mono about-stat-num">{inView ? `${count}${suffix}` : `0${suffix}`}</strong>
      <span className="about-stat-label">{label}</span>
    </div>
  )
}

const PILLARS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/>
        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/>
        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
      </svg>
    ),
    title: 'PvP Competitivo',
    desc: 'Allenamenti mirati su 1.8.9, analisi delle meccaniche e sessioni di pratica per portarti al massimo livello. Partecipiamo regolarmente a Clan War contro le migliori squadre del server.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Community Italiana',
    desc: 'Un ambiente dove il rispetto viene prima di tutto. Siamo italiani, accogliamo chiunque condivida i nostri valori e voglia crescere come giocatore e come persona.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Eccellenza',
    desc: 'Non ci accontentiamo della mediocrità. Ogni CW è preparata, ogni strategia è studiata. Il nostro ranking #1 su Coral non è un caso — è il risultato del lavoro di squadra.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Organizzazione',
    desc: 'Staff dedicato, canali Discord strutturati, calendari eventi e regole chiare. Sappiamo che una community forte si costruisce con le fondamenta giuste.',
  },
]

export default function About() {
  const [secRef, secInView] = useInView()

  return (
    <section id="about" ref={secRef}>
      <div className="container">
        <div className={`reveal ${secInView ? 'visible' : ''}`}>
          <div className="label">Chi siamo</div>
          <h2 className="mb-1">Una squadra, un obiettivo</h2>
          <p className="about-intro muted mt-1">
            Valiance nasce nel 2022 dalla passione per Minecraft PvP. Oggi siamo uno dei clan
            più strutturati di CoralMC — con uno staff dedicato, eventi settimanali
            e una community che conta oltre 50 membri attivi.
          </p>
        </div>

        <div className="about-pillars mt-4">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className={`card about-pillar reveal reveal-delay-${i + 1} ${secInView ? 'visible' : ''}`}
            >
              <div className="about-pillar-icon">{p.icon}</div>
              <h3 className="mt-2 mb-1">{p.title}</h3>
              <p className="muted">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="about-stats-row mt-4">
          <StatCounter value="50+" label="Membri Attivi" delay={0} />
          <StatCounter value="1"   label="Rank #1 Coral" delay={0.1} />
          <StatCounter value="2+"  label="Anni di Storia" delay={0.2} />
          <StatCounter value="3"   label="CW / Settimana"  delay={0.3} />
        </div>
      </div>
    </section>
  )
}
