import React from 'react'
import './header.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { IoHome } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";
const Header = () => {
    const [showModal, setShowModal] = useState(false)
    const [bgColor, setBgColor] = useState(false)
    const changeOnScroll = ()=>{
        if(window.scrollY >= 90){
            setBgColor(true)
        }
        else{
            setBgColor(false)
        }
    }
    window.addEventListener('scroll', changeOnScroll)
    const navigate = useNavigate()
  return (
    <motion.header className={`${bgColor && 'scroll-color'}`}
        initial={{ opacity:0}}
        animate={{opacity:1}}
        transition={{duration:0.65}}
    >
        <div className="logo-container">
              <img src="/vaultexpertlogo.png" alt="company_logo" className='logo' onClick={()=>{
                navigate('/')
            }}/>
        </div>
        <nav>
            <ul>
                <li>
                    <Link to="/">home</Link>
                    <span className='line'></span>
                </li>
                <li>
                    <Link to="/about">about</Link>
                    <span className='line'></span>
                </li>
                <li>
                    <Link to="/services">services</Link>
                    <span className='line'></span>
                </li>
                <li>
                    <Link to="/faq">faqs</Link>
                    <span className='line'></span>
                </li>
                <li>
                    <Link to="/policy">our policy</Link>
                    <span className='line'></span>
                </li>
                <li>
                    <Link to="/buybitcoin">buy crypto</Link>
                    <span className='line'></span>
                </li>
            </ul>
        </nav>
        <div className="sign-up-btn-container">
            <button className='signup-btn' onClick={()=>{navigate('/login')}}>login</button>
        </div>
        <div class="mobile-menu-container" onClick={()=>{
            setShowModal(!showModal)
          }} >  
                <div class="line1"></div>
                <div class="line2"></div>
                <div class="line3"></div>
          </div>
          <div className={`overlay ${showModal ? 'showing-modal' : ''}`} onClick={() => {
              setShowModal(false)
          }}>
                <div class="menu-card">
                <ul class="list">
                    <li class="element">
                    <IoHome />
                    <Link to='/' class="label">home</Link>
                    </li>
                    <li class="element">
                    <svg
                        class="lucide lucide-user-round-plus"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2"
                        stroke="#7e8590"
                        fill="none"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                        <circle r="5" cy="8" cx="10"></circle>
                        <path d="M19 16v6"></path>
                        <path d="M22 19h-6"></path>
                    </svg>
                    <Link to='/about' class="label">about</Link>
                    </li>
                  </ul>
                  <ul class="list">
                    <li class="element">
                    <FaUserGear />
                    <Link to='/services' class="label">services</Link>
                    </li>
                </ul>
                <ul class="list">
                    <li class="element">
                    <svg
                        class="lucide lucide-settings"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2"
                        stroke="#7e8590"
                        fill="none"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                        ></path>
                        <circle r="3" cy="12" cx="12"></circle>
                    </svg>
                    <Link to='/faq' class="label">FAQ</Link>
                    </li>
                    <li class="element delete">
                    <FaChartLine />
                    <Link to='/buybitcoin' class="label">buy crypto</Link>
                    </li>
                </ul>
                <ul class="list">
                    <li class="element">
                    <FaRegEdit />
                    <Link to='/policy' class="label">policy</Link>
                    </li>
                </ul>
                <ul class="list">
                    <li class="element">
                    <svg
                        class="lucide lucide-user-round-plus"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2"
                        stroke="#7e8590"
                        fill="none"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                        <circle r="5" cy="8" cx="10"></circle>
                        <path d="M19 16v6"></path>
                        <path d="M22 19h-6"></path>
                    </svg>
                    <Link to='/signup' class="label">register</Link>
                    </li>
                </ul>
                <ul class="list">
                    <li class="element">
                    <FaUserCheck />
                    <Link to='/login' class="label">login</Link>
                    </li>
                </ul>
                </div>

              </div>
    </motion.header>
  )
}

export default Header