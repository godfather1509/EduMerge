import { useState, useEffect } from 'react';
import api from "../api/baseusrl";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get("/upload/all_courses/");
                const data = res.data;
                console.log(data)
                setCourses(data);
            } catch (error) {
                console.error("Failed to load courses:", error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {courses.length === 0 ? (
                <p className="text-gray-500">No courses available.</p>
            ) : (
                courses.map((course, index) => (
                    <button
                        key={index}
                        className="text-left cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:shadow-md p-4 transition duration-200"
                        onClick={() => { navigate(`/course/${course.id}`) }}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course['course_name']}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Date: {course['date']}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Instructor: {course.instructor['first_name'] + " " + course.instructor['last_name'] + " " + "(" + course.instructor['qualification'] + ")"+" "+"("+course.instructor['email']+")"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Modules: {course.no_of_modules}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enrolled: {course['total_enrolled']}
                        </p>
                    </button>
                ))
            )}
        </div>
    );
};

export default Home;