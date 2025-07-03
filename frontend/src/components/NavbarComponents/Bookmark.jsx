import { useState, useEffect } from 'react';
import api from "../../api/baseusrl";
import { useNavigate } from 'react-router-dom';

const Bookmark = () => {
    const [bookmarks, setBookmark] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchCourses = async () => {
            const userEmail = sessionStorage.getItem('email')
            try {
                const res = await api.get("/auth/bookmark/", {
                    params: {
                        email: userEmail
                    }
                });
                const data = res.data;
                console.log(data.bookmarks);
                setBookmark(data.bookmarks);
            } catch (error) {
                console.error("Failed to load courses:", error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-6">My Bookmarks</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {bookmarks.length === 0 ? (
                    <p className="text-gray-500">No Bookmarks</p>
                ) : (
                    bookmarks.map((bookmark, index) => (
                        <button
                            key={index}
                            className="text-left cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:shadow-md p-4 transition duration-200"
                            onClick={() => { navigate(`${bookmark['bookmark_url']}`) }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bookmark['course_name']}</h3>
                            {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                                Date: {bookmark['bookmark_url']}
                            </p> */}
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Instructor: {bookmark['instructor_name'] + " " + "(" + bookmark['instructor_qualification'] + ")" + " " + "(" + bookmark['instructor_email'] + ")"}
                            </p>
                            {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                                Modules: {bookmark['bookmark_url']}
                            </p> */}
                        </button>
                    ))
                )}
            </div>
        </>
    );
};

export default Bookmark;