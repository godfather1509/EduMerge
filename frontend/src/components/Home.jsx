import { useState, useEffect } from 'react';
import api from "../api/baseusrl";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [webCourses, setWebCourses] = useState([])
    const navigate = useNavigate()
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

    return (
        <div className="p-4 space-y-8">
            {/* Courses Section */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {webCourses.length === 0 ? (
                    <p className="text-gray-500">No web courses available.</p>
                ) : (
                    webCourses.map((course, index) => (
                        <button
                            key={index}
                            className="text-left cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:shadow-md p-4 transition duration-200"
                            onClick={() => {
                                window.open(course.link, "_blank", "noopener,noreferrer");
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