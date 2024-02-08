import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Singup from './pages/Singup'
import Projects from './pages/Projects'
import Header from './components/Header'
import FooterComp from './components/FooterComp'

function App() {

  return (
   <BrowserRouter>
   <Header />
     <Routes>
       <Route path='/' element={<Home />} />
       <Route path='/about' element={<About />} />
       <Route path='/login' element={<Login />} />
       <Route path='/sign-up' element={<Singup />} />
       <Route path='/dashboard' element={<Dashboard />} />
       <Route path='/projects' element={<Projects />} />
      
     </Routes>
     <FooterComp />
   </BrowserRouter>
  )
}

export default App
