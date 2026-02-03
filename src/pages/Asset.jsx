import React, { useState } from 'react'
import {RiStockLine} from 'react-icons/ri'
import {FaTractor} from 'react-icons/fa'
import {AiTwotoneBank} from 'react-icons/ai'
import {GiHouse,GiOilPump} from 'react-icons/gi'
import {SiBitcoin} from 'react-icons/si'
import {BsCheckSquare} from 'react-icons/bs'
import { AnimatePresence,motion } from 'framer-motion'
import {GiChart} from 'react-icons/gi'

const Asset = () => {
    const [tabs,setTabs] = useState([
        {
            id:1,
            title:'Forex',
            content:'we are here again',
            header:'forex and arbitrage trading',
            body:[
            "In the dynamic world of investment, vertexglobalwealth shines as a leading company harnessing the potential of forex trading to generate consistent profits. With a diverse team of skilled traders and cutting-edge algorithms, they leverage market trends to maximize returns. By strategically buying and selling currencies, they exploit fluctuations in exchange rates to their advantage. Employing rigorous risk management and extensive research, vertexglobalwealth ensures a balanced portfolio, offering investors an opportunity to passively grow their wealth. Experience the power of forex trading and discover a new realm of financial possibilities with vertexglobalwealth."],
            active:true,
            icon:GiChart,
            bg:'How-Citizenship-by-Investment-Unlocks-the-Potential-of-Cryptocurrency.webp'
        },
        {
            id:2,
            title:'Crypto',
            content:'we are here again',
            header:'crypto currency and NFTs',
            body:[
                "In the ever-evolving world of finance, vertexglobalwealth has emerged as a pioneering force, harnessing the power of cryptocurrencies to generate consistent profits. By skillfully navigating the volatile crypto market, the company utilizes strategic investment approaches to maximize returns for its investors. Leveraging cutting-edge algorithms, in-depth market analysis, and expert insights, vertexglobalwealth identifies lucrative opportunities and executes well-timed trades. Through disciplined risk management and diversification, the company capitalizes on the inherent potential of cryptocurrencies, offering investors a reliable avenue to unlock the wealth of the digital economy."],
            active:false,
            icon:SiBitcoin,
            bg:'Which-Type-of-Investment-Has-the-Highest-Risk.jpg'
        },
        {
            id:3,
            title:'Real Estate',
            content:'we are here again',
            header:'real estate and housing',
            body:[
                "vertexglobalwealth, a renowned real estate investment firm, has mastered the art of generating substantial profits from real estate investments. With a meticulous approach, they identify prime properties in high-growth areas, leveraging their expertise to make informed decisions. Through strategic acquisitions, property development, and rental income, they create a sustainable cash flow stream. Additionally, they capitalize on property appreciation, maximizing returns over the long term. As a trusted partner, vertexglobalwealth empowers investors to tap into the lucrative world of real estate, securing a reliable pathway to financial freedom."],
            active:false,
            icon:GiHouse,
            bg:'model-house-money-real-estate-investment-model-house-money-real-estate-investment-concept-131286610.jpg'
        },
        {
            id:4,
            title:'Oil',
            content:'we are here again',
            header:'crude oil investment',
            body:[
                "In the dynamic realm of investing, vertexglobalwealth stands tall as a company that strategically taps into the potential of oil and gas ventures. Through meticulous analysis and expert decision-making, the company identifies lucrative opportunities within the energy sector, capitalizing on the ever-present demand for these vital resources. By investing in carefully selected oil and gas projects, vertexglobalwealth generates profit through the production and sale of these valuable commodities. With a proven track record, their astute investment approach positions them as a trusted avenue for investors seeking to benefit from the enduring profitability of the oil and gas industry."],
            active:false,
            icon:GiOilPump,
            bg:'original_imageshttpsg.foolcdn.comeditorialimag.width-880_py99TiM.webp'
        },
        {
            id:5,
            title:'Agriculture',
            content:'we are here again',
            header:'argro -tech investment',
            body:[
                "vertexglobalwealth, a visionary company, has found an oasis of profit in the agrotech sector. By strategically investing in cutting-edge agricultural technologies, they sow the seeds of success. Leveraging precision farming, sustainable practices, and data-driven solutions, they optimize crop yields while reducing costs. From vertical farming to IoT-based monitoring systems, their agrotech portfolio blooms with potential. Through eco-conscious innovations, they cultivate healthy crops and a healthy bottom line. With a commitment to reaping sustainable returns, vertexglobalwealth harvests prosperity by nurturing the future of agriculture. Join them and witness the bountiful growth of agrotech investment."],
            active:false,
            icon:FaTractor,
            bg:'Invest4Land-Agriculture-Real-Estate-Investment-Investing-Farmland-Farming-Agrobusiness-Investor-Property-Managed-Farmland-Turkey-Spain-Almond-Walnut0.jpg'
        },
    ])

    const changeContent =(id)=>{
        setTabs(tabs.map(tab => (tab.id === id ? {...tab,active:true} : {...tab,active:false})))
        console.log(tabs)
    }
  return (
    <div className='roadmap-section'>
    <div className="why-choose-us-text-container">
        <div className="header" data-aos="fade-up">
            <span className="header-line"></span>
            <h2>our multi-million dollar assets</h2>
        </div>
        <h1 data-aos="fade-up">industries we invest in</h1>
        <p data-aos="fade-up">
        Here are our major investments from which we build investors' profits. These investments and their underlying assets were carefully selected, using high-end fundamental and technical analysis.
        </p>
    </div>
    <div className="roadmap-container" data-aos="fade-up" >
        <div className="widget-container">
            {
                tabs.map(tab =>
                    // <li className={`icon facebook ${tab.active === true ? 'my-active-tab' : ''}`} onClick={()=>{changeContent(tab.id)}}>
                    //     <span className="tooltip" key={tab.id} >{tab.title}</span>
                    //     <span><tab.icon /></span>
                    // </li>
                    <div className={`widget-tab ${tab.active === true ? 'show-line' : ''}`} onClick={()=>{changeContent(tab.id)}}>
                        <p>{tab.title}</p>
                        <span className="widget-line"></span>
                    </div>
                )
            }
        </div>
        <motion.div className="tab-content asset-content" layout animate={{opacity:1}} initial={{opcaity:0}} exit={{opacity:0}}>
        <AnimatePresence>
            {
                tabs.map(tab => tab.active === true &&
                    <>
                    <motion.div className="tab-text" >
                        <h2>
                            {tab.header}
                        </h2>
                        <span className='thin-line'></span>
                        <ul>
                            {tab.body.map(list => <li>{list}</li>)}
                        </ul> 
                    </motion.div>
                    <motion.div className="tab-img-container">
                        <img src={`${tab.bg}`} alt="" />
                    </motion.div> 
                    </>
                )
            }
        </AnimatePresence>
        </motion.div>
    </div>
</div>
  )
}

export default Asset