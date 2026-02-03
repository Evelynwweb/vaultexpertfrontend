import React from 'react'
import Userdashboardheader from '../userdashboardheader/Userdashboardheader'
import {FiArrowRight} from 'react-icons/fi'
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import {MdClose} from 'react-icons/md'
import Swal from 'sweetalert2';
import WithdrawReview from '../WithdrawReview';
import { Pagination, Navigation ,FreeMode} from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { motion,AnimatePresence } from 'framer-motion'
// import { Pagination, Navigation ,FreeMode} from "swiper";
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
const Userdashboardwithdraw = ({route}) => {
  const [loader,setLoader] = useState(false)
  const navigate = useNavigate()
  const [userData, setUserData] = useState()
  useEffect(()=>{
    setLoader(true)
    if(localStorage.getItem('token')){
        const getData = async()=>{
            const req = await fetch(`${route}/api/getData`,{
                headers: {
                'x-access-token': localStorage.getItem('token')
                }
            })
            const res = await req.json()
          setUserData(res)
           if (res.status === 'error') {
                    navigate('/login')
                }
            setLoader(false)
        }
        getData()
    }
    else{
        navigate('/login')
    }
      
},[])
  const [showModal,setShowModal] =useState(false)
  const [activeMethod, setActiveMethod] = useState()
  const [checkoutPage,setCheckoutPage] = useState(false)
  const [withdrawAmount,setWithdrawAmount] = useState()
  const [withdrawMethods,setWithdrawalMethods] = useState([
    {
      id:1,
      min:10,
      max:1000000,
      image:'/btc.png',
      method:'BTC',
    },
    {
      id:2,
      min:10,
      max:1000000,
      image:'/etherium.png',
      method:'ETH',
    },
    {
      id:3,
      min:10,
      max:1000000,
      image:'/tron.png',
      method:'tether(TRC20)',
    },
    {
      id:4,
      min:10,
      max:1000000,
      image:'/solana.png',
      method:'Solana (SOL) ',
    },
  ])

    // sweet alert codes 

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    const close = ()=>{
      setCheckoutPage(false)
    }
    
  return (
    <>
      {
        loader && 
          <Loader />
      }
    {
      !checkoutPage &&
      <div>
          {
            showModal &&
          <AnimatePresence 
            initial={{y:45, opacity:0}}
            animate={{y:0, opacity:1}}
            transition={{duration:0.65,delay:0.4}}
          >
          <motion.div 
            
          >
            <div className="modal-container">
              <div className="modal">
                <div className="modal-header">
                  <h2>withdrawal via {activeMethod.method}</h2>
                  <p>min: {activeMethod.min} </p>
                </div>
              <MdClose className='close-modal-btn' onClick={()=>{setShowModal(false)}}/>
                <div className="modal-input-container">
                  <div className="modal-input">
                    <input type="tel" placeholder='0.00' onChange={(e)=>{
                      setWithdrawAmount(parseInt(e.target.value))
                    }}/>
                    <span>USD</span>
                  </div>
                </div>
                <div className="modal-btn-container">
                  <button class="noselect" onClick={()=>{
                    setShowModal(false)
                  }}>
                    <span class="text">close</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg"       width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>
                  </button>
                  <button className='next' onClick={()=>{
                    if(withdrawAmount >= activeMethod.min){
                      setCheckoutPage(true)
                    }
                    else if(isNaN(withdrawAmount)){
                      Toast.fire({
                        icon: 'warning',
                        title: `Amount must be a number`
                      })
                    }
                    else{
                      Toast.fire({
                        icon: 'warning',
                        title: `Amount is less than withdrawal limit`
                      })
                      setCheckoutPage(false)
                    }
                  }}>
                    <span class="label">Next</span>
                    <span class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
            </motion.div>
          </AnimatePresence >
          }
          <Userdashboardheader route={route}/>
          <div className="page-swiper-wrapper">
              <div className="page-header hi">
                  <h3>Choose an Option</h3>
                  <h2>withdrawal Methods</h2>
                  <p>Choose a withdrawal method to withdraw money.</p>
              </div>
              <div className="swiper-container">
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={30}
                    slidesPerGroup={1}
                    loop={true}
                    loopFillGroupWithBlank={true}
                    navigation={true}
                    modules={[ Navigation]}
                    className="mySwiper"
                  >
                    {
                      withdrawMethods.map((withdrawmethod) => (
                      <SwiperSlide key={withdrawmethod.id} className='my-slide'>
                      <div className="crypto-card-img-container">
                        <img src={withdrawmethod.image} alt="" />
                        <h2>{withdrawmethod.method}</h2>
                      </div>
                      <div className="investrange-container">
                        <div className="investrange-card">
                          <p>limit:</p>
                          <p>{withdrawmethod.min} - {withdrawmethod.max} USD</p>
                        </div>
                        <div className="investrange-card">
                          <p>charge</p>
                          <p>0 USD + 0%</p>
                        </div>
                      </div>
                      <button className="deposit-btn" onClick={()=>{
                        setActiveMethod({
                          id:`${withdrawmethod.id}`,
                          min:`${withdrawmethod.min}`,
                          max:`${withdrawmethod.max}`,
                          image:`${withdrawmethod.image}`,
                          method:`${withdrawmethod.method}`
                        })
                        setShowModal(true)
                      }}>withdraw</button>
                    </SwiperSlide>
                    ))}
                  </Swiper>
              </div>
              <div className="swiper-container mobile-swiper-container">
                <Swiper
                  navigation={true}
                  spaceBetween={30}
                  modules={[Pagination, Navigation]}
                  className="mySwiper"
                >
                  {
                      withdrawMethods.map((withdrawmethod) => (
                      <SwiperSlide key={withdrawmethod.id} className='my-slide'>
                      <div className="crypto-card-img-container">
                        <img src={withdrawmethod.image} alt="" />
                        <h2>{withdrawmethod.method}</h2>
                      </div>
                      <div className="investrange-container">
                        <div className="investrange-card">
                          <p>limit:</p>
                          <p>{withdrawmethod.min} - {withdrawmethod.max} USD</p>
                        </div>
                        <div className="investrange-card">
                          <p>charge</p>
                          <p>0 USD + 0%</p>
                        </div>
                      </div>
                      <button className="deposit-btn" onClick={()=>{
                        setActiveMethod({
                          id:`${withdrawmethod.id}`,
                          min:`${withdrawmethod.min}`,
                          max:`${withdrawmethod.max}`,
                          image:`${withdrawmethod.image}`,
                          method:`${withdrawmethod.method}`,
                          wallet:`${withdrawmethod.wallet}`
                        })
                        setShowModal(true)
                      }}>withdraw</button>
                    </SwiperSlide>
                    ))}
                </Swiper>
            </div>
              <button className="history-btn" onClick={()=>{
                navigate('/withdrawlogs')
              }}>
                withdrawal history
                <FiArrowRight />
              </button>
          </div>
      </div>}
      {
        checkoutPage &&
        <WithdrawReview Active={activeMethod} withdrawAmount={withdrawAmount} closepage={close} route={route} funded={userData.funded}/>
      }
    </>
  )
}

export default Userdashboardwithdraw