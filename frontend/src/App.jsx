import { useState, useContext } from 'react'
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
import Bookmark from './components/NavbarComponents/Bookmark'
import MyCourses from './components/NavbarComponents/MyCourses'
import NewCourse from './components/NavbarComponents/NewCourse'
import Downloads from './components/NavbarComponents/Downloads'
import CoursePage from './components/CoursePage'
import LoginContext from './contexts/LoginContext'
import Callback from './components/Callback'

function App() {

  const userLogin = useContext(LoginContext)

  const [isLogIn, setLogIn] = useState(() => {
    const logedIn = sessionStorage.getItem('user')
    return logedIn === 'true';
  })

  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('role')
  })
  const [access, setAccess] = useState("")

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
        path: "/bookmark",
        element: <>
          <Navbar />
          <ProtectedRoutes>
            {/* used to prevent access control issue
            user should not be able to access by typing url in search bar */}
            <Bookmark />
          </ProtectedRoutes>
        </>
      },
      {
        path: "/myCourse",
        element: <>
          <Navbar />
          <ProtectedRoutes>
            <MyCourses />
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
        path: "/course/:id/:moduleId?",
        // ? makes that particular parameter optional
        element: <>
          <Navbar />
          <ProtectedRoutes>
            <CoursePage />
          </ProtectedRoutes>
        </>
      },
      {
        path:"/callback",
        element:<>
          <Callback/>
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
      <LoginContext.Provider value={{ isLogIn, setLogIn, role, setRole, access, setAccess }}>
        <RouterProvider router={router} />
      </LoginContext.Provider>
    </>
  )
}

export default App