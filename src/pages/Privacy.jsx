import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Policy.css'

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main className="policy-main">
        <div className="container policy-container">
          <Link to="/" className="back-link">← Torna alla home</Link>
          <h1>Privacy Policy</h1>
          <p className="muted">Ultimo aggiornamento: Gennaio 2025</p>
          <div className="policy-body">
            <h2>1. Titolare del Trattamento</h2>
            <p>Il titolare del trattamento dei dati personali è il team Valiance, raggiungibile tramite Discord.</p>
            <h2>2. Dati Raccolti</h2>
            <p>Il sito raccoglie esclusivamente dati tecnici anonimi (indirizzo IP, browser, pagine visitate) tramite Vercel Analytics, al fine di migliorare l'esperienza utente.</p>
            <h2>3. Cookie</h2>
            <p>Utilizziamo cookie tecnici strettamente necessari al funzionamento del sito. Consulta la nostra <Link to="/policy/cookie">Cookie Policy</Link> per maggiori dettagli.</p>
            <h2>4. Diritti dell'Utente</h2>
            <p>Hai il diritto di accedere, rettificare e cancellare i tuoi dati. Per qualsiasi richiesta, contattaci tramite Discord.</p>
            <h2>5. Modifiche</h2>
            <p>Ci riserviamo il diritto di aggiornare questa policy. Le modifiche saranno pubblicate su questa pagina.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
