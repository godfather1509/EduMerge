import { useState, createContext,useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Register from './components/Register'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import Home from './components/Home'
import About from './components/About'
import Login from './components/Login'
import Dashboard from './components/NavbarComponents/Dashboard'
import Profile from './components/NavbarComponents/Profile'
import ProtectedRoutes from './components/ProtectedRoutes'
import LoginContext from './LoginContext'


function App() {

  const [isLogIn, setLogIn] = useState(false)

  useEffect(()=>{
    const logedIn=localStorage.getItem('user')
    if(logedIn){
      setLogIn(true)
    }
  },[])


  const router = createBrowserRouter(

    [
      {
        path: "/",
        element: <>
          <Navbar />
          <Home />
        </>

      },
      {
        path: "/registerInstructor",
        element: <>
          <Navbar />
          <Register role={"instructor"} />
        </>
      },
      {
        path: "/registerStudent",
        element: <>
          <Navbar />
          <Register role={"student"} />
        </>
      },
      {
        path: "/about",
        element: <>
          <Navbar />
          <About />
        </>
      },
      {
        path: "/login",
        element: <>
          <Navbar />
          <Login />
        </>
      },
      {
        path: "/dashboard",
        element: <>
          <Navbar />
          <ProtectedRoutes>
            {/* used to prevent access control issue
            user should not be able to access by typing url in search bar */}
            <Dashboard />
          </ProtectedRoutes>
        </>
      },
      {
        path: "/profile",
        element: <>
          <Navbar />
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        </>
      },
      {
        path: "*",
        element: <>
          <Navbar />
          <NotFound />
        </>
      }
    ]
  )

  return (
    <>
      <LoginContext.Provider value={{ isLogIn, setLogIn }}>
        <RouterProvider router={router} />
      </LoginContext.Provider>
    </>
  )
}

export default App