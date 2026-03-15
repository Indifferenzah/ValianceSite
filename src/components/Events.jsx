import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import './Events.css'

export default function Events() {
  const [events, setEvents] = useState([])
  const [secRef, secInView] = useInView()

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(res => setEvents(res.data || []))
      .catch(() => {})
  }, [])

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
          {events.map((ev, i) => (
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
                  {(ev.days || []).map(d => (
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
