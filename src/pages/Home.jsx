import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Staff from '../components/Staff'
import Events from '../components/Events'
import Rules from '../components/Rules'
import ServerStatus from '../components/ServerStatus'
import DiscordSection from '../components/DiscordSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '70px' }}>
        <Hero />
        <About />
        <Staff />
        <Events />
        <Rules />
        <ServerStatus />
        <DiscordSection />
      </main>
      <Footer />
    </>
  )
}
