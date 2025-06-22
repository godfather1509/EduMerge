import { useForm } from "react-hook-form"
import { useState, useContext } from 'react'
import api from '../api/baseusrl'
import { useNavigate } from 'react-router-dom'
import LoginContext from "../contexts/LoginContext"


const Register = ({ role }) => {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const password = watch("password")

  const userLogin = useContext(LoginContext)

  const handelPost = async (newRegister) => {
    try {
      const response = await api.post('/auth/register/', newRegister)
      navigate("/login")
    } catch (error) {
      console.log(error.response.data)
      console.log(error.response.status)
      setError(error.response?.data || { message: "Registration failed" });
    }
  }

  return (
    <>
      <div className="mt-35 flex-col flex-grow flex items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          {role.charAt(0).toUpperCase() + role.slice(1)} Sign up
        </h1>
        <form onSubmit={handleSubmit((data) => { handelPost({ ...data, role }) })} className="max-w-md mx-auto">
          <div className="grid md:grid-cols-2 md:gap-6">

            <div className="relative z-0 w-full mb-5 group">
              <input {...register("first_name", {
                required: "First Name is required"
              })} type="text" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
              <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
              {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input {...register("last_name", {
                required: "Last Name is required"
              })} type="text" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
              <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
              {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input {...register("email", {
              required: "Email is required"
            })} type="email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            {error?.email && <p className="text-red-600 text-sm mt-1">{error.email[0]}</p>}
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input {...register("password", {
                required: "Password is required"
              })} type="password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />
              <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input {
                ...register("confirmPassword",
                  {
                    required: "Please Confirm Your Password",
                    validate: (value) => value === password || "Passwords do not match"
                  }
                )} type="password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />
              <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
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
                className="block py-2.5 px-0 w-full text-sm text-gray-900 dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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

          <button type="submit" disabled={isSubmitting} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </>
  )
}

export default Register