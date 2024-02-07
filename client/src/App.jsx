import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Singup from './pages/Singup'
import Projects from './pages/Projects'

function App() {

  return (
   <BrowserRouter>
     <Routes>
       <Route path='/' element={<Home />} />
       <Route path='/about' element={<About />} />
       <Route path='/login' element={<Login />} />
       <Route path='/sing-up' element={<Singup />} />
       <Route path='/dashboard' element={<Dashboard />} />
       <Route path='/projects' element={<Projects />} />
      
     </Routes>
   </BrowserRouter>
  )
}

export default App
