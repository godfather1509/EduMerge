/*
This page has logic of bookmarking and unbookmarking a course, playing course videos from AWS cloudfront and navigating to other course modules
*/

import api from '../api/baseusrl'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const CoursePage = () => {
    let { id, moduleId } = useParams();
    const [course, setCourse] = useState(null);
    const [bookmark, setBookmark] = useState(false)
    const [bookmarkData, setBookmarkData] = useState([])

    moduleId = moduleId || 0;
    const navigate = useNavigate()


    const courseBookmark = async () => {
        const bookmarkName = course[0].course_name + "-" + course[0].instructor.first_name + " " + course[0].instructor.last_name
        // if course is not bookmarked
        if (bookmark === false) {
            // bookmark the course
            const newBookmark = {
                email: sessionStorage.getItem('email'),
                bookmark: [{
                    course_name_bookmark: bookmarkName,
                    bookmark_url: `/course/${id}`,
                    course_name: course[0].course_name,
                    instructor_name: course[0].instructor.first_name + " " + course[0].instructor.last_name,
                    instructor_email: course[0].instructor.email,
                    instructor_qualification: course[0].instructor.qualification
                }]
            }
            try {
                const response = await api.patch(`/auth/bookmark/`, newBookmark);
                // console.log(response.data);
                setBookmark(true)
                setBookmarkData(prev => [...prev, { course_name_bookmark: bookmarkName }]);
            } catch (error) {
                console.log(error.response?.data);
                console.log(error.response?.status);
                setBookmark(false)
            }
        }
        // if course is bookmarked already
        else {
            // un bookmark the course
            try {
                const response = await api.delete(`/auth/bookmark/`, { data: { bookmarkName } })
                // console.log("Course Removed", response)
                setBookmark(false)
                setBookmarkData(prev =>
                    prev.filter(b => b.course_name_bookmark !== bookmarkName)
                );
            } catch (error) {
                console.log(error.response?.data);
                console.log(error.response?.status);
            }
        }
    }

    useEffect(
        // get and set all bookmarks
        () => {
            const bookmarks = JSON.parse(sessionStorage.getItem('bookmarks')) // name of course bookmarked in database
            setBookmarkData(bookmarks)
        }, []
    )

    useEffect(() => {

        if (!course) return;

        const bookmarkName = `${course[0].course_name}-${course[0].instructor.first_name} ${course[0].instructor.last_name}`;

        let isBookmarked = undefined;
        for (let i = 0; i < bookmarkData.length; i++) {
            if (bookmarkData[i].course_name_bookmark === bookmarkName) {
                // match to see if bookmark present in backend matches bookmark name here
                isBookmarked = bookmarkData[i];
                break; // Stop the loop once we find a match
            }
        }

        if (isBookmarked === undefined) {
            setBookmark(false)
        }
        else {
            setBookmark(true)
        }
    }, [course, bookmarkData]); // will only run if bookmarkData and course are present

    useEffect(() => {
        // get the course info from database
        const getCourse = async () => {
            try {
                const response = await api.get("/upload/course/", {
                    params: {
                        course: id
                    },
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('access')}`
                    }
                });

                setCourse(response.data); // Store course data
                // console.log("Fetched course:", response.data);
            } catch (error) {
                console.log(error.response?.data);
                console.log(error.response?.status);
            }
        };
        if (id) getCourse(); // Only fetch if id exists
    }, [id]);

    useEffect(
        () => {
            sessionStorage.setItem('bookmarks', JSON.stringify(bookmarkData))
        }, [bookmarkData]
    )

    const handleClick = (index) => {
        navigate(`/course/${id}/${index}`)
    }

    return (
        <>
            {course ? (
                <>
                    <div className="max-w-screen-xl mx-auto px-6 mt-6">
                        <div className="flex flex-col lg:flex-row gap-10 items-start">

                            {/* Left Column: Video + Info */}
                            <div className="flex-grow flex flex-col gap-6">

                                {/* Video */}
                                <div className="relative pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
                                    <ReactPlayer
                                        url={`${import.meta.env.VITE_CLOUDFRONT_URL}/${course[0].modules[moduleId]['video_url']}`}
                                        // cloudfront url/aws key of each file
                                        controls
                                        // adds play/pause functionality
                                        pip
                                        // enables picture in picture
                                        width="100%"
                                        height="100%"
                                        className="absolute top-0 left-0"
                                    />
                                </div>

                                {/* Title */}
                                <h2 className="font-bold text-3xl">{course[0].course_name}</h2>

                                {/* Instructor Info + Enroll Button */}
                                <div className="flex items-center justify-between flex-wrap gap-4">

                                    {/* Instructor Info */}
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                course[0].instructor['gender'] === "FEMALE" ||
                                                    course[0].instructor['gender'] === "Female"
                                                    ? "../femaleInstructor.avif"
                                                    :
                                                    "../maleInstructor.jpg"
                                            }
                                            alt="Instructor"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                Instructor: {course[0].instructor.first_name} {course[0].instructor.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {course[0].instructor.qualification}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bookmark Button */}
                                    {sessionStorage.getItem("name") !== `${course[0].instructor.first_name} ${course[0].instructor.last_name}` && (
                                        <button
                                            className={`cursor-pointer text-white font-semibold px-4 py-2 rounded transition ${bookmark ? "bg-gray-500 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
                                                }`}
                                            onClick={courseBookmark}
                                        >
                                            {bookmark ? "Bookmarked" : "Bookmark"}
                                        </button>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-base text-white whitespace-pre-wrap">
                                    {course[0].description}
                                </p>
                            </div>

                            {/* Right Column: Modules */}
                            <div className="w-[400px] flex-shrink-0 flex flex-col gap-4">
                                <h3 className="text-center text-lg font-semibold text-white">Modules</h3>
                                {course[0].modules.map((module, index) => (
                                    <button
                                        key={index}
                                        className="cursor-pointer text-left text-black px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        onClick={() => { handleClick(index) }}
                                    >
                                        {index + 1}. {module.module_name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>


            ) : (
                <>
                    <p className="text-center font-semibold">Loading course details...</p>
                </>
            )}
        </>

    );
};

export default CoursePage;
