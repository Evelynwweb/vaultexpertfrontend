import React from 'react'
import './why.css'
import { FaUserPlus } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { BsBarChartFill } from "react-icons/bs";
const Why = () => {
    return (
        <div className='why-choose-section'>
            <div className="why-choose-us-text-container">
                <div className="header" data-aos="fade-up">
                    <span className="header-line"></span>
                    <h2>get started with</h2>
                </div>
                <h1 data-aos="fade-up">vaultexpertgroup</h1>
                <p data-aos="fade-up">follow these simple steps to start your best investment journey</p>
            </div>
            <div className="why-choose-us-card-container">
                <div className="why-choose-us-card" data-aos="fade-up">
                    <span className="card-counter">01</span>
                    <FaUserPlus />
                    <h2>Create an account</h2>
                    <p>we employ the use of latest reliable and sophisticated technology, to ensure strongly secured, fast and reliable transactions.</p>
                </div>
                <div className="why-choose-us-card" data-aos="fade-up">
                    <span className="card-counter">02</span>
                    <IoWallet />
                    <h2>Make a deposit</h2>
                    <p>your investments are very much upgradeable at any point you want to. we provide our clients the ability to scale up their investments.</p>
                </div>
                <div className="why-choose-us-card" data-aos="fade-up">
                    <span className="card-counter">03</span>
                    <BsBarChartFill />
                    <h2>Start investing</h2>
                    <p>We use our advanced experience in arbitrage trading to minimize our clients cost of trade and unnecessary transaction expenses.</p>
                </div>
            </div>
        </div>
    )
}

export default Why