import { useInView } from '../hooks/useInView'
import './Events.css'

const EVENTS = [
  {
    id: 1,
    type: 'CW',
    title: 'Clan War Interna',
    desc: 'Allenamento settimanale tra i membri. 5v5 su mappe CW standard. Obbligatoria per tutti i membri attivi — è il nostro modo di affinare le strategie e valutare la forma del team.',
    days: ['Lun', 'Mer', 'Ven'],
    time: '19:00',
    color: '#90CC40',
    glow: 'rgba(144,204,64,0.12)',
  },
  {
    id: 2,
    type: 'PRATICA',
    title: 'Sessione PvP Libera',
    desc: 'Allenamento libero in PvP 1.8.9. Duelli, combo e meccaniche. Aperta a tutti i livelli — l\'ideale per migliorare prima delle CW.',
    days: ['Sab', 'Dom'],
    time: '17:00',
    color: '#DDB830',
    glow: 'rgba(221,184,48,0.1)',
  },
  {
    id: 3,
    type: 'TORNEO',
    title: 'Torneo Mensile',
    desc: 'Ogni primo sabato del mese organizziamo un torneo interno con premi in gioco. Elimina i tuoi compagni di clan e scala la classifica.',
    days: ['1° Sab del mese'],
    time: '20:00',
    color: '#72B42E',
    glow: 'rgba(114,180,46,0.1)',
  },
]

export default function Events() {
  const [secRef, secInView] = useInView()

  return (
    <section id="events" ref={secRef}>
      <div className="container">
        <div className={`reveal ${secInView ? 'visible' : ''}`}>
          <div className="label">Calendario</div>
          <h2>Eventi</h2>
          <p className="muted mt-1 mb-3">
            Partecipa agli appuntamenti settimanali del clan.
          </p>
        </div>

        <div className="events-list">
          {EVENTS.map((ev, i) => (
            <div
              key={ev.id}
              className={`event-card card reveal reveal-delay-${i + 1} ${secInView ? 'visible' : ''}`}
              style={{ '--ev-glow': ev.glow, '--ev-color': ev.color }}
            >
              <div className="event-glow" />
              <div className="event-type-col">
                <span className="event-type-badge condensed" style={{ color: ev.color, borderColor: `${ev.color}44`, background: `${ev.color}12` }}>
                  {ev.type}
                </span>
              </div>
              <div className="event-body-col">
                <h3>{ev.title}</h3>
                <p className="muted mt-1">{ev.desc}</p>
              </div>
              <div className="event-schedule-col">
                <div className="event-days">
                  {ev.days.map(d => (
                    <span className="event-day condensed" key={d}>{d}</span>
                  ))}
                </div>
                <div className="event-time mono">{ev.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
