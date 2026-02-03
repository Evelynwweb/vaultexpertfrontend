import React from 'react'
import {ImStack} from 'react-icons/im'
import {SiReactos} from 'react-icons/si'
import {TbCertificate,TbChartDots2} from 'react-icons/tb'
import {TfiPieChart} from 'react-icons/tfi'
import {BsBarChartLine} from 'react-icons/bs'
import {BiNetworkChart} from 'react-icons/bi'
import {GiChart} from 'react-icons/gi'
import {MdOutlineAddchart} from 'react-icons/md'
const Faqcard = () => {
  return (
    <div className='why-choose-section'>
        <div className="why-choose-us-text-container">
            <div className="header" data-aos="fade-up">
                <span className="header-line"></span>
                <h2>why choose us</h2>
            </div>
            <h1 data-aos="fade-up">best qualities</h1>
            <p data-aos="fade-up">Our Team combines a passion for esports, industry experise & proven record in finance, development, marketing.</p>
        </div>
        <div className="why-choose-us-card-container">
            <div className="why-choose-us-card distort-container" data-aos="fade-up">
                <span className="card-counter counter-distorted">
                    <TfiPieChart />
                </span>
                <div className="distorted-card-wrapper">
                    <h2>cryptocurrencies</h2>
                    <h3>crypto</h3>
                    <span className="distorted-line"></span>
                    <p>Cryptocurrencies are the fastest growing assets in the financial space today, and we have devised strategies to successsfully trade them.</p>
                </div>
            </div>
            <div className="why-choose-us-card distort-container" data-aos="fade-up">
                <span className="card-counter counter-distorted">
                    <BsBarChartLine />
                </span>
                <div className="distorted-card-wrapper">
                    <h2>arbitrage trading</h2>
                    <h3>forex</h3>
                    <span className="distorted-line"></span>
                    <p>Our Forex pairs are carefully selected in a way that balances an active portfolio for steady profits and lower risks for our investors.</p>
                </div>
            </div>
            <div className="why-choose-us-card distort-container" data-aos="fade-up">
                <span className="card-counter counter-distorted">
                    <BiNetworkChart />
                </span>
                <div className="distorted-card-wrapper">
                    <h2>stocks & ETFs</h2>
                    <h3>stock ex</h3>
                    <span className="distorted-line"></span>
                    <p>Through Industry ETFs, investors access the stocks and securities of specific industry sectors, such as energy, biotechnology, or chemicals.</p>
                </div>
            </div>
            <div className="why-choose-us-card distort-container" data-aos="fade-up">
                <span className="card-counter counter-distorted">
                    <GiChart />
                </span>
                <div className="distorted-card-wrapper">
                    <h2>commodity ETFs</h2>
                    <h3>stocks & ETFs</h3>
                    <span className="distorted-line"></span>
                    <p>The Commodity ETF allows our investors to accessphysical commodities, such as agricultural goods, natural resources, and precious metals</p>
                </div>
            </div>
            <div className="why-choose-us-card distort-container" data-aos="fade-up">
                <span className="card-counter counter-distorted">
                    <MdOutlineAddchart />
                </span>
                <div className="distorted-card-wrapper">
                    <h2>options & indexes</h2>
                    <h3>binary indexes</h3>
                    <span className="distorted-line"></span>
                    <p>Options give our investors the opportunity, but not the obligation, to buy or sell an underlying asset at an agreed-upon price and date.</p>
                </div>
            </div>
            <div className="why-choose-us-card distort-container" data-aos="fade-up">
                <span className="card-counter counter-distorted">
                    <TbChartDots2 />
                </span>
                <div className="distorted-card-wrapper">
                    <h2>options & indexes</h2>
                    <h3>barrier options</h3>
                    <span className="distorted-line"></span>
                    <p>Barrier options provide a pay-out to our investors when the underlying security does (or does not) reach a pre-determined price.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Faqcard