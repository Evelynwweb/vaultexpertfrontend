import React from 'react'
import Landpage from '../components/Landpage/Landpage'
import Why from '../components/why/Why'
import Service from '../components/service/Service'
import Plan from '../components/plans/Plan'
import About from '../components/about/About'
import Feature from '../components/feature/Feature'
import Roadmap from '../components/roadmap/Roadmap'
import Faq from '../components/Faq/Faq'
import Review from '../components/review/Review'
import Contact from '../components/contact/Contact'
import Footer from '../components/footer/Footer'
import Faqcard from './Faqcard'
import Videoframe from '../components/videoframe/Videoframe'
import TeslaWidgetContainer from '../components/Teslawidget/TeslaWidgetContainer'
import CryptoNewsContainer from '../components/CryptoNewsSection/CryptoNewsContainer'
import ForexAnalysisSection from '../components/ForexAnalysisSection/ForexAnalysisSection'
import Mt5Section from '../components/mt5/Mt5Section'
const Home = () => {
  return (
    <main className='home-img'>
      <Landpage />
      <Videoframe />
      <Why />
        
        {/* <TradeInfo /> */}
      <About />
      <TeslaWidgetContainer />
      <CryptoNewsContainer />
      <Faqcard />
      <ForexAnalysisSection />
      <Feature />
        {/* <Roadmap /> */}
        {/* <div className="crypto-chart-container" data-aos="fade-up">
        <div className="price-chartt-section home-chart">
            <iframe src="https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=859&pref_coin_id=1505" style={{width:"100%",height:"536px",scrolling:"none",marginWidth:"0",marginHeight:"0", frameBorder:"0", border:"0",lineHeight: '14px'}}></iframe>
        </div>
      </div> */}
      {/* <Copytrade /> */}
        <Mt5Section />
        <Review />
        <Faq />
        {/* <Contact /> */}
        <Footer />
    </main>
  )
}

export default Home