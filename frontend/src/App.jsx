import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Register from './components/Register'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import Home from './components/Home'
import About from './components/About'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import ProtectedRoutes from './components/ProtectedRoutes'
import Dashboard from './components/NavbarComponents/Dashboard'
import Profile from './components/NavbarComponents/Profile'
import NewCourse from './components/NavbarComponents/NewCourse'
import Downloads from './components/NavbarComponents/Downloads'
import LoginContext from './contexts/LoginContext'


function App() {

  const [isLogIn, setLogIn] = useState(() => {
    const logedIn = sessionStorage.getItem('user')
    return logedIn === 'true';
  })

  const [role, setRole] = useState("")

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
        path: "/forgotPassword",
        element: <>
          <ForgotPassword />
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
        path: "/newCourse",
        element: <>
          <Navbar />
          <ProtectedRoutes>
            <NewCourse />
          </ProtectedRoutes>
        </>
      },
      {
        path: "/downloads",
        element: <>
          <Navbar />
          <ProtectedRoutes>
            <Downloads />
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
      <LoginContext.Provider value={{ isLogIn, setLogIn, role, setRole }}>
        <RouterProvider router={router} />
      </LoginContext.Provider>
    </>
  )
}

export default App