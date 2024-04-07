import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react";
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiUser, HiUserGroup } from 'react-icons/hi'
import { Link, useLocation } from "react-router-dom";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const URL = 'https://akjblogserver.vercel.app';

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      setTab(tabFromUrl);
    }, [location.search])
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const handleLogout = async() => {
      try {
       const res = await fetch(`${URL}/api/v1/user/logout`, {
         method: 'POST',
         credentials: 'include'
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
      <Sidebar.ItemGroup className='flex flex-col gap-1'>
      {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
        <Link to='/dashboard?tab=profile'>
         <Sidebar.Item active ={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
            Profile
         </Sidebar.Item>
         </Link>
         {currentUser.isAdmin && (
         <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
         {currentUser.isAdmin && (
              <>
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item
                  active={tab === 'users'}
                  icon={HiUserGroup}
                  as='div'
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item
                  active={tab === 'comments'}
                  icon={HiAnnotation}
                  as='div'
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
         <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleLogout} >
            Logout
         </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
  )
}

export default DashSidebar
