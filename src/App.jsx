import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Hero from './sections/Hero.jsx'
import WhoWeAre from './sections/WhoWeAre.jsx'
import WhyOneWarehouse from './sections/WhyOneWarehouse.jsx'
import SixSteps from './sections/SixSteps.jsx'
import Distribution from './sections/Distribution.jsx'
import PortalTeaser from './sections/PortalTeaser.jsx'
import Faq from './sections/Faq.jsx'
import FinalCta from './sections/FinalCta.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhoWeAre />
        <WhyOneWarehouse />
        <SixSteps />
        <Distribution />
        <PortalTeaser />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
