import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import './ServerStatus.css'

const SERVER_IP = 'play.coralmc.it'

export default function ServerStatus() {
  const [data, setData] = useState({ online: null, players: null, maxPlayers: null, version: '1.20+', motd: null })
  const [copied, setCopied] = useState(false)
  const [secRef, secInView] = useInView()

  useEffect(() => {
    async function fetch_() {
      try {
        const r = await fetch(`/api/server-status?host=${encodeURIComponent(SERVER_IP)}`)
        if (!r.ok) throw new Error()
        const d = await r.json()
        setData({ online: d.online, players: d.players, maxPlayers: d.max_players, version: d.version || '1.20+', motd: d.motd })
      } catch {
        try {
          const r = await fetch(`https://api.mcstatus.io/v2/status/java/${encodeURIComponent(SERVER_IP)}`)
          const d = await r.json()
          setData({ online: d.online, players: d.players?.online ?? 0, maxPlayers: d.players?.max ?? 0, version: d.version?.name_raw || '1.20+', motd: d.motd?.clean || null })
        } catch {
          setData(s => ({ ...s, online: false }))
        }
      }
    }
    fetch_()
    const interval = setInterval(fetch_, 60_000)
    return () => clearInterval(interval)
  }, [])

  function copyIP() {
    navigator.clipboard.writeText(SERVER_IP).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isOnline = data.online === true
  const isUnknown = data.online === null

  return (
    <section id="status" ref={secRef}>
      <div className="container">
        <div className={`reveal ${secInView ? 'visible' : ''}`}>
          <div className="label">Minecraft</div>
          <h2>Server Status</h2>
          <p className="muted mt-1 mb-3">
            Stato in tempo reale di <strong style={{ color: 'var(--text-1)' }}>play.coralmc.it</strong>, il server su cui gioca Valiance.
          </p>
        </div>

        <div className={`status-card card reveal reveal-delay-1 ${secInView ? 'visible' : ''}`}>
          <div className="status-header">
            <div className="status-server-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                <line x1="6" y1="6" x2="6.01" y2="6"/>
                <line x1="6" y1="18" x2="6.01" y2="18"/>
              </svg>
            </div>
            <div className="status-server-info">
              <h3>CoralMC</h3>
              <p className="muted" style={{ fontSize: '0.85rem' }}>Server PvP di riferimento per Valiance</p>
            </div>
            <div className={`status-indicator ${isUnknown ? 'unknown' : isOnline ? 'online' : 'offline'}`}>
              <span className={`dot ${isOnline ? 'online' : ''}`} />
              <span className="condensed">
                {isUnknown ? 'Controllo...' : isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          <hr className="divider" style={{ margin: '1.25rem 0' }} />

          <div className="status-metrics">
            <div className="status-metric">
              <span className="status-metric-label condensed">Indirizzo IP</span>
              <button className="ip-copy-btn" onClick={copyIP}>
                <code className="mono">{SERVER_IP}</code>
                {copied
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--olive-300)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                }
              </button>
            </div>
            <div className="status-metric">
              <span className="status-metric-label condensed">Versione</span>
              <span className="status-metric-val mono">{data.version}</span>
            </div>
            <div className="status-metric">
              <span className="status-metric-label condensed">Giocatori</span>
              <span className="status-metric-val mono olive">
                {data.players !== null ? `${data.players}${data.maxPlayers ? `/${data.maxPlayers}` : ''}` : '--'}
              </span>
            </div>
          </div>

          {isOnline && data.players !== null && (
            <div className="players-bar mt-3">
              <div
                className="players-bar-fill"
                style={{ width: `${Math.min((data.players / (data.maxPlayers || 100)) * 100, 100)}%` }}
              />
            </div>
          )}

          <p className="muted mt-3" style={{ fontSize: '0.85rem' }}>
            Entra su <strong style={{ color: 'var(--olive-200)' }}>{SERVER_IP}</strong> e
            gioca con i membri di Valiance. Versione Java Edition richiesta.
          </p>
        </div>
      </div>
    </section>
  )
}
