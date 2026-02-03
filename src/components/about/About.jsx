import React from 'react'
import './about.css'
import { useNavigate } from 'react-router-dom'
import TradingViewWidget from '../TradingViewWidget'
import MiniSymbolOverviewWidget from '../MiniSymbolOverviewWidget'
const About = () => {
    const navigate = useNavigate()
  return (
      <div className='about-section' id='about'>
          <div className="videoframe-text-container">
          <h1>market <span className="highlight">symbol </span> details</h1>
        </div>
        <div className="about-wrapper">
        <div className="why-choose-us-text-container about-text">
           <MiniSymbolOverviewWidget />
        </div>
        <div className="about-img-container">
            <TradingViewWidget />
        </div>
        </div>
    </div>
  )
}

export default About