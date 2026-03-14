import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Policy.css'

export default function Cookie() {
  return (
    <>
      <Navbar />
      <main className="policy-main">
        <div className="container policy-container">
          <Link to="/" className="back-link">← Torna alla home</Link>
          <h1>Cookie Policy</h1>
          <p className="muted">Ultimo aggiornamento: Gennaio 2025</p>
          <div className="policy-body">
            <h2>1. Cosa sono i Cookie</h2>
            <p>I cookie sono piccoli file di testo salvati sul tuo dispositivo durante la navigazione.</p>
            <h2>2. Cookie Tecnici</h2>
            <p>Utilizziamo cookie tecnici strettamente necessari al funzionamento del sito (es. sessione, preferenze). Non richiedono consenso.</p>
            <h2>3. Cookie Analitici</h2>
            <p>Vercel Analytics raccoglie dati anonimi sulle visite (URL, browser, paese). Non include dati personali identificativi.</p>
            <h2>4. Come Disabilitare i Cookie</h2>
            <p>Puoi disabilitare i cookie dalle impostazioni del tuo browser. Tieni presente che alcune funzionalità del sito potrebbero non funzionare correttamente.</p>
            <h2>5. Contatti</h2>
            <p>Per informazioni sui cookie, contattaci tramite il nostro <a href="https://discord.gg/GVMGZuGZ8F" target="_blank" rel="noopener noreferrer">Discord</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
