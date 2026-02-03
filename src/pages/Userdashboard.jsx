import React from 'react'
import Userdashboardheader from '../components/userdashboardheader/Userdashboardheader'
import Userdashboardhomepage from '../components/userdashboardhomepage/Userdashboardhomepage'
const Userdashboard = ({route}) => {
  return (
    <main className='userdashboard-page'>
        <Userdashboardheader route={route}/>
        <Userdashboardhomepage route={route}/>
    </main>
  )
}

export default Userdashboard