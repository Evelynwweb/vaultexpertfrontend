import React, { useState } from 'react'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import {BsStar} from 'react-icons/bs'
import 'react-vertical-timeline-component/style.min.css';
import { FaArrowRight,FaArrowLeft } from "react-icons/fa";
const Roadmap = () => {
  return (
  <div className='why-choose-section'>
        <div className="why-choose-us-text-container">
            <div className="header" data-aos="fade-up">
                <span className="header-line"></span>
                <h2>Our History</h2>
            </div>
            <h1 data-aos="fade-up">Brief History of stockedgecapital</h1>
            <p data-aos="fade-up">A journey through our legacy in forex trading, arbitrage, and financial technology.</p>
        </div>
        <div className="why-choose-us-card-container">
            <VerticalTimeline>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: 'transparent', color: 'rgb(4, 57, 133)' }}
                    contentArrowStyle={{ borderRight: '7px solid  #f2f2f2' }}
                    date="2001 - Present"
                    iconStyle={{ background: 'rgb(4, 57, 133)',  color: '#f2f2f2' }}
                    icon={<FaArrowLeft />}
                >
                    <h4 className="vertical-timeline-element-subtitle">stockedgecapital Founded</h4>
                    <p>Paul D. Gonzales launches stockedgecapital, pioneering forex trading, high-frequency arbitrage, and global liquidity management.</p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2003"
                    contentStyle={{ background: 'transparent', color: 'rgb(4, 57, 133)' }}
                    iconStyle={{ background: 'rgb(4, 57, 133)',  color: '#f2f2f2' }}
                    icon={<FaArrowRight />}
                    contentArrowStyle={{ borderRight: '7px solid  #f2f2f2' }}
                >
                    <p>stockedgecapital Arbitrage Fund I & IA close at $52M, marking a milestone in forex interbank arbitrage strategies and liquidity management.</p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2005"
                      contentStyle={{ background: 'transparent', color: 'rgb(4, 57, 133)', border: '1px solid rgba(70, 123, 255, 0.491)' }}
                    iconStyle={{ background: 'rgb(4, 57, 133)',  color: '#f2f2f2' }}
                    icon={<FaArrowLeft />}
                    contentArrowStyle={{ borderRight: '7px solid  #f2f2f2' }}
                >
                    <p>stockedgecapital expands forex investments, allocating capital to liquidity provisioning, cross-border arbitrage, and currency market stabilization. Arbitrage Fund II closes at $102M.</p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2007"
                    contentStyle={{ background: 'transparent', color: 'rgb(4, 57, 133)' }}
                    iconStyle={{ background: 'rgb(4, 57, 133)',  color: '#f2f2f2' }}
                    icon={<FaArrowRight />}
                    contentArrowStyle={{ borderRight: '7px solid  #f2f2f2' }}
                >
                    <p>stockedgecapital acquires distressed forex portfolios from global banks, establishing itself as a leader in currency hedging and automated arbitrage trading. Arbitrage Fund III reaches $220M.</p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2010"
                    contentStyle={{ background: 'transparent', color: 'rgb(4, 57, 133)' }}
                    iconStyle={{ background: 'rgb(4, 57, 133)',  color: '#f2f2f2' }}
                    icon={<FaArrowLeft />}
                    contentArrowStyle={{ borderRight: '7px solid  #f2f2f2' }}
                >
                    <p>stockedgecapital launches its AI-driven forex analytics platform, allowing institutional traders to execute ultra-low latency trades using machine learning algorithms.</p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2013"
                    contentStyle={{ background: 'transparent', color: 'rgb(4, 57, 133)' }}
                    iconStyle={{ background: 'rgb(4, 57, 133)',  color: '#f2f2f2' }}
                    icon={<FaArrowRight />}
                    contentArrowStyle={{ borderRight: '7px solid  #f2f2f2' }}
                >
                    <p>stockedgecapital expands into decentralized forex trading (DeFi FX), implementing blockchain-based smart contracts for cross-border forex transactions.</p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2017"
                    contentStyle={{ background: 'transparent', color: 'rgb(4, 57, 133)' }}
                    iconStyle={{ background: 'rgb(4, 57, 133)',  color: '#f2f2f2' }}
                    icon={<FaArrowLeft />}
                    contentArrowStyle={{ borderRight: '7px solid  #f2f2f2' }}
                >
                    <p>stockedgecapital introduces AI-Powered Arbitrage Trading Bots, optimizing forex trades across multiple liquidity pools while ensuring near-zero slippage.</p>
                </VerticalTimelineElement>

               
            </VerticalTimeline>
        </div>
    </div>
  )
}

export default Roadmap