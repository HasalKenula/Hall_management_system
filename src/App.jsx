import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './page/Home'
import Login from './page/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HallManagement from './page/HallManagement'
import BookingManagement from './page/BookingManagement'
// import Task from './page/Home'

function App() {
  const [count, setCount] = useState(0)

  return (

    
       <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
             <Route path="/" element={<Home />} />
             <Route path="/hall" element={<HallManagement />} />
               <Route path="/booking" element={<BookingManagement />} />
            {/* <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/create" element={<CreateOrder />} />   */}
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    

  )
}

export default App
