import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Singup from './pages/Singup'
import Projects from './pages/Projects'
import Header from './components/Header'
import FooterComp from './components/FooterComp'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'

function App() {

  return (
   <BrowserRouter>
   <Header />
     <Routes>
       <Route path='/' element={<Home />} />
       <Route path='/about' element={<About />} />
       <Route path='/login' element={<Login />} />
       <Route path='/sign-up' element={<Singup />} />
       <Route element={<PrivateRoute />}>
         <Route path='/dashboard' element={<Dashboard />} />
       </Route>
       <Route element={<OnlyAdminPrivateRoute />}>
         <Route path='/create-post' element={<CreatePost />} />
         <Route path='/update-post/:postId' element={<UpdatePost />} />
       </Route>
       <Route path='/projects' element={<Projects />} />
      
     </Routes>
     <FooterComp />
   </BrowserRouter>
  )
}

export default App
