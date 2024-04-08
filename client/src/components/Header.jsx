import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon, FaSun} from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from "../redux/theme/themeSlice"
import { logoutSuccess } from "../redux/user/userSlice"
import { useEffect, useState } from "react"

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useSelector(state => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const URL = 'https://akjblogserver.vercel.app';

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleLogout = async() => {
    try {
     const res = await fetch(`${URL}/api/v1/user/logout`, {
       method: 'POST',
       credentials: 'include',
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
const handleSubmit = (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(location.search);
  urlParams.set('searchTerm', searchTerm);
  const searchQuery = urlParams.toString();
  navigate(`/search?${searchQuery}`);
};

  return (
    <Navbar className='border-b-2'>
      <Link to='/' className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white font-mono" >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white font-serif">Abhilash's</span>Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
         type="text"
         placeholder="Search..."
         rightIcon={AiOutlineSearch}
         className="hidden lg:inline"
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Link to={'/search'}>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
         <AiOutlineSearch />
      </Button>
      </Link>
       <div className="flex items-center gap-2 md:order-2">
         <Button className="sm:w-12 sm:h-10 h-6 w-6 sm:inline" color="gray" pill  onClick={() => dispatch(toggleTheme())}>
          { theme === 'light'? <FaMoon /> : <FaSun /> }
         </Button>
      { currentUser ?
          (
            <Dropdown
             arrowIcon={false}
             inline
             label= {
               <Avatar
                img={currentUser.profilePicture}
                alt="user"
                rounded
                />
             }
            >
               <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block truncate text-sm font-medium">{currentUser.email}</span>
              </Dropdown.Header>
              <Link to='/dashboard?tab=profile'>
                 <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
          )
         : (<Link to='/login'>
         <Button color="gray" gradientMonochrome="teal" outline>
           Login
         </Button>
         </Link>)
         }
         <Navbar.Toggle/>
       </div>
         <Navbar.Collapse>
            <Navbar.Link active={path === '/'} as={'div'} >
                <Link to='/'>
                  Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/about'} as={'div'} >
                <Link to='/about'>
                  About
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/projects'} as={'div'} >
                <Link to='/projects'>
                  Projects
                </Link>
            </Navbar.Link>
         </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
