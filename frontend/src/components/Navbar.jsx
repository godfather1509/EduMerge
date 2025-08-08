import { useState, useContext } from "react";
import LoginContext from "../contexts/LoginContext";
import { data, Link, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const isLoggedIn = useContext(LoginContext)
    const [error, setError] = useState(null)

    const LogOut = async () => {
        isLoggedIn.setLogIn(false)
        const access_token=sessionStorage.getItem('access')
        try{
            const response=await api.get("auth/logout/",{
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            })
        }
        catch(error){
            console.log(error)
        }
        sessionStorage.clear()
        navigate("/login")
    }

    const handlePost = async (search) => {
        console.log(search)
        // try {
        //     const response = await api.post('', search)
        // } catch (error) {
        //     console.log(error.response.data)
        //     console.log(error.response.status)
        //     setError(error.response?.data || { message: "Search failed" });
        //     userLogin.setLogIn(false)
        // }
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4">
                {/* Logo (Left-aligned) */}
                <NavLink to="/" className="flex items-center rtl:space-x-reverse">
                    <img src="../public/logo.png" className="h-12" alt="EduMerge Logo" />
                    <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">EduMerge</span>
                </NavLink>

                {/* Search Bar (centered relative to container) */}
                <form className="flex items-center w-[550px] mx-auto"
                    onSubmit={
                        handleSubmit((data) => {
                            handlePost(data)
                        })}>
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                            </svg>
                        </div>
                        <input
                            {...register("search", { required: "Enter search" })}
                            type="text"
                            id="simple-search"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search Courses" required />
                    </div>
                    <button type="submit" className="cursor-pointer p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                    {errors.search && (
                        <p className="text-red-600 text-sm mt-1">{errors.search.message}</p>
                    )}
                    {error?.message && (
                        <p className="text-red-600 text-sm mt-1">{error.message}</p>
                    )}
                </form>

                {/* Desktop Nav */}
                <div className="hidden w-full md:block md:w-auto">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <NavLink to="/" className={({ isActive }) =>
                                `block py-2 px-3 rounded-sm md:p-0 transition-colors duration-200 ${isActive
                                    ? 'text-white bg-blue-700 md:text-blue-700 md:bg-transparent dark:text-blue-500'
                                    : 'text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500'}`
                            }>
                                Home
                            </NavLink>
                        </li>

                        {isLoggedIn.isLogIn ? (
                            <li className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="cursor-pointer flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 md:hover:text-blue-700 rounded-sm md:p-0 dark:text-white md:dark:hover:text-blue-500"
                                >
                                    User
                                    <svg className="w-2.5 h-2.5 ms-2.5" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>

                                {showDropdown && (
                                    // conditional render here it says show this drop down only when showDropdown is true
                                    <div className="absolute right-0 mt-2 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {isLoggedIn.role === "instructor" ? (
                                                <>
                                                    <li>
                                                        <NavLink to="/myCourse" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            My Courses
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to="/newCourse" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            New Course
                                                        </NavLink>
                                                    </li>
                                                </>
                                            ) : (
                                                <>
                                                    <li>
                                                        <NavLink to="/bookmark" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            Bookmarks
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to="/downloads" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            My Downloads
                                                        </NavLink>
                                                    </li>
                                                </>
                                            )}
                                        </ul>

                                        <div className="py-1">
                                            <button
                                                onClick={LogOut}
                                                className="cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/login" className={({ isActive }) =>
                                        `block py-2 px-3 rounded-sm md:p-0 transition-colors duration-200 ${isActive
                                            ? 'text-white bg-blue-700 md:text-blue-700 md:bg-transparent dark:text-blue-500'
                                            : 'text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500'}`
                                    }>
                                        Log in
                                    </NavLink>
                                </li>
                            </>
                        )}
                        <li>
                            <NavLink to="/about" className={({ isActive }) =>
                                `block py-2 px-3 rounded-sm md:p-0 transition-colors duration-200 ${isActive
                                    ? 'text-white bg-blue-700 md:text-blue-700 md:bg-transparent dark:text-blue-500'
                                    : 'text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500'}`
                            }>
                                About
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
