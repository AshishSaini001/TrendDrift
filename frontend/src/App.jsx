import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<UserLayout/>}>
        <Route index element={<Home />} />
      </Route>
     </Routes>
     </BrowserRouter>
  )
}

export default App
