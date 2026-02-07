import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import ProductDetails from './components/Products/ProductDetails.jsx'

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
        <Route path="profile" element={<Profile />} />
        <Route path="collections/:collection" element={<CollectionPage />} />
        <Route path="product/:id" element={<ProductDetails />} />
      </Route>
     </Routes>
     </BrowserRouter>
  )
}

export default App
