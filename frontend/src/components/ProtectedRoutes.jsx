import { Navigate, Outlet } from "react-router-dom"
import LoginContext from "../contexts/LoginContext"
import { useContext } from "react"

const ProtectedRoutes = ({children}) => {
    // here children is a component

    const userLogin = useContext(LoginContext)
    return (
        userLogin.isLogIn ? children : <Navigate to="/login" />
        // if isLogin is true return children else redirect to login page
    )
}

export default ProtectedRoutes;