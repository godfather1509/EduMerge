import { useState, useEffect } from 'react';
import api from "../api/baseusrl";
import { RefreshCcw } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [webCourses, setWebCourses] = useState([])
    const navigate = useNavigate()
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get("/upload/all_courses/");
                const response = await api.get(`/scrape_courses/courses/`)
                // console.log(response.data)
                setWebCourses(response.data)
                setCourses(res.data);
            } catch (error) {
                console.error("Failed to load courses:", error);
            }
        };
        fetchCourses();
    }, []);

    const refreshCourses = async () => {
        // console.log("Refresh")
        setIsRefreshing(true)
        const shuffled = [...webCourses];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setWebCourses(shuffled);
        try {
            const response = await api.post('/scrape_courses/new_courses/', shuffled)
            // console.log(response.data)
            setIsRefreshing(false)
        }
        catch (error) {
            setIsRefreshing(false)
            console.error("Failed to load courses:", error);
        }
    }

    return (
        <div className="p-4 space-y-8">
            {/* Courses Section */}
            <h2 className="text-2xl">EduMerge Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {courses.length === 0 ? (
                    <p className="text-gray-500">No courses available.</p>
                ) : (
                    courses.map((course, index) => (
                        <button
                            key={index}
                            className="text-left cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:shadow-md p-4 transition duration-200"
                            onClick={() => {
                                navigate(`/course/${course.id}`);
                            }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {course.course_name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Date: {course.date}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Instructor:{" "}
                                {course.instructor.first_name +
                                    " " +
                                    course.instructor.last_name +
                                    " (" +
                                    course.instructor.qualification +
                                    ")" +
                                    " (" +
                                    course.instructor.email +
                                    ")"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Modules: {course.no_of_modules}
                            </p>
                        </button>
                    ))
                )}
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-300 dark:border-gray-700" />

            {/* WebCourses Section */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl">MIT OCW Courses</h2>
                <button
                    onClick={
                        () => {
                            if (sessionStorage.getItem('user')) {
                                refreshCourses()
                            }
                            else {
                                navigate('/login')
                            }
                        }} // replace with your actual refresh function
                    className="flex items-center gap-2 px-3 py-1 text-sm cursor-pointer font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    <RefreshCcw size={16} className={isRefreshing ? "animate-spin-once" : ""} />
                    Refresh
                    <style>
                        {`
          @keyframes spin-once {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-spin-once {
            animation: spin-once 1.0s linear;
          }
        `}
                    </style>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {webCourses.length === 0 ? (
                    <p className="text-gray-500">No web courses available.</p>
                ) : (
                    webCourses.slice(0,12).map((course, index) => (
                        <button
                            key={index}
                            className="text-left cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:shadow-md p-4 transition duration-200"
                            onClick={() => {
                                if (sessionStorage.getItem('user')) {
                                    window.open(course.link, "_blank", "noopener,noreferrer");
                                } else {
                                    navigate("/login");
                                }
                            }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Instructor:{" "}{course.instructor}
                            </p>
                        </button>
                    ))
                )}
            </div>
        </div>

    );
};

export default Home;