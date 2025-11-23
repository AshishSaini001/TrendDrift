import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
     <BrowserRouter>
     <Toaster position="top-right"  />
     <Routes>
      <Route path="/" element={<UserLayout/>}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Route>
     </Routes>
     </BrowserRouter>
  )
}

export default App
