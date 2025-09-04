import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import LoginContext from "../contexts/LoginContext";
import api from '../api/baseusrl'

function Callback() {
    const [searchParam] = useSearchParams();
    const navigate = useNavigate();

    const registered = searchParam.get('registered')
    const firstName = searchParam.get("first_name")
    const lastName = searchParam.get("last_name")
    const access = searchParam.get("access_token")
    const refresh = searchParam.get("referesh_token")
    const userLogin = useContext(LoginContext)

    const [error, setError] = useState(null)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

    useEffect(() => {
        if (registered=="True") {
            sessionStorage.setItem('access', access)
            sessionStorage.setItem('refresh', refresh)
            sessionStorage.setItem('userId', searchParam.get("userId"))
            sessionStorage.setItem('role', searchParam.get("role"))
            sessionStorage.setItem('gender', searchParam.get('gender'))
            sessionStorage.setItem('name', searchParam.get('name'))
            sessionStorage.setItem('email', searchParam.get('email'))
            sessionStorage.setItem('bookmarks', JSON.stringify(searchParam.get('bookmarks')))
            sessionStorage.setItem('user', 'true')
            userLogin.setRole(searchParam.get("role"))
            userLogin.setLogIn(true)
            navigate('/')
        }
    }, [registered])

    const handelPatch = async (data) => {
        const email = searchParam.get("email")
        data['role'] = data['role'].toLowerCase()
        data = { ...data, email }
        console.log(data)
        try {
            const response = await api.patch('/auth/update_details/', data)
            console.log("response:", response.data)
            sessionStorage.setItem('access', access)
            sessionStorage.setItem('refresh', refresh)
            sessionStorage.setItem('userId', response.data["userId"])
            sessionStorage.setItem('role', response.data["role"])
            sessionStorage.setItem('gender', response.data['gender'])
            sessionStorage.setItem('name', response.data['name'])
            sessionStorage.setItem('email', response.data['email'])
            sessionStorage.setItem('bookmarks', JSON.stringify(response.data['bookmarks']))
            sessionStorage.setItem('user', 'true')
            userLogin.setRole(response.data["role"])
            userLogin.setLogIn(true)
            navigate("/")
        } catch (error) {
            console.log(error.response.data)
            console.log(error.response.status)
            setError(error.response?.data || { message: "Registration failed" });
            userLogin.setLogIn(false)
        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-36">
                <div className="w-full max-w-md">
                    {/* Top heading with optional SVG */}

                    <NavLink to="/">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {/* Example inline SVG */}
                            <img
                                src="/logo.svg"
                                alt="Logo"
                                className="w-12 h-12"
                            />
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                Edumerge
                            </h1>
                        </div>
                    </NavLink>

                    {/* Second heading */}
                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                        Enter Details
                    </h1>
                </div>

                <form onSubmit={handleSubmit((data) => { handelPatch(data) })} className="w-full max-w-md mx-auto">
                    <div className="grid md:grid-cols-2 md:gap-6">

                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                value={firstName || ""}
                                type="text"
                                id="floating_first_name"
                                readOnly
                                className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 peer cursor-not-allowed"
                                placeholder=" "
                            />
                            <label
                                htmlFor="floating_first_name"
                                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
                            >
                                First name
                            </label>
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                value={lastName || ""}
                                type="text"
                                id="floating_last_name"
                                readOnly
                                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-400 dark:border-gray-600 focus:outline-none focus:ring-0 peer cursor-not-allowed"
                                placeholder=" "
                            />
                            <label
                                htmlFor="floating_last_name"
                                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
                            >
                                Last name
                            </label>
                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                {...register("qualification", {
                                    required: "Qualification is required",
                                })}
                                type="text"
                                id="floating_phone"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder="Qualification (e.g B.TECH)"
                            />
                            {errors.qualification && <p className="text-red-600 text-sm mt-1">{errors.qualification.message}</p>}
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <select
                                {...register("gender", {
                                    required: "Please Enter Gender",
                                })}
                                id="gender"
                                defaultValue=""
                                className="cursor-pointer block py-2.5 px-0 w-full text-sm text-gray-900 dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            >
                                <option value="" disabled hidden className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                                    Gender
                                </option>
                                <option className="text-black text-center dark:text-white bg-white dark:bg-gray-800">
                                    MALE
                                </option>
                                <option className="text-black text-center dark:text-white bg-white dark:bg-gray-800">
                                    FEMALE
                                </option>
                            </select>
                            <label
                                htmlFor="gender"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            ></label>
                            {errors.gender && (
                                <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="relative mb-5 z-0 w-full group">
                        <select
                            {...register("role", {
                                required: "Please Enter Role",
                            })}
                            id="role"
                            defaultValue=""
                            className="cursor-pointer block py-2.5 px-0 w-full text-sm text-gray-900 dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        >
                            <option value="" disabled hidden className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                                Role
                            </option>
                            <option className="text-black text-center dark:text-white bg-white dark:bg-gray-800">
                                STUDENT
                            </option>
                            <option className="text-black text-center dark:text-white bg-white dark:bg-gray-800">
                                INSTRUCTOR
                            </option>
                        </select>
                        <label
                            htmlFor="gender"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        ></label>
                        {errors.gender && (
                            <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
                        )}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {isSubmitting ? "Signing up..." : "Sign up"}
                    </button>
                </form>
            </div>
        </>
    )
}
export default Callback