import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({children, activeMenu}) => {
    const {user} = useContext(UserContext);
   
   return (
   <div className='min-h-screen w-full bg-gray-50'>
       <Navbar activeMenu={activeMenu}/>
       {user && (
         <div className='flex min-h-screen'>
             <div className='max-[1080px]:hidden'>
                 <SideMenu activeMenu={activeMenu}/>
             </div>
             <div className='flex-1 w-full'>
                {children}
             </div>
         </div>
       )}
   </div>
  )
}

export default DashboardLayout