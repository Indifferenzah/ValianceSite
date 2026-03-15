import { useInView } from '../hooks/useInView'
import './Rules.css'
import rulesData from '../../data/rules.json'

const RULES = rulesData
  .filter(r => r.active)
  .sort((a, b) => a.order_index - b.order_index)
  .map(r => ({ title: r.title, desc: r.description, icon: r.icon }))

export default function Rules() {
  const [secRef, secInView] = useInView()

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
          {RULES.map((rule, i) => (
            <div
              key={rule.title}
              className={`rule-item card reveal ${secInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${(i % 4) * 0.08}s` }}
            >
              <div className="rule-num mono">{String(i + 1).padStart(2, '0')}</div>
              <div className="rule-content">
                <div className="rule-header">
                  <span className="rule-icon">{rule.icon}</span>
                  <h3>{rule.title}</h3>
                </div>
                <p className="muted mt-1">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
