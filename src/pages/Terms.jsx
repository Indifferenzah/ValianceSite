import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Policy.css'

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="policy-main">
        <div className="container policy-container">
          <Link to="/" className="back-link">← Torna alla home</Link>
          <h1>Termini di Servizio</h1>
          <p className="muted">Ultimo aggiornamento: Gennaio 2025</p>
          <div className="policy-body">
            <h2>1. Accettazione</h2>
            <p>Utilizzando questo sito, accetti i presenti Termini di Servizio. Se non li accetti, ti invitiamo a non utilizzare il sito.</p>
            <h2>2. Uso del Sito</h2>
            <p>Il sito è fornito a scopo informativo sul clan Valiance. È vietato qualsiasi utilizzo illecito o non autorizzato.</p>
            <h2>3. Proprietà Intellettuale</h2>
            <p>Tutti i contenuti del sito (testi, grafica, logo) sono proprietà di Valiance. Minecraft è un marchio registrato di Mojang/Microsoft.</p>
            <h2>4. Limitazione di Responsabilità</h2>
            <p>Valiance non è responsabile per eventuali danni derivanti dall'uso del sito o dei server Discord collegati.</p>
            <h2>5. Modifiche</h2>
            <p>Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. L'utilizzo continuato del sito costituisce accettazione delle modifiche.</p>
            <h2>6. Contatti</h2>
            <p>Per qualsiasi domanda, contattaci tramite <a href="https://discord.gg/GVMGZuGZ8F" target="_blank" rel="noopener noreferrer">Discord</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
