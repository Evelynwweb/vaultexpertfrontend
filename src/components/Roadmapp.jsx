import React, { useState } from 'react'
import './roadmap.css'
import {RiStockLine} from 'react-icons/ri'
import {AiOutlineSchedule} from 'react-icons/ai'
import {CiWallet} from 'react-icons/ci'
import {FiLogIn} from 'react-icons/fi'
import {AiTwotoneBank} from 'react-icons/ai'
import {BsCheckSquare} from 'react-icons/bs'
import { AnimatePresence,motion } from 'framer-motion'
const Roadmapp = () => {
    const [tabs,setTabs] = useState([
        {
            id:1,
            title:'sign up',
            content:'To join us at vertexglobalwealth, you first have to register for a new account. To register, click the SIGNUP button at the top of the page and fill the simple form.',
            header:'register a new account',
            body:[
            "Free to Register",
            "Referral Bonus",
            "Free Advisory Call",
            "No Country Restriction",
            "Easy Registration Steps"],
            active:true,
            icon:FiLogIn,
            bg:'Best_Gold_Stocks.svg'
        },
        {
            id:2,
            title:'fund wallet',
            content:'After selecting your preferred Plan, next thing to do is fund your account. You can fund easy and fast using the funding option available to your region.',
            header:'fund your account',
            body:[
            "Direct funding",
            "Fast funding reflection",
            "Region-specific options",
            "Zero cost of funding",
            "Secure electronic channels",
            "Easy Registration Steps"],
            active:false,
            icon:CiWallet,
            bg:'Welcome-to-scribie-512x391.svg'
        },
        {
            id:3,
            title:'choose plan',
            content:'After complete registration of new account, next is to select the investment plan that suits your budget and financial goals. Our plans are distributed to adapt to your needs.',
            header:'select an investment plan',
            body:[
            "Adaptive Plan",
            "High ROI on Plans",
            "Match Plans to your Goals",
            "Variety of Options",
            "Plans are Written in Smart Contract",
            "Easy Registration Steps"],
            active:false,
            icon:AiOutlineSchedule,
            bg:'pngtree-stock-market-trading-in-flat-design-png-image_6847815.png'
        },
        {
            id:4,
            title:'invest',
            content:'After funding your account and selecting preferred investment plan, you can proceed to click the invest button below the investment plan card.',
            header:'Invest to start earning',
            body:[
            "periodic increase of investment profits",
            "updated investment status",
            "investment logs",
            "investment start and end date",
            "investment completion alert"],
            active:false,
            icon:RiStockLine,
            bg:'Investment Plan.svg'
        },
        {
            id:5,
            title:'withdraw',
            content:'As soon as your investment matures, your profit becomes available in your wallet, and can be withdrawn to your local account, in the currency available in your region.',
            header:'withdraw your profit',
            body:[
            "Instant Withdrawal",
            "Zero withdrawal cost",
            "Withdraw to local currency",
            "Profits reflect in Wallet",
            "Easy reinvestment from profits"],
            active:false,
            icon:AiTwotoneBank,
            bg:'what-is-business-finance-2.png'
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
                <h2>road map</h2>
            </div>
            <h1 data-aos="fade-up">Our roadmap</h1>
            <p data-aos="fade-up">
                 Here are carefully arranged steps we have made to guide you through the workings of our platform.
            </p>
        </div>
        <div className="roadmap-container" data-aos="fade-up" >
            <div className="tabs-container">
            <ul class="wrapper">
                {
                    tabs.map(tab =>
                        <li className={`icon facebook ${tab.active === true ? 'my-active-tab' : ''}`} onClick={()=>{changeContent(tab.id)}}>
                            <span className="tooltip" key={tab.id} >{tab.title}</span>
                            <tab.icon />
                        </li>
                    )
                }
            </ul>
            </div>
            <motion.div className="tab-content" layout animate={{opacity:1}} initial={{opcaity:0}} exit={{opacity:0}}>
            <AnimatePresence>
                {
                    tabs.map(tab => tab.active === true &&
                        <>
                        <motion.div className="tab-text" layout>
                            <h2>
                                {tab.header}
                            </h2>
                            <span className='thin-line'></span>
                            <p>
                                {tab.content}
                            </p>
                            <ul>
                                {tab.body.map(list => <li><BsCheckSquare />{list}</li>)}
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

export default Roadmapp