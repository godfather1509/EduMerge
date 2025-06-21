import { useState, useEffect } from 'react';
import api from "../../api/baseusrl";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);

    const getCourse = async (data) => {
        console.log(data)
    }

    useEffect(() => {
        const fetchCourses = async () => {
            const instructor = sessionStorage.getItem('instructor')
            try {
                const res = await api.get("/upload/courses/", {
                    params: {
                        course_instructor: instructor
                    },
                    // to send requierd data to backend in GET request
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('access')}`
                    }
                });
                const data = res.data;
                // console.log(data)
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
                        onClick={() => { getCourse(course) }}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course['course_name']}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Date: {course['date']}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Instructor: {course.instructor['first_name'] + " " + course.instructor['last_name'] + " " + "(" + course.instructor['qualification'] + ")"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            email: {course.instructor['email']}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Modules: {course.no_of_modules}
                        </p>
                    </button>
                ))
            )}
        </div>
    );
};

export default MyCourses;
