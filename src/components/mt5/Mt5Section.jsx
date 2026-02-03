import React from 'react'
import './mt5section.css'
import { useNavigate } from 'react-router-dom'
const Mt5Section = () => {
  const navigate = useNavigate()
  return (
    <div className='about-section mt5-trade-section' id='about'>
      <div className="videoframe-text-container" data-aos="fade-up">
        <h1>explore  <span className="highlight">mt4/mt5 </span></h1>
        <p>At vaultexpertgroup, we provide accurate forex analysis to help investors maximize profits through copy trading. Using MT4 and MT5, our experts analyze the markets with technical and fundamental strategies, identifying high-probability trades. We share real-time signals, market updates, and risk assessments directly through our Telegram channel, allowing investors to copy top-performing trades effortlessly.</p>
      </div>
      <div className="about-wrapper copy-trade-wrapper mt5-wrapper">

        <div className="why-choose-us-text-container about-text copy-trade-text mt5-text">

          <h1 data-aos="fade-up" className='copytrade-header'>Advanced <span className="highlight">Trading</span></h1>
          <p data-aos="fade-up">
            Ready to dive into the world of stocks? Join vaultexpertgroup today and embark on an exciting journey toward financial success. Sign up now and gain access to a world of opportunities. With our user-friendly platform, expert analysis, and educational resources, you'll have the tools you need to take control of your financial future. Whether you're looking to grow your investment portfolio, plan for retirement, or simply learn more about the stock market, vaultexpertgroup is here to support you every step of the way.
          </p>
          <button className='launch-btn'
            initial={{ y: 45, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.6 }}
            onClick={() => {
              navigate('/signup')
            }}
          >
            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor"></path></svg>
            <span>start trading</span>
          </button>
        </div>
        <div className="about-img-container mt5-img" data-aos="fade-up">
          <img src="/mt4.gif" className='forex-img ' />
        </div>
      </div>
    </div>
  )
}

export default Mt5Section