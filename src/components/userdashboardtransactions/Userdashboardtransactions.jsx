import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import Userdashboardheader from '../userdashboardheader/Userdashboardheader'
import {AiOutlineArrowLeft} from 'react-icons/ai'
const Userdashboardtransactions = ({route}) => {

  const navigate = useNavigate()
  const [userData, setUserData] = useState()
  const [loader,setLoader] = useState(false)

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


  return (
    <div>
      
    <Userdashboardheader route={route}/>
    {
        loader && 
          <div className="wifi-loader-container">
            <div class="loader">
              <span class="l">L</span>
              <span class="o">o</span>
              <span class="a">a</span>
              <span class="d">d</span>
              <span class="i">i</span>
              <span class="n">n</span>
              <span class="g">g</span>
              <span class="d1">.</span>
              <span class="d2">.</span>
            </div>
        </div>
      }
      {userData && userData.transaction.length !== 0 ? 
      <div className="page-swiper-wrapper">
        <div className="floating-btn" onClick={()=>{
        navigate('/fundwallet')
      }}>
          <AiOutlineArrowLeft />
        </div>
      <div className="page-header">
          <h3>checkout your transaction logs</h3>
          <h2>Transaction logs</h2>
          <p>we keep track of all your transactions</p>
      </div>
      <div className="transaction-container no-ref">
        <table>
            <thead>
              <tr>
                <td>transaction Id</td>
                <td>type</td>
                <td>amount</td>
                <td>date</td>
                <td>balance</td>
              </tr>
            </thead>
            <tbody>
              {
                userData.transaction.map(refer =>
                  <tr>
                    <td>{refer.id}</td>
                    <td>{refer.type}</td>
                    <td>$ {refer.amount} USD</td>
                    <td>{refer.date}</td>
                    <td>$ {refer.balance} USD</td>
                  </tr>
                )
              }
            </tbody>
          </table>
          </div>
        </div>
      :
      <div className="page-swiper-wrapper">
      <div className="failure-page no-referral-page">
        <img src="/Data_PortabilityPrivacy_BANNER_003.gif" alt="" className='failure-img'/>
        <p>you have not performed any transaction yet</p> 
        <Link to='/fundwallet'>deposit</Link>
      </div>
      </div>
      }
     
</div>
  )
}

export default Userdashboardtransactions