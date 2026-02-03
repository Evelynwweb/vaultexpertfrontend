import React , {useState,useEffect} from 'react'
import "./userdashboardheader.css"
import { Link, useNavigate } from 'react-router-dom'
import {BiUser,BiChevronDown} from 'react-icons/bi'
import {RiLuggageDepositLine} from 'react-icons/ri'
import {AiOutlineSetting,AiOutlineStock} from 'react-icons/ai'
import {RiLockPasswordLine} from 'react-icons/ri'
import {FiLogOut} from 'react-icons/fi'
import {AiOutlineClose} from 'react-icons/ai'
import {GiReceiveMoney} from 'react-icons/gi'
import {RxDashboard} from 'react-icons/rx'
import {FaUserFriends} from 'react-icons/fa'
const Userdashboardheader = ({route}) => {
    const navigate = useNavigate()
    const [dropDown,setDropDown] = useState(false)
    const [userData, setUserData] = useState()

    const logout = ()=>{
        localStorage.removeItem('token')
        navigate('/login')
    }
    useEffect(()=>{
        if(localStorage.getItem('token')){
            const getData = async()=>{
                const req = await fetch(`${route}/api/getData`,{
                    headers: {
                    'x-access-token': localStorage.getItem('token')
                    }
                })
                const res = await req.json()
                setUserData(res)
                console.log(res)
            }
            
            getData()
        }
        else{
            navigate('/login')
        }
          
    },[])


    const [bgColor, setBgColor] = useState(false)
    const changeOnScroll = ()=>{
        if(window.scrollY >= 50){
            setBgColor(true)
        }
        else{
            setBgColor(false)
        }
    }
    window.addEventListener('scroll', changeOnScroll)
  return (
    <>
        {
            dropDown &&
            <div className="drop-down" onBlur={()=>{
                setDropDown(false)
            }}>
                <div className="dropdown-tabs" onClick={()=>{
                   setDropDown(false)
                }}>
                    <AiOutlineClose />
                    <p>close</p>
                </div>
                <div className="dropdown-header">
                    <span className="profile-pic-container">
                        {userData && userData.profilepicture !== '' ? <img src={userData.profilepicture ? userData.profilepicture : ''} alt="" /> : userData.firstname.charAt(0)} 
                    </span>
                    <span className="dropdown-user-details">
                        <p className='dropdown-name'>{userData ? userData.firstname : 'john doe'}</p>
                        <p className='dropdown-email'>{userData ? userData.email : 'johndoe#gmail.com'}</p>
                    </span>
                </div>
                
                <div className="dropdown-deposit-container">
                    <h3>total amount</h3>
                    <h2>${userData ? userData.funded : ''} USD</h2>
                    <p>referral bonus ${userData ? userData.refBonus : ''} USD</p>
                </div>
                <div className="mobile-tabs">
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/dashboard')
                }}>
                    <RxDashboard />
                    <p>dashboard</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/fundwallet')
                }}>
                    <GiReceiveMoney />
                    <p>deposit</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/plans')
                }}>
                    <AiOutlineStock />
                    <p>select plan</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/withdraw')
                }}>
                    <RiLuggageDepositLine />
                    <p>withdraw</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/referrals')
                }}>
                    <FaUserFriends />
                    <p>referral</p>
                </div>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/myprofile')
                }}>
                    <AiOutlineSetting />
                    <p>profile setting</p>
                </div>
                <div className="dropdown-tabs" onClick={()=>{
                    navigate('/myprofile')
                }}>
                    <RiLockPasswordLine />
                    <p>kyc</p>
                </div>
                
                <div className="dropdown-tabs" onClick={()=>{
                   logout()
                }}>
                    <FiLogOut />
                    <p>logout</p>
                </div>
                
            </div>
        }
        <div  className={`userdashboard-header ${bgColor && 'scroll-head'}`}>
            <div className="userdashboard-logo-container">
                  <img src="/vaultexpertlogo.png" alt="" className='logo' onClick={()=>{
                    navigate('/')
                }}/>
            </div>
            <nav className='user-header-nav'>
                <ul>
                    <li>
                        <Link to='/dashboard'>dashboard</Link>
                    </li>
                    <li>
                        <Link to='/fundwallet'>fundwallet</Link>
                    </li>
                    <li>
                        <Link to='/plans'>invest</Link>
                    </li>
                    <li>
                        <Link to='/withdraw'>withdrawals</Link>
                    </li>
                    <li>
                        <Link to='/transactions'>transactions</Link>
                    </li>
                    <li>
                        <Link to='/referrals'>referrals</Link>
                    </li>
                    <li>
                        <Link to='/myprofile'>kyc</Link>
                    </li>
                    {
                        userData && userData.promo ? 
                        <li>
                             <Link to='/viplan'>vip plan</Link>
                        </li>
                        : ''
                    }
                </ul>
            </nav>
            <div className="header-profile-container" onClick={()=>{
                setDropDown(true)
            }}>
                <span className="user-icon-wrapper">
                    <BiUser />
                </span>
                <p>{userData ? userData.firstname : ''}</p>
                <span className="arrow-container">
                    <BiChevronDown />
                </span>
            </div>
        </div>
    </>
  )
}

export default Userdashboardheader