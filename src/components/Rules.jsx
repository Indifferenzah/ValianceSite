import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import './Rules.css'

export default function Rules() {
  const [rules, setRules] = useState([])
  const [secRef, secInView] = useInView()

  useEffect(() => {
    fetch('/api/rules')
      .then(r => r.json())
      .then(res => setRules(res.data || []))
      .catch(() => {})
  }, [])

  return (
    <section id="rules" ref={secRef}>
      <div className="container">
        <div className={`reveal ${secInView ? 'visible' : ''}`}>
          <div className="label">Linee guida</div>
          <h2>Regole della Community</h2>
          <p className="muted mt-1 mb-3">
            Seguire queste regole garantisce un ambiente sereno per tutti.
            Violazioni ripetute portano a ban temporanei o permanenti.
          </p>
        </div>

        <div className="rules-grid">
          {rules.map((rule, i) => (
            <div
              key={rule.id}
              className={`rule-item card reveal ${secInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${(i % 4) * 0.08}s` }}
            >
              <div className="rule-num mono">{String(i + 1).padStart(2, '0')}</div>
              <div className="rule-content">
                <div className="rule-header">
                  <span className="rule-icon">{rule.icon}</span>
                  <h3>{rule.title}</h3>
                </div>
                <p className="muted mt-1">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
