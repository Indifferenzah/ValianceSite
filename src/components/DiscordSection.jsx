import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import './DiscordSection.css'

const SERVERS = [
  {
    id: '1350073876339490826',
    name: 'Valiance Clan',
    desc: 'Il cuore del clan. Organizzazione CW, annunci ufficiali, canali per allenamento e community italiana attiva.',
    invite: 'https://discord.gg/GVMGZuGZ8F',
    primary: true,
    features: ['Annunci CW', 'Canali staff', 'Community ITA', 'Ticket support'],
  },
  {
    id: '1436756175310950588',
    name: 'Valiance Gang',
    desc: 'Il server della Gang — progetto parallelo ancora in sviluppo. Seguici per le novità in arrivo.',
    invite: 'https://discord.gg/YmZHAeSGzN',
    primary: false,
    features: ['In sviluppo', 'Novità presto'],
  },
]

function ServerCard({ server, index }) {
  const [online, setOnline] = useState(null)
  const [ref, inView] = useInView()

  useEffect(() => {
    fetch(`/api/discord/guild?id=${server.id}`)
      .then(r => r.json())
      .then(d => setOnline(d.online))
      .catch(() => {
        fetch(`https://discord.com/api/guilds/${server.id}/widget.json`)
          .then(r => r.json())
          .then(d => setOnline(d.presence_count ?? d.members?.length ?? 0))
          .catch(() => setOnline('N/D'))
      })
  }, [server.id])

  return (
    <div
      ref={ref}
      className={`discord-card card reveal reveal-delay-${index + 1} ${inView ? 'visible' : ''} ${server.primary ? 'discord-card-primary' : ''}`}
    >
      {server.primary && <div className="discord-card-accent" />}

      <div className="discord-card-header">
        <div className="discord-logo">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Discord">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
        </div>
        <div className="discord-header-info">
          <h3>{server.name}</h3>
          <div className="discord-online">
            <span className="dot online" />
            <span className="condensed faint" style={{ fontSize: '0.78rem' }}>
              {online !== null ? `${online} online` : 'Caricamento...'}
            </span>
          </div>
        </div>
        <a
          href={server.invite}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn ${server.primary ? 'btn-primary' : 'btn-secondary'} discord-join-btn`}
        >
          Unisciti
        </a>
      </div>

      <p className="muted mt-2" style={{ fontSize: '0.9rem' }}>{server.desc}</p>

      <div className="discord-features mt-2">
        {server.features.map(f => (
          <span className="discord-feature condensed" key={f}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function DiscordSection() {
  const [secRef, secInView] = useInView()

  return (
    <section id="discord" ref={secRef}>
      <div className="container">
        <div className={`reveal ${secInView ? 'visible' : ''}`}>
          <div className="label">Community</div>
          <h2>Discord</h2>
          <p className="muted mt-1 mb-3">
            Unisciti alla nostra community su Discord per restare aggiornato su CW, eventi e novità del clan.
          </p>
        </div>

        <div className="discord-grid">
          {SERVERS.map((s, i) => <ServerCard key={s.id} server={s} index={i} />)}
        </div>
      </div>
    </section>
  )
}
