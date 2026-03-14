import { useInView } from '../hooks/useInView'
import './Rules.css'

const RULES = [
  {
    title: 'Rispetto',
    desc: 'Tratta ogni membro con rispetto, dentro e fuori dal gioco. Insulti, discriminazioni e molestie comportano segnalazione immediata allo staff.',
    icon: '🤝',
  },
  {
    title: 'Niente spam',
    desc: 'Evita messaggi ripetuti, flood di emoji o menzioni inutili. Mantieni le conversazioni pertinenti ai canali.',
    icon: '🔇',
  },
  {
    title: 'Contenuti appropriati',
    desc: 'Vietati contenuti NSFW, gore, illegali o politicamente divisivi. Siamo una community di gioco — resta in topic.',
    icon: '🛡️',
  },
  {
    title: 'Canali giusti',
    desc: 'Usa i canali dedicati per ogni argomento. Le conversazioni fuori tema vanno in #generale — non intasare canali specifici.',
    icon: '📌',
  },
  {
    title: 'No pubblicità',
    desc: 'Non promuovere server Discord, canali social o prodotti senza approvazione dello staff. Eccezioni solo su richiesta.',
    icon: '🚫',
  },
  {
    title: 'Privacy e sicurezza',
    desc: 'Non condividere dati personali tuoi o altrui. Segnala immediatamente comportamenti sospetti o tentativi di phishing.',
    icon: '🔒',
  },
  {
    title: 'Rispetta lo Staff',
    desc: 'Le decisioni dello staff sono definitive. Per contestare una sanzione apri un ticket — non fare scene pubbliche.',
    icon: '⚖️',
  },
]

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
