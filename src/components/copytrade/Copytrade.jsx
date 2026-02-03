import React from 'react'
import './copytrade.css'
import { useNavigate } from 'react-router-dom'
const Copytrade = () => {
    const navigate = useNavigate()
    return (
        <div className='about-section copy-trade-section' id='about'>
            <div className="about-wrapper copy-trade-wrapper about-copy-trade-section">

                <div className="why-choose-us-text-container about-text copy-trade-text">
                    <div className="header" data-aos="fade-up">
                        <span className="header-line"></span>
                        <h2 >what we do at</h2>
                    </div>
                    <h1 data-aos="fade-up" className='copytrade-header'>vaultexpertgroup</h1>
                    <p data-aos="fade-up">
                        At vaultexpertgroup, we provide accurate forex analysis to help investors maximize profits through copy trading. Using MT4 and MT5, our experts analyze the markets with technical and fundamental strategies, identifying high-probability trades. We share real-time signals, market updates, and risk assessments directly through our Telegram channel, allowing investors to copy top-performing trades effortlessly.
                    </p>
                    <button
                        className="launch-btn"
                        initial={{ y: 45, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.65, delay: 0.6 }}
                        onClick={() => {
                            const link = document.createElement("a");
                            link.href = "/vaultexpertgroup_Certificate.pdf";
                            link.download = "certificate.pdf";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                    >
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor"></path>
                        </svg>
                        <span>Incorporation Certificate</span>
                    </button>

                </div>
                <div className="about-img-container" data-aos="fade-up">
                    <img src="/stockedgelogo11.png" className='forex-img ' />
                </div>
            </div>
        </div>
    )
}

export default Copytrade