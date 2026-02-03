import React from 'react'
import './page.css'
import Header from '../components/Header/Header'
import About from '../components/about/About'
import Footer from '../components/footer/Footer'
import Contact from '../components/contact/Contact'
import ForexAnalysisSection from '../components/ForexAnalysisSection/ForexAnalysisSection'
import Copytrade from '../components/copytrade/Copytrade'
import Why from '../components/why/Why'
import TradeInfo from '../components/TradeInfo/TradeInfo'
const Aboutpage = () => {
  return (
    <>
      <main className='landpage'>
        <Header />
        <section className='about-landpage my-about'>
          <div className="about-page-text">
            <div className="videoframe-text-container about-intro">
              <h1>about  <span className="highlight">vaultexpertgroup </span></h1>
            </div>
          </div>
        </section>
        <Copytrade />
        <TradeInfo />
        <Why />
        <About />
        <ForexAnalysisSection />
        {/* <Contact /> */}
      </main>
      <Footer /></>
  )
}

export default Aboutpage