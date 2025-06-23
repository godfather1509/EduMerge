import { useForm } from "react-hook-form"
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrashAlt } from 'react-icons/fa';
// AWS configuration
import AWS from 'aws-sdk'
import S3 from 'aws-sdk/clients/s3'
// to use these set "define: {global: 'window'}" in "vite.config.js"
import LoginContext from "../../contexts/LoginContext";
import api from "../../api/baseusrl";

const NewCourse = () => {

    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [modules, setModules] = useState([]);
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm()
    const userLogin = useContext(LoginContext)
    const [instructors, setInstructors] = useState([]);
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState("")


    const noOfModules = watch("no_of_modules");

    const uploadVideo = async (moduleFiles) => {

        setUploading(true)
        let moduleKeys = [] // maintaining array of aws file keys to store in database

        // AWS Configuration
        const S3_Bucket = import.meta.env.VITE_S3_BUCKET
        // name of S3 bucket
        const REGION = import.meta.env.VITE_REGION
        // S3 bucket region(server region where data is stored)
        AWS.config.update({
            accessKeyId: import.meta.env.VITE_ACCESS_KEY,
            secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY
        })
        const s3 = new S3({
            params: { Bucket: S3_Bucket },
            region: REGION
        });

        for (const item of moduleFiles) {
            const params = {
                Bucket: S3_Bucket,
                // S3 bucket being used
                Key: item.moduleName + "-" + item.courseName + "-" + item.instructor,
                // individual aws key of every file
                Body: item.file
            }
            try {
                const upload = await s3.putObject(params) // this uploads file to aws server
                                        .on("httpUploadProgress",
                                        (evt) => {
                                            setProgress(parseInt((evt.loaded * 100 / evt.total)) + "%")
                                        }).promise() // used to track the progress of file upload
                moduleKeys.push(params.Key);
            } catch (error) {
                console.error(error)
                setUploading(false)
                alert(`Error uploading Module ${item.moduleName}:` + error.message)
            }
        }
        setUploading(false)
        return moduleKeys
    }

    const prepareModule = (data) => {
        let moduleFiles = []
        const totalModules = parseInt(data.no_of_modules)
        for (let i = 0; i < totalModules; i++) {
            const courseName = data.course_name
            const instructor = data.instructor
            const fileField = data[`course_file_${i}`]
            const file = fileField[0]
            const moduleName = data[`module_name_${i}`]
            const order = data[`order_${i}`]
            moduleFiles.push({
                courseName, instructor, moduleName, order, file
            })
        }
        return moduleFiles;
    }

    const prepareData = (moduleKeys, data) => {
        const total = parseInt(data.no_of_modules);

        // modules array to store data of each module
        const modules = [];

        for (let i = 0; i < total; i++) {
            const module_name = data[`module_name_${i}`];
            const order = data[`order_${i}`];
            const video_url = moduleKeys[i];
            modules.push({
                module_name,
                order,
                video_url,
            });
        }

        // Build the full course object
        const newCourse = {
            course_name: data.course_name,
            date: data.date,
            description: data.description,
            instructor: data.instructor,
            no_of_modules: total,
            modules, // reference the modules array
        };

        return newCourse;
    };


    const handelFormData = async (data) => {

        const moduleFiles = prepareModule(data);
        const moduleKeys = await uploadVideo(moduleFiles);
        const newCourse = prepareData(moduleKeys, data)
        handelPost(newCourse)
    };

    const handelPost = async (newCourse) => {
        try {
            const response = await api.post('/upload/create_course/', newCourse, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access')}`
                }
            }
            );
            navigate("/myCourse")
        } catch (error) {
            console.log(error.response.data)
            console.log(error.response.status)
            setError(error.response?.data || { message: "Upload failed" });
        }
    }

    const handleDeleteModule = (index) => {
        const updated = [...modules];
        updated.splice(index, 1);
        setModules(updated);
        setValue("no_of_modules", updated.length); // update the form field too
    };

    useEffect(() => {
        const totalModules = parseInt(noOfModules);
        // If the input is a valid number and greater than 0
        if (totalModules > 0) {
            const newModules = [];
            for (let i = 0; i < totalModules; i++) {
                // Keep existing module data if it exists, otherwise add a new empty one
                newModules.push(modules[i] || { name: "", file: null, order: i + 1 });
            }
            setModules(newModules);
        } else {
            // Reset modules if input is invalid or zero
            setModules([]);
        }
    }, [noOfModules]);

    useEffect(() => {
        console.log("Access token:", sessionStorage.getItem('access'))
        const fetchInstructors = async () => {
            try {
                const res = await api.get("/instructors", {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('access')}`
                    }
                });
                const data = res.data;
                setInstructors(data);
            } catch (error) {
                console.error("Failed to load instructors:", error);
            }
        };
        fetchInstructors();
    }, []);


    return (
        <>
            <div className="mt-5 flex-col flex-grow flex items-center justify-center px-4 mb-8">
                <h1 className="text-3xl font-bold text-center mb-6">Upload Course</h1>
                <form onSubmit={handleSubmit((data) => { handelFormData({ ...data }) })} className="w-full max-w-2xl mx-auto">

                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            {...register("course_name", { required: "Course Name is required" })}
                            type="text"
                            id="course_name"
                            placeholder=" "
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        />
                        <label htmlFor="course_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Course Name</label>
                        {errors.course_name && <p className="text-red-600 text-sm mt-1">{errors.course_name.message}</p>}
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            {...register("date", { required: "Date is required" })}
                            type="date"
                            id="date"
                            placeholder=" "
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        />
                        <label htmlFor="date" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Date</label>
                        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            id="description"
                            placeholder=" "
                            rows={4}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 resize-none appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        />
                        <label
                            htmlFor="description"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Description
                        </label>
                        {errors.description && (
                            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 md:gap-6">
                        {/* Instructor Field */}
                        <div className="relative z-0 w-full mb-5 group">
                            <select
                                {...register("instructor", {
                                    required: "Please select an instructor",
                                })}
                                id="instructor"
                                defaultValue=""
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            >
                                <option value="" disabled hidden className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                                    Instructor
                                </option>
                                {instructors.map((ins) => (
                                    <option
                                        key={ins.id}
                                        value={ins.id}
                                        className="text-black dark:text-white bg-white dark:bg-gray-800"
                                    >
                                        {ins.name} - {ins.email}
                                    </option>
                                ))}
                            </select>
                            <label
                                htmlFor="instructor"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            ></label>
                            {errors.instructor && (
                                <p className="text-red-600 text-sm mt-1">{errors.instructor.message}</p>
                            )}
                        </div>

                        {/* No of Modules Field */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                {...register("no_of_modules", {
                                    required: "Please add No of Modules",
                                    validate: value =>
                                        !isNaN(value) && Number(value) > 0 || "Must be a number > 0",
                                })}
                                type="number"
                                id="no_of_modules"
                                placeholder=" "
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            />
                            <label
                                htmlFor="no_of_modules"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                No of Modules
                            </label>
                            {errors.no_of_modules && (
                                <p className="text-red-600 text-sm mt-1">{errors.no_of_modules.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Dynamic File Inputs */}
                    {modules.map((_, index) => (
                        <div key={index} className="flex flex-wrap md:flex-nowrap items-end gap-4 w-full mb-4">
                            {/* Module Name */}
                            <div className="flex-1">
                                <label htmlFor={`module_name_${index}`} className="block mb-1 text-sm bg-transparent font-medium text-gray-900"></label>
                                <input
                                    {...register(`module_name_${index}`, {
                                        required: 'Module Name is required',
                                    })}
                                    type="text"
                                    id={`module_name_${index}`}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" Module Name"
                                />
                                {errors[`module_name_${index}`] && (
                                    <p className="text-red-600 text-sm mt-1">{errors[`module_name_${index}`].message}</p>
                                )}
                            </div>

                            {/* File Upload */}
                            <div className="flex-1">
                                <label htmlFor={`course_file_${index}`} className="block mb-1 text-sm font-medium text-gray-900"></label>
                                <input
                                    {...register(`course_file_${index}`, {
                                        required: `File for module ${index + 1} is required`,
                                    })}
                                    type="file"
                                    id={`course_file_${index}`}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                />
                                {errors[`course_file_${index}`] && (
                                    <p className="text-red-600 text-sm mt-1">{errors[`course_file_${index}`].message}</p>
                                )}
                            </div>

                            {/* Order */}
                            <div className="w-28">
                                <label htmlFor={`order_${index}`} className="block mb-1 text-sm font-medium text-gray-900"></label>
                                <input
                                    {...register(`order_${index}`, {
                                        required: 'Order is required',
                                    })}
                                    type="number"
                                    id={`order_${index}`}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder="Order"
                                />
                                {errors[`order_${index}`] && (
                                    <p className="text-red-600 text-sm mt-1">{errors[`order_${index}`].message}</p>
                                )}
                            </div>

                            {/* Delete Button */}
                            <div className="mt-6">
                                <FaTrashAlt
                                    type="button"
                                    onClick={() => handleDeleteModule(index)}
                                    title="Delete Module"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={uploading}
                        className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </form>
                {uploading && (
                    <><p className="text-red-600 text-sm mt-1">Uploading Progress: {progress}</p></>)}
            </div>
        </>
    )
}

export default NewCourse;