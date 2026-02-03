import React from 'react'
import './service.css'
import Header from '../Header/Header'
import Plan from '../plans/Plan'
import Footer from '../footer/Footer'
import ForexAnalysisSection from '../ForexAnalysisSection/ForexAnalysisSection'
import Contact from '../contact/Contact'

const Service = () => {
  return (
    <> 
      <section className='service-section'>
        <Header />
        <div className="service-gap"></div>
        <Plan />
        <ForexAnalysisSection />
      </section>
      <Contact />
      <Footer />
      </>
  )
}

export default Service