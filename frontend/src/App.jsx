import { useState, createContext } from 'react'
import './App.css'
import Register from './components/Register'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import Home from './components/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import About from './components/About'
import Login from './components/Login'


const LoginContext = createContext()

function App() {

  const [isLogIn, setLogIn] = useState(false)
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
export { LoginContext }