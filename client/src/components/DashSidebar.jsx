import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { Link, useLocation } from "react-router-dom";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      setTab(tabFromUrl);
    }, [location.search])
    const dispatch = useDispatch();

    const handleLogout = async() => {
      try {
       const res = await fetch(`/api/v1/user/logout`, {
         method: 'POST',
       })
       const data = await res.json();
  
       if(!res.ok) {
         console.log(data.message);
       } else{
         dispatch(logoutSuccess())
       }
      } catch (error) {
        console.log(error.message);
      }
  }
  return (
    <Sidebar className="w-full md:w-56">
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <Link to='/dashboard?tab=profile'>
         <Sidebar.Item active ={tab === 'profile'} icon={HiUser} label='User' labelColor='dark' as='div'>
            Profile
         </Sidebar.Item>
         </Link>
         <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleLogout} >
            Logout
         </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
  )
}

export default DashSidebar
